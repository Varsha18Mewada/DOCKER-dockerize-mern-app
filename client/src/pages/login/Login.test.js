import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { loginSuccess } from '../../slices/authSlice';
import { BrowserRouter as Router } from 'react-router-dom';
import { Login } from './Login';
import store from '../../app/store';
import { request } from '../../utils/request';
import { toast } from 'react-toastify';

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

describe('Login Component', () => {
  beforeAll(() => {
    console.error = jest.fn();
  });
  const mockDispatch = jest.spyOn(store, 'dispatch');

  it('renders Login form with username and password fields', () => {
    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
  it('displays error when username or password is not provided', async () => {
    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(
      await screen.findByText(/Username is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Password is required/i)
    ).toBeInTheDocument();
  });
  it('dispatches loginSuccess and navigates on successful login', async () => {
    const mockResponse = {
      token: 'mock-token',
      userId: 'mock-user-id',
      userName: 'mock-username',
    };

    request.mockResolvedValue(mockResponse);

    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );

    fireEvent.input(screen.getByLabelText(/Username/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.input(screen.getByLabelText(/Password/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        loginSuccess({
          token: mockResponse.token,
          id: mockResponse.userId,
          userName: mockResponse.userName,
        })
      );
      expect(localStorage.getItem('token')).toBe(mockResponse.token);
      expect(localStorage.getItem('userId')).toBe(mockResponse.userId);
      expect(localStorage.getItem('userName')).toBe(mockResponse.userName);
    });
  });
  test('displays error if username is invalid', async () => {
    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );
    fireEvent.input(screen.getByLabelText(/Username/i), {
      target: { value: 'invalidemail' },
    });
    fireEvent.input(screen.getByLabelText(/Password/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(
      await screen.findByText(/Please enter a valid email/i)
    ).toBeInTheDocument();
  });
  it('should show an error toast if login fails', async () => {
    request.mockRejectedValue(new Error('Failed to login user'));

    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );

    fireEvent.input(screen.getByLabelText(/username/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'Password123!' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to login user');
    });
  });
});
