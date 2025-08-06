import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { RecipeDetails } from './RecipeDetails';
import { request } from '../../utils/request';
import { ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom';

jest.mock('../../utils/request');
jest.mock('react-toastify');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

describe('RecipeDetails Component', () => {
  const mockRecipeData = {
    title: 'Test Recipe',
    steps: 'Step one',
    ingredients: ['Ingredient 1', 'Ingredient 2'],
    cookingTime: 30,
    ratingsAndComments: [
      { userName: 'John', rating: 4, comment: 'Great recipe!' },
      { userName: 'Jane', rating: 5, comment: 'Delicious!' },
    ],
    image: { data: { data: [1, 2, 3] }, contentType: 'image/jpeg' },
  };

  beforeEach(() => {
    useLocation.mockReturnValue({
      state: { recipeId: 1, title: 'Test Recipe' },
    });

    global.URL.createObjectURL = jest.fn(() => 'blob:test-image-url');
  });

  it('fetches recipe details and displays them correctly', async () => {
    request.mockResolvedValue({
      error: false,
      ...mockRecipeData,
    });
    render(
      <>
        <RecipeDetails />
        <ToastContainer />
      </>
    );
    // Wait for the API call to finish
    await waitFor(() => expect(request).toHaveBeenCalledTimes(1));
    expect(screen.getByText(/Test Recipe/i)).toBeInTheDocument();
    expect(screen.getByText(/Ingredients:/i)).toBeInTheDocument();

    const imgElement = screen.getByAltText(/Test Recipe/i);
    expect(imgElement).toBeInTheDocument();
    expect(imgElement.src).toContain('blob:test-image-url');
  });
});
