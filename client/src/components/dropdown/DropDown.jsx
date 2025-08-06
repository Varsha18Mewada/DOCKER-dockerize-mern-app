// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';

export const DropDown = ({
  itemsList,
  name,
  id,
  label,
  optionStyle,
  onChange,
  dataTestId,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
      }}
    >
      <label htmlFor={id}>{label}</label> &nbsp;&nbsp;
      <select
        name={name}
        id={id}
        style={{ borderRadius: '5px', outline: 'none', margin: '10px' }}
        className={optionStyle}
        onChange={onChange}
        data-test-id={dataTestId}
      >
        {itemsList.map((item, index) => {
          return (
            <option key={index} value={`${item.value}`}>
              {item.key}
            </option>
          );
        })}
      </select>
    </div>
  );
};

DropDown.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  optionStyle: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  itemsList: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  dataTestId: PropTypes.string,
};
