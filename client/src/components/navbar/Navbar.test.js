import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Provider } from 'react-redux';
import authReducer from '../../slices/authSlice';
import { configureStore } from '@reduxjs/toolkit';
import { logoutSuccess } from '../../slices/authSlice';
import { createMemoryHistory } from 'history';

// Mock Redux store with initial state
const mockStore = (initialState) => {
  return configureStore({
    reducer: {
      auth: (state = initialState.auth, action) => authReducer(state, action),
    },
    preloadedState: initialState,
  });
};

// Helper function to render components with providers
const renderWithProviders = (ui, { initialState }) => {
  const store = mockStore(initialState);
  return render(
    <Provider store={store}>
      <Router>{ui}</Router>
    </Provider>
  );
};

describe('Navbar Component', () => {
  // Test for rendering navbar when user is logged in
  it('renders navbar with logged in user', () => {
    // Mock the state of logged in user (with token)
    const initialState = {
      auth: { token: 'fake_token' },
    };

    renderWithProviders(<Navbar />, { initialState });

    // Check if navigation items are present
    expect(screen.getByText(/Recipes/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Recipe/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  //   Test for rendering navbar when user is logged out
  it('renders navbar with logged out user', () => {
    // Mock the state of logged out user (no token)
    const initialState = {
      auth: { token: null },
    };

    renderWithProviders(<Navbar />, { initialState });

    // Check if login and signup links are present
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/SignUp/i)).toBeInTheDocument();
  });
  it('logs out and redirects to login page on Logout click', () => {
    const initialState = {
      auth: { token: 'fake_token' },
    };
    const store = mockStore(initialState);

    // Mock functions for navigation and local storage
    const mockClear = jest.spyOn(Storage.prototype, 'clear');
    store.dispatch = jest.fn();

    // Setup history for Router
    const history = createMemoryHistory();

    render(
      <Provider store={store}>
        <Router location={history.location} navigator={history}>
          <Navbar />
        </Router>
      </Provider>
    );

    // Locate the Logout link
    const logoutLink = screen.getByText(/Logout/i);
    expect(logoutLink).toBeInTheDocument();

    // Simulate click on Logout link
    fireEvent.click(logoutLink);

    // Assert that local storage was cleared, logout action was dispatched, and navigation occurred
    expect(mockClear).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(logoutSuccess());
    expect(history.location.pathname).toBe('/');
  });
  // Test the correct closing of the menu on a link click
  it('closes the menu when a link is clicked', () => {
    const initialState = {
      auth: { token: 'fake_token' },
    };

    renderWithProviders(<Navbar />, { initialState });

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/Recipes/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Recipes/i));
  });
});
