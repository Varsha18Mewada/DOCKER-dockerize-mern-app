import React from 'react';

const TextareaField = ({
  label,
  name,
  value,
  onChange,
  id,
  placeholder,
  className,
}) => {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
      ></textarea>
    </>
  );
};

export default TextareaField;
