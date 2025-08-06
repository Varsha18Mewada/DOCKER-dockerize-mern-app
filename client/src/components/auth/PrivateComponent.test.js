import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PrivateComponent from './PrivateComponent';

// Mock Redux store with initial state
const mockStore = (initialState) => {
  return configureStore({
    reducer: {
      auth: (state = initialState.auth) => state,
    },
  });
};

describe('PrivateComponent', () => {
  it('should redirect to signup page when the user is not authenticated', () => {
    const store = mockStore({
      auth: {
        token: null,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/private']}>
          <PrivateComponent />
        </MemoryRouter>
      </Provider>
    );

    expect(window.location.pathname).toBe('/');
  });
});
