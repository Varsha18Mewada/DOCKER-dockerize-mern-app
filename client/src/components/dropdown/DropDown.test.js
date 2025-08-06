import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DropDown } from './DropDown';

describe('DropDown component', () => {
  // Test case 1: Renders the dropdown with correct label and options
  it('should render the dropdown with the correct label and options', () => {
    const itemsList = [
      { key: 'Option 1', value: 1 },
      { key: 'Option 2', value: 2 },
      { key: 'Option 3', value: 3 },
    ];

    render(
      <DropDown
        itemsList={itemsList}
        name="test"
        id="dropdown"
        label="Select an option"
        optionStyle="custom-option"
        onChange={() => {}}
      />
    );

    // Check if the label is rendered
    const label = screen.getByLabelText(/Select an option/i);
    expect(label).toBeInTheDocument();

    // Check if all options are rendered correctly
    itemsList.forEach((item) => {
      expect(screen.getByText(item.key)).toBeInTheDocument();
    });
  });
  // Test case 2: Calls the onChange function when an option is selected
  it('should call the onChange handler when an option is selected', () => {
    const handleChange = jest.fn();
    const itemsList = [
      { key: 'Option 1', value: 1 },
      { key: 'Option 2', value: 2 },
      { key: 'Option 3', value: 3 },
    ];

    render(
      <DropDown
        itemsList={itemsList}
        name="test"
        id="dropdown"
        label="Select an option"
        optionStyle="custom-option"
        onChange={handleChange}
      />
    );

    const dropdwonBtn = screen.getByRole('combobox');
    expect(dropdwonBtn).toHaveAttribute('id', 'dropdown');
    fireEvent.change(dropdwonBtn);
    expect(handleChange).toHaveBeenCalled();
  });
  // Test case 4: Should render options with the correct values
  it('should render options with correct values and text', () => {
    const itemsList = [
      { key: 'Option 1', value: 1 },
      { key: 'Option 2', value: 2 },
    ];
    render(
      <DropDown
        itemsList={itemsList}
        name="test"
        id="dropdown"
        label="Select an option"
        optionStyle="custom-option"
        onChange={() => {}}
      />
    );

    // Check the options inside the dropdown
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(itemsList.length);

    // Check the value and text for each option
    itemsList.forEach((item, index) => {
      expect(options[index]).toHaveValue(`${item.value}`);
      expect(options[index]).toHaveTextContent(item.key);
    });
  });
  // Test case 5: Should render dropdown without crashing when no items are passed
  it('should render without crashing when no items are passed', () => {
    render(
      <DropDown
        itemsList={[]}
        name="test"
        id="dropdown"
        label="Select an option"
        optionStyle="custom-option"
        onChange={() => {}}
      />
    );

    // Check if the dropdown is rendered even with no options
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
