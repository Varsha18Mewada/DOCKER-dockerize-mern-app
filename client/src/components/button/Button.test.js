import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('should render button with the correct text', () => {
    render(
      <Button type="button" onClick={() => {}}>
        Click
      </Button>
    );
    // Check if the button has the correct text
    const button = screen.getByText('Click');
    expect(button).toBeInTheDocument();
  });

  // Test 2: Ensures that the onClick handler is called when the button is clicked
  it('should call the onClick handler when clicked', () => {
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Click</Button>);

    // Simulate a click event on the button
    fireEvent.click(screen.getByText('Click'));

    // Check if the onClick handler was called
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  // Test 3: Ensures the button has the default type of 'button'
  it('should render the button with default type "button"', () => {
    render(<Button>Click Me</Button>);

    // Check if the button has the correct type
    const button = screen.getByText('Click Me');
    expect(button).toHaveAttribute('type', 'button');
  });

  // Test 4: Ensures the button renders with a custom type, like 'submit'
  it('should render the button with a custom type', () => {
    render(<Button type="submit">Submit</Button>);

    // Check if the button has the correct type
    const button = screen.getByText('Submit');
    expect(button).toHaveAttribute('type', 'submit');
  });

  // Test 5: Ensures the button accepts and renders with a custom className
  it('should apply a custom className', () => {
    render(<Button className="custom-button">Click Me</Button>);

    // Check if the button has the custom class
    const button = screen.getByText('Click Me');
    expect(button).toHaveClass('custom-button');
  });
});
