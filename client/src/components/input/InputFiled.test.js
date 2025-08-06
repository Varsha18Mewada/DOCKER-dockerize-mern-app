import React from 'react';
import { render, screen } from '@testing-library/react';
import InputField from './InputField';

describe('InputField', () => {
  it('should render label and input element with the correct props', () => {
    render(
      <InputField
        label="Username"
        id="username"
        error=""
        type="text"
        value=""
        onChange={() => {}}
      />
    );

    const label = screen.getByLabelText('Username');
    expect(label).toBeInTheDocument();

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'username');
    expect(input).toHaveAttribute('type', 'text');
  });
});
