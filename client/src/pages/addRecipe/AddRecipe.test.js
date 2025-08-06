import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter as Router } from 'react-router-dom';
import { AddRecipe } from './AddRecipe.jsx';
import authReducer from '../../slices/authSlice';
import { ToastContainer } from 'react-toastify';
import { Messages } from '../../utils/messages';
import { toast } from 'react-toastify';
import 'jest-canvas-mock';

jest.mock('../../utils/request', () => ({
  request: jest.fn().mockResolvedValue({
    error: false,
  }),
}));

jest.mock('react-toastify', () => ({
  ...jest.requireActual('react-toastify'),
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock Redux store with initial state
const mockStore = (initialState) => {
  return configureStore({
    reducer: {
      auth: (state = initialState.auth, action) => authReducer(state, action),
    },
    preloadedState: initialState,
  });
};

const renderWithProviders = (ui, { initialState }) => {
  const store = mockStore(initialState);
  return render(
    <Provider store={store}>
      <Router>{ui}</Router>
    </Provider>
  );
};

describe('AddRecipe Component', () => {
  const initialState = { auth: { id: 'user123' } };

  beforeEach(() => {
    renderWithProviders(
      <>
        <AddRecipe />
        <ToastContainer />
      </>,
      { initialState }
    );
  });

  it('renders form fields correctly', () => {
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ingredients/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Steps/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Upload Image/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Cooking Time \(minutes\)/i)
    ).toBeInTheDocument();
  });

  it('displays validation error if required fields are missing', async () => {
    const submitButton = screen.getByRole('button', { name: /Create Recipe/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Cooking time must be at least 1 minute/i)
      ).toBeInTheDocument();
    });
  });

  it('adds an ingredient input when "Add Ingredient" button is clicked', () => {
    const addIngredientButton = screen.getByRole('button', {
      name: /Add Ingredient/i,
    });
    fireEvent.click(addIngredientButton);

    // After clicking, there should be two ingredient inputs
    const ingredientInputs = screen.getAllByLabelText(/Ingredients/i);
    expect(ingredientInputs).toHaveLength(2);
  });

  it('handles form submission with valid data', async () => {
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Title/i), {
        target: { value: 'Test Recipe' },
      });
      fireEvent.change(screen.getAllByLabelText(/Ingredients/i)[0], {
        target: { value: 'Salt' },
      });
      fireEvent.change(screen.getByLabelText(/Steps/i), {
        target: { value: 'Step 1: Mix ingredients' },
      });
      fireEvent.change(screen.getByLabelText(/Cooking Time \(minutes\)/i), {
        target: { value: 15 },
      });

      const fileInput = screen.getByLabelText(/Upload Image/i);
      const testFile = new File(['dummy content'], 'test.png', {
        type: 'image/png',
      });
      fireEvent.change(fileInput, { target: { files: [testFile] } });

      const submitButton = screen.getByRole('button', {
        name: /Create Recipe/i,
      });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      // Verify success toast is called
      expect(toast.success).toHaveBeenCalledWith(
        Messages.success.RECIPE_CREATED
      );
    });
  });

  it('displays an error message if no image is uploaded', async () => {
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Title/i), {
        target: { value: 'Test Recipe' },
      });
      fireEvent.change(screen.getAllByLabelText(/Ingredients/i)[0], {
        target: { value: 'Salt' },
      });
      fireEvent.change(screen.getByLabelText(/Steps/i), {
        target: { value: 'Step 1: Mix ingredients' },
      });
      fireEvent.change(screen.getByLabelText(/Cooking Time \(minutes\)/i), {
        target: { value: 15 },
      });
      const submitButton = screen.getByRole('button', {
        name: /Create Recipe/i,
      });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        Messages.errors.REQUIRED_IMAGE_FIELDS
      );
    });
  });
});
