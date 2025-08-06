import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Rating } from 'react-simple-star-rating';
import { request } from '../../utils/request';
import { API, ApiMethods } from '../../utils/util';
import { Messages } from '../../utils/messages';

export const RecipeDetails = () => {
  const [recipeDetails, setRecipeDetails] = useState([]);
  const [image, setImage] = useState('');
  const location = useLocation();

  const fetchRecipeDetails = async () => {
    try {
      const response = await request({
        method: ApiMethods.GET,
        url: API.recipeAPI.recipeDetails,
        params: {
          recipeId: location.state.recipeId,
        },
      });
      if (!response.error) {
        const blob = new Blob([Int8Array.from(response.image.data.data)], {
          type: response.image.contentType,
        });
        const image = window.URL.createObjectURL(blob);
        setImage(image);
        setRecipeDetails(response);
      } else {
        toast.error(Messages.errors.UNABLE_TO_GET_RECIPES);
      }
    } catch (error) {
      console.log(error);
      toast.error(Messages.errors.UNABLE_TO_GET_RECIPES);
    }
  };
  useEffect(() => {
    fetchRecipeDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div style={{ marginTop: '60px' }}>
        <ToastContainer />
        <ul style={{ display: 'flex', justifyContent: 'center' }}>
          <li>
            <h1>{location?.state?.title}</h1>

            <div style={{ margin: '20px', width: '70%' }}>
              {recipeDetails?.steps?.match(/^\d+\./) ? (
                <div>
                  {recipeDetails.steps.split('\n').map((step, index) => (
                    <p key={index}>{step}</p>
                  ))}
                </div>
              ) : (
                <ol>
                  {recipeDetails?.steps
                    ?.split('\n')
                    ?.map((step, index) => step && <li key={index}>{step}</li>)}
                </ol>
              )}
            </div>
            <img
              src={image}
              alt={recipeDetails.title}
              style={{
                width: '80%',
                height: '500px',
              }}
            />
            <h3>Ingredients:</h3>
            <ul>
              {recipeDetails?.ingredients?.length > 0 && (
                <ul>
                  {recipeDetails?.ingredients?.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              )}
            </ul>
            <p>Cooking Time: {recipeDetails?.cookingTime} minutes</p>
            {recipeDetails?.ratingsAndComments?.length > 0 && (
              <div>
                <h1>Customer Ratings and Comments</h1>
                {recipeDetails.ratingsAndComments.map((entry, index) => (
                  <div key={index}>
                    <h4>{entry.userName}</h4>
                    <Rating initialValue={entry.rating} size="15" readonly />
                    <br />
                    <p style={{ maxWidth: '80%' }}>{entry.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};
