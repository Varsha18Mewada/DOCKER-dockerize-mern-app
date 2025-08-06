import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '../../components/input/InputField';
import Button from '../../components/button/Button';
import TextareaField from '../../components/textarea/TextareaField';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { request } from '../../utils/request';
import { useSelector } from 'react-redux';
import { API, ApiMethods } from '../../utils/util';
import { Messages } from '../../utils/messages';
import './AddRecipe.css';

export const AddRecipe = () => {
  const { id } = useSelector((state) => state.auth);
  const [image, setImage] = useState(null);
  const [steps, setSteps] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      cookingTime: 0,
      userOwner: id,
    },
  });

  const handleChange = (event) => {
    const { value } = event.target;
    setSteps(value);
  };

  /** Handle image file selection */
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  /** Handle ingredient change */
  const handleIngredientChange = (event, index) => {
    const { value } = event.target;
    const newIngredients = [...ingredients];
    newIngredients[index] = value; /** Update the specific ingredient  */
    setIngredients(newIngredients); /** Set updated ingredients array */
  };

  /** Handle adding a new ingredient input field */
  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      '',
    ]); /** Add an empty string to the ingredients array */
  };

  const onSubmit = async (data) => {
    if (!ingredients || !steps) {
      return toast.error(Messages.errors.REQUIRED_FIELDS);
    }
    if (!image) {
      return toast.error(Messages.errors.REQUIRED_IMAGE_FIELDS);
    }
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('ingredients', ingredients);
    formData.append('steps', steps);
    formData.append('cookingTime', data.cookingTime);
    formData.append('userOwner', data.userOwner);
    formData.append('image', image);

    try {
      const response = await request({
        url: API.recipeAPI.recipe,
        method: ApiMethods.POST,
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (!response.error) {
        toast.success(Messages.success.RECIPE_CREATED);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="create-recipe">
        <h2>Create Recipe</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            type="text"
            id="title"
            label="Title"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && (
            <span className="error">{errors.title.message}</span>
          )}
          {ingredients.map((ingredient, index) => (
            <div key={index}>
              <InputField
                type="text"
                key={index}
                id={index + ''}
                label={'Ingredients'}
                value={ingredient}
                onChange={(event) => handleIngredientChange(event, index)}
              />
            </div>
          ))}
          <Button
            type="button"
            onClick={handleAddIngredient}
            className={'btn-ingredents'}
            role="button"
          >
            Add Ingredient
          </Button>
          <TextareaField
            id="steps"
            name="steps"
            value={steps}
            onChange={handleChange}
            label={'Steps'}
          />
          <InputField
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            label={'Upload Image'}
          />
          <InputField
            type="number"
            id="cookingTime"
            name="cookingTime"
            label={'Cooking Time (minutes)'}
            {...register('cookingTime', {
              required: 'Cooking Time is required',
              min: {
                value: 1,
                message: 'Cooking time must be at least 1 minute',
              },
            })}
          />
          {errors.cookingTime && (
            <span className="error">{errors.cookingTime.message}</span>
          )}
          <Button type="submit" className={'btn-create-recipe'} role="button">
            Create Recipe
          </Button>
        </form>
      </div>
    </>
  );
};
