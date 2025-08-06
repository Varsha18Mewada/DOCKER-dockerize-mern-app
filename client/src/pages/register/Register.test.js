import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Register } from './Register';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import store from '../../app/store';
import { request } from '../../utils/request';

// Mock the toastify library
jest.mock('react-toastify', () => ({
  ...jest.requireActual('react-toastify'),
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

jest.mock('../../utils/request', () => ({
  request: jest.fn().mockResolvedValue({
    error: false,
  }),
}));

describe('Register Component', () => {
  beforeAll(() => {
    console.error = jest.fn();
    jest.clearAllMocks();
  });

  it('should render the registration form', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Register/i })
    ).toBeInTheDocument();
  });

  it('should display validation errors when the form is submitted empty', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.submit(screen.getByTestId('register', { name: /Register/i }));

    await waitFor(() => {
      expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  it('should display a warning when registration fails with an error message', async () => {
    request.mockResolvedValue({ error: 'Username already exists' });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.input(screen.getByLabelText(/Full Name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.input(screen.getByLabelText(/Username/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.input(screen.getByLabelText(/Password/i), {
      target: { value: 'Password123!' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(toast.warn).toHaveBeenCalledWith('Username already exists');
    });
  });

  it('should navigate to login on successful registration', async () => {
    const mockResponse = { message: 'User registered successfully' };
    request.mockResolvedValue(mockResponse);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.input(screen.getByLabelText(/Full Name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.input(screen.getByLabelText(/Username/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.input(screen.getByLabelText(/Password/i), {
      target: { value: 'Password123!' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'User registered successfully'
      );
    });
  });

  it('should display an error toast if the registration throws an error', async () => {
    request.mockRejectedValue(new Error('Network Error'));

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.input(screen.getByLabelText(/Full Name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.input(screen.getByLabelText(/Username/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.input(screen.getByLabelText(/Password/i), {
      target: { value: 'Password123!' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'An error occurred while registering user'
      );
    });
  });
});
