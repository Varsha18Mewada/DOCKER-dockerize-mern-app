import React from 'react';
import PropTypes from 'prop-types';

const InputField = React.forwardRef(
  ({ label, error, isBr = false, ...props }, ref) => {
    return (
      <div>
        <label htmlFor={props?.id}>{label}</label>
        {!isBr && <br />}
        <input ref={ref} {...props} />
        <span className="error">{error}</span>
      </div>
    );
  }
);

// Adding displayName for better debugging
InputField.displayName = 'InputField';

// Prop validation with PropTypes
InputField.propTypes = {
  isBr: PropTypes.bool,
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};

export default InputField;
