import React from 'react';
const Button = ({ type = 'button', onClick, className, children, id }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      data-testid={id}
    >
      {children}
    </button>
  );
};

export default Button;
