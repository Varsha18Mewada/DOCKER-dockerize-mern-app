import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TextareaField from './TextareaField';

describe('TextareaField Component', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    label: 'Description',
    name: 'description',
    value: '',
    onChange: mockOnChange,
    id: 'textarea-1',
    placeholder: 'Enter text here',
    className: 'textarea-class',
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders the label and textarea with correct props', () => {
    render(<TextareaField {...defaultProps} />);

    // Check for label rendering
    const label = screen.getByLabelText(/Description/i);
    expect(label).toBeInTheDocument();

    // Check for textarea rendering
    const textarea = screen.getByPlaceholderText(/Enter text here/i);
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('name', defaultProps.name);
    expect(textarea).toHaveAttribute('id', defaultProps.id);
    expect(textarea).toHaveClass(defaultProps.className);
  });

  it('displays the correct initial value', () => {
    render(<TextareaField {...defaultProps} value="Initial text" />);
    const textarea = screen.getByPlaceholderText(/Enter text here/i);
    expect(textarea).toHaveValue('Initial text');
  });

  it('calls onChange handler when text is entered', () => {
    render(<TextareaField {...defaultProps} />);
    const textarea = screen.getByPlaceholderText(/Enter text here/i);

    // Simulate typing into textarea
    fireEvent.change(textarea, { target: { value: 'New text' } });
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it('updates the value correctly when props change', () => {
    const { rerender } = render(
      <TextareaField {...defaultProps} value="Text1" />
    );
    const textarea = screen.getByPlaceholderText(/Enter text here/i);

    // Check initial value
    expect(textarea).toHaveValue('Text1');

    // Update props and re-render
    rerender(<TextareaField {...defaultProps} value="Text2" />);
    expect(textarea).toHaveValue('Text2');
  });
});
