import React from 'react';
import {
  render,
  waitFor,
  screen,
  fireEvent,
  within,
} from '@testing-library/react';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { request } from '../../utils/request';
import configureStore from 'redux-mock-store';
import { toast } from 'react-toastify';
import { Messages } from '../../utils/messages';
import { API, ApiMethods } from '../../utils/util';
import { useNavigate } from 'react-router-dom';
import { ViewAllRecipes } from './ViewAllRecipes';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../../utils/request', () => ({
  request: jest.fn(),
}));

jest.mock('react-simple-star-rating', () => ({
  Rating: ({ onClick, initialValue, readonly, className }) => (
    <div
      data-testid={'rating' + className}
      onClick={() => onClick && onClick(initialValue)}
    >
      {initialValue}
    </div>
  ),
}));

jest.mock('react-toastify', () => ({
  ...jest.requireActual('react-toastify'),
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Create a mock store for Redux
const mockStore = configureStore([]);
const store = mockStore({
  auth: {
    id: 'user123',
    userName: 'testUser',
  },
});

const mockRecipes = [
  {
    _id: '1',
    title: 'Test Recipe',
    steps: 'Step one.\nStep two.\nStep three.',
    ingredients: ['Ingredient 1', 'Ingredient 2'],
    cookingTime: 60,
    ratingsAndComments: [
      { userName: 'John', rating: 4, comment: 'Great recipe!' },
      { userName: 'Jane', rating: 5, comment: 'Delicious!' },
    ],
    image: { data: { data: [1, 2, 3] }, contentType: 'image/jpeg' },
    averageRating: 4,
  },
  {
    _id: '2',
    title: 'Another Recipe',
    steps: 'Step one.\nStep two.',
    ingredients: ['Ingredient A', 'Ingredient B'],
    cookingTime: 45,
    ratingsAndComments: [{ userName: 'Jane', rating: 3, comment: 'Yummy!' }],
    image: { data: { data: [4, 5, 6] }, contentType: 'image/jpeg' },
    averageRating: 5,
  },
];

describe('ViewAllRecipes', () => {
  let navigate;
  beforeEach(() => {
    request.mockResolvedValueOnce(mockRecipes);
    global.URL.createObjectURL = jest.fn(() => 'blob:test-image-url');
    navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
  });

  it('should render recipes correctly', async () => {
    render(
      <Provider store={store}>
        <ViewAllRecipes />
        <ToastContainer />
      </Provider>
    );

    await waitFor(() => expect(request).toHaveBeenCalledTimes(1));
    expect(screen.getByText(/Test Recipe/i)).toBeInTheDocument();

    const imgElement = screen.getByAltText(/Test Recipe/i);
    expect(imgElement).toBeInTheDocument();
    expect(imgElement.src).toContain('blob:test-image-url');
    jest.clearAllMocks();
  });

  it('should add a comment to a recipe', async () => {
    const initialState = {
      auth: { token: null, userId: null, userName: null },
    };
    request.mockResolvedValueOnce({
      error: false,
      message: 'Comment added successfully!',
    });

    render(
      <Provider store={mockStore(initialState)}>
        <ViewAllRecipes />
      </Provider>
    );

    // Wait for recipes to be loaded
    await waitFor(() => expect(request).toHaveBeenCalledTimes(1));
    const firstRecipe = screen.getByText(/Test Recipe/i).closest('li');
    const commentInput =
      within(firstRecipe).getByPlaceholderText('Add comment');
    fireEvent.change(commentInput, {
      target: { value: 'This is a great recipe!' },
    });

    const addCommentButton = within(firstRecipe).getByRole('button', {
      name: /add comment/i,
    });
    fireEvent.click(addCommentButton);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith('Comment added successfully!')
    );
    jest.clearAllMocks();
  });

  it('should search for recipes and update the list based on search term', async () => {
    const searchTerm = 'Test Recipe';

    // Mock response to simulate search
    request.mockResolvedValueOnce(
      mockRecipes.filter((recipe) => recipe.title.includes(searchTerm))
    );

    render(
      <Provider store={store}>
        <ViewAllRecipes />
        <ToastContainer />
      </Provider>
    );

    // Wait for the component to render the recipes
    await waitFor(() => expect(request).toHaveBeenCalledTimes(1));

    // Find the search input and simulate typing
    const searchInput = screen.getByPlaceholderText(/Search recipes/i);
    fireEvent.change(searchInput, { target: { value: searchTerm } });

    // Wait for the recipes to update after the search
    await waitFor(() => expect(request).toHaveBeenCalledTimes(2));

    // Check if the correct recipes are displayed
    expect(screen.getByText(/Test Recipe/i)).toBeInTheDocument();
    expect(screen.queryByText(/Another Recipe/i)).toBeNull();
    jest.clearAllMocks();
  });

  it('should fetch all recipes when search input is cleared', async () => {
    const searchTerm = 'Test Recipe';

    // Mock response to simulate search and fetching all recipes
    request.mockResolvedValueOnce(mockRecipes);
    request.mockResolvedValueOnce(mockRecipes);

    render(
      <Provider store={store}>
        <ViewAllRecipes />
        <ToastContainer />
      </Provider>
    );

    await waitFor(() => expect(request).toHaveBeenCalledTimes(1));
    const searchInput = screen.getByPlaceholderText(/Search recipes/i);
    fireEvent.change(searchInput, { target: { value: searchTerm } });
    await waitFor(() => expect(request).toHaveBeenCalledTimes(2));
    fireEvent.change(searchInput, { target: { value: '' } });
    await waitFor(() => expect(request).toHaveBeenCalledTimes(3));
    expect(screen.getByText(/Test Recipe/i)).toBeInTheDocument();
    expect(screen.getByText(/Another Recipe/i)).toBeInTheDocument();
    jest.clearAllMocks();
  });

  it('should show "No recipes found" when no recipes match the search term', async () => {
    const searchTerm = 'Nonexistent Recipe';
    request.mockResolvedValueOnce([]);

    render(
      <Provider store={store}>
        <ViewAllRecipes />
        <ToastContainer />
      </Provider>
    );

    await waitFor(() => expect(request).toHaveBeenCalledTimes(1));
    const searchInput = screen.getByPlaceholderText(/Search recipes/i);
    fireEvent.change(searchInput, { target: { value: searchTerm } });
    await waitFor(() => expect(request).toHaveBeenCalledTimes(2));

    expect(screen.getByText(/No Recipes Found/i)).toBeInTheDocument();
    jest.clearAllMocks();
  });

  it('should show error toast when search fails', async () => {
    const searchTerm = 'Test Recipe';

    // Mock request to simulate an error
    request.mockRejectedValueOnce(new Error('Unable to fetch recipes'));

    render(
      <Provider store={store}>
        <ViewAllRecipes />
        <ToastContainer />
      </Provider>
    );

    // Find the search input and simulate typing
    const searchInput = screen.getByPlaceholderText(/Search recipes/i);
    fireEvent.change(searchInput, { target: { value: searchTerm } });

    // Wait for the error to be triggered
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(Messages.errors.UNABLE_TO_SEARCH)
    );
    jest.clearAllMocks();
  });

  it('should filter recipes based on the selected rating', async () => {
    render(
      <Provider store={store}>
        <ViewAllRecipes />
        <ToastContainer />
      </Provider>
    );

    await waitFor(() => screen.getByText('Test Recipe'));
    const ratingDropdown = screen.getByLabelText(/Ratings/i);
    fireEvent.change(ratingDropdown, { target: { value: '4' } });

    await waitFor(() =>
      expect(request).toHaveBeenCalledWith({
        method: ApiMethods.GET,
        url: `${API.recipeAPI.recipe}?rating=4`,
      })
    );
    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    jest.clearAllMocks();
  });

  it('should filter recipes based on the cooking time', async () => {
    request.mockResolvedValueOnce(mockRecipes);
    render(
      <Provider store={store}>
        <ViewAllRecipes />
        <ToastContainer />
      </Provider>
    );

    // await waitFor(() => screen.getByText('Test Recipe'));
    const timeDropdown = screen.getByLabelText(/CookingTime/i);
    fireEvent.change(timeDropdown, { target: { value: '60' } });

    await waitFor(() =>
      expect(request).toHaveBeenCalledWith({
        method: ApiMethods.GET,
        url: `${API.recipeAPI.recipe}?cookingTime=60`,
      })
    );
    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    jest.clearAllMocks();
  });

  it('should reset filters and fetch all recipes', async () => {
    const fetchRecipesMock = jest.fn();

    render(
      <Provider store={store}>
        <ViewAllRecipes fetchRecipes={fetchRecipesMock} />
        <ToastContainer />
      </Provider>
    );

    await waitFor(() => expect(request).toHaveBeenCalledTimes(1));

    const clearRatingButton = screen.getByTestId('clear-rating-button');
    fireEvent.click(clearRatingButton);

    await waitFor(() =>
      expect(request).toHaveBeenCalledWith({
        method: 'get',
        url: 'recipe?',
      })
    );
    jest.clearAllMocks();
  });

  it('should navigate to recipe details when image is clicked', async () => {
    const fetchRecipesMock = jest.fn();
    render(
      <Provider store={store}>
        <ViewAllRecipes fetchRecipes={fetchRecipesMock} />
        <ToastContainer />
      </Provider>
    );
    navigate = useNavigate();

    await waitFor(() => screen.getByAltText('Test Recipe'));
    const image = screen.getByAltText('Test Recipe');
    fireEvent.click(image);
    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith('/recipe/1', {
        state: {
          recipeId: '1',
          title: 'Test Recipe',
        },
      })
    );
    jest.clearAllMocks();
  });
  it('should handle rating a recipe', async () => {
    request.mockResolvedValueOnce({ message: 'Rating added successfully' });

    render(
      <Provider store={store}>
        <ViewAllRecipes />
        <ToastContainer />
      </Provider>
    );
    await waitFor(() => screen.getByText('Test Recipe'));
    const ratingComponent = screen.getByTestId('rating0');
    fireEvent.click(ratingComponent);
    jest.clearAllMocks();
  });
});
