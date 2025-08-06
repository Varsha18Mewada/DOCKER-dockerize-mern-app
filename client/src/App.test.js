import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the Navbar and Routing components
jest.mock('./components/navbar/Navbar', () => ({
  Navbar: () => <div data-testid="navbar">Mock Navbar</div>,
}));

jest.mock('./routes/Routing', () => ({
  Routing: () => <div data-testid="routing">Mock Routing</div>,
}));

describe('App Component', () => {
  it('should render Navbar and Routing components', () => {
    render(<App />);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toHaveTextContent('Mock Navbar');

    expect(screen.getByTestId('routing')).toBeInTheDocument();
    expect(screen.getByTestId('routing')).toHaveTextContent('Mock Routing');
  });
});
