import React, { useEffect, useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import { request } from '../../utils/request';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import InputField from '../../components/input/InputField';
import TextareaField from '../../components/textarea/TextareaField';
import { useSelector } from 'react-redux';
import Button from '../../components/button/Button';
import { API, ApiMethods } from '../../utils/util';
import { Messages } from '../../utils/messages';
import { DropDown } from '../../components/dropdown/DropDown';
import { cookingTimeData, ratingData } from '../../utils/appConstants';
import './ViewAllRecipes.css';

export const ViewAllRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [images, setImages] = useState([]);
  const [comments, setComments] = useState({});
  const [rating, setRating] = useState(0);
  const { id, userName } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async (filters = {}) => {
    try {
      // Construct query parameters based on the filters provided
      const queryParams = new URLSearchParams(filters).toString();

      const response = await request({
        method: ApiMethods.GET,
        url: `${API.recipeAPI.recipe}?${queryParams}`,
      });
      if (!response.error) {
        // Generate Blob URLs for each recipe image
        const recipeImages = response.map((recipe) => {
          const blob = new Blob([Int8Array.from(recipe.image.data.data)], {
            type: recipe.image.contentType,
          });

          return window.URL.createObjectURL(blob);
        });
        setRecipes(response);
        setImages(recipeImages);
      } else {
        setRecipes([]); // Clear recipes if there's an error
      }
    } catch (error) {
      console.log(error);
    }
  };

  const SearchRecipes = async (e) => {
    try {
      // If there's a search term, fetch searched recipes
      if (e.target.value) {
        let Searchedrecipes = await request({
          url: `${API.recipeAPI.searchRecipes}/${e.target.value}`,
          method: ApiMethods.GET,
        });
        // Set the searched recipes or empty if none found
        if (!Searchedrecipes.message) {
          setRecipes(Searchedrecipes);
        } else {
          setRecipes([]);
        }
      } else {
        fetchRecipes();
      }
    } catch (error) {
      console.log(error);
      toast.error(Messages.errors.UNABLE_TO_SEARCH);
    }
  };

  const handleRating = async (rating, recipeId) => {
    // Send the rating data to the backend to save it
    try {
      const response = await request({
        url: API.recipeAPI.rateRecipe,
        method: ApiMethods.POST,
        body: {
          rating: rating,
          recipeId: recipeId,
          userId: id,
          userName: userName,
        },
      });
      if (!response.error) {
        setRating(0);
        toast.success(response.message);
        fetchRecipes(); // Re-fetch the recipes to show updated ratings
      } else {
        toast.error(response?.error); // Show error message if rating fails
      }
    } catch (error) {
      console.log(error);
      toast.error(Messages.errors.RATING_NOT_ADDED);
    }
  };
  const handleAddComment = async (recipeId) => {
    const comment = comments[recipeId]; // Get the comment for the specific recipe
    try {
      // Ensure that the comment is not empty before proceeding
      if (!comment) {
        return toast.error(Messages.errors.COMMENT_CAN_NOT_EMPTY);
      }

      // Send the comment to the backend to save it
      const response = await request({
        url: API.recipeAPI.commentRecipe,
        method: ApiMethods.POST,
        body: {
          comment: comment,
          recipeId: recipeId,
          userId: id,
          userName: userName,
        },
      });
      if (!response.error) {
        setComments('');
        toast.success(response.message);
        fetchRecipes(); // Re-fetch recipes to show updated comments
      } else {
        toast.error(response?.error);
      }
    } catch (error) {
      console.log(error);
      toast.error(Messages.errors.COMMENT_NOT_ADDED);
    }
  };

  const handleRatingsFilter = (event) => {
    const rating = event.target.value;
    fetchRecipes({ rating }); // Fetch recipes with the selected rating filter
  };

  // Handler for cooking time filter
  const handleCookingTimeFilter = (event) => {
    const cookingTime = event.target.value;
    fetchRecipes({ cookingTime }); // Fetch recipes with the selected cooking time filter
  };

  // Handler for resetting filters (optional)
  const handleResetFilters = () => {
    fetchRecipes(); // Fetch all recipes when no filters are applied
  };
  return (
    <div style={{ marginTop: '60px' }}>
      <h1>Recipes</h1>
      <ToastContainer />
      <div className="filters">
        <div className="rating-filter">
          <DropDown
            id="ratings"
            itemsList={ratingData} // Dropdown for rating filter
            label="Ratings  "
            optionStyle={'stars'}
            onChange={handleRatingsFilter}
          />
          <Button
            className={'clear clear-rating'}
            onClick={handleResetFilters}
            id="clear-rating-button"
            aria-label="Clear Rating Filter"
          >
            Clear Filter
          </Button>
        </div>
        <div className="time-filter">
          <DropDown
            id="cookingTime"
            itemsList={cookingTimeData}
            label="CookingTime  "
            onChange={handleCookingTimeFilter}
            optionStyle={'time'}
          />
          <Button
            className={'clear clear-time'}
            onClick={handleResetFilters}
            id="clear-time-button"
          >
            Clear Filter
          </Button>
        </div>
        <div className="search-bar">
          <InputField
            type="text"
            className="search-input"
            placeholder="Search recipes"
            onChange={(e) => SearchRecipes(e)}
            isBr={true}
            id="search"
          />
        </div>
      </div>
      {recipes.length > 0 ? (
        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          }}
        >
          {recipes?.map((recipe, index) => (
            <li key={recipe._id}>
              <div>
                <h2>{recipe.title}</h2>
              </div>
              <div style={{ margin: '20px', width: '400px' }}>
                {recipe.steps.match(/^\d+\./) ? (
                  <div>
                    {recipe.steps.split('\n').map((step, index) => (
                      <p key={index}>{step}</p>
                    ))}
                  </div>
                ) : (
                  <ol>
                    {recipe.steps
                      .split('\n')
                      .map(
                        (step, index) => step && <li key={index}>{step}</li>
                      )}
                  </ol>
                )}
              </div>
              <img
                src={images[index]} // Display the image for the recipe
                alt={recipe.title}
                onClick={() => {
                  navigate();
                  navigate(`/recipe/${recipe._id}`, {
                    state: {
                      recipeId: recipe._id,
                      title: recipe.title,
                    },
                  });
                }}
              />
              <div>
                <h3>Average Rating</h3>
                <Rating readonly initialValue={recipe?.averageRating} />{' '}
                {/* Display recipe average rating */}
              </div>
              <h3>Ingredients:</h3>
              <ul>
                {recipe.ingredients.length > 0 && (
                  <ul>
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                )}
              </ul>
              <TextareaField
                placeholder={'Add comment'}
                className="add-comment"
                onChange={(event) =>
                  setComments((prev) => ({
                    ...prev,
                    [recipe._id]: event.target.value, // Update the comment for the specific recipe
                  }))
                }
                value={comments[recipe._id] || ''} // Get the comment for the specific recipe
              />
              <br />
              <Button
                data-testid="addComment"
                className={'btn-add-comment'}
                type="button"
                onClick={() => handleAddComment(recipe._id)} // Handle comment submission
                role="button"
              >
                Add comment
              </Button>
              <br />
              <Rating
                onClick={(rate) => handleRating(rate, recipe._id)} // Handle rating submission
                emptyColor="gray"
                initialValue={rating}
                value={rating}
                className={`${index}`}
              />
              <p>Cooking Time: {recipe.cookingTime} minutes</p>

              {recipe.ratingsAndComments.length > 0 && (
                <div style={{ width: '400px' }}>
                  <h1>Customer Ratings and Comments</h1>

                  {recipe.ratingsAndComments.map((entry, index) => (
                    <div key={index}>
                      <h4>{entry.userName}</h4>
                      <Rating initialValue={entry.rating} size="15" readonly />
                      <br />
                      <p>{entry.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <h2>{Messages.success.RECIPE_NOT_FOUND}</h2>
      )}
    </div>
  );
};
