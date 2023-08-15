import React from "react";
import PropTypes from "prop-types";

const CustomInput = (props) => {
  const { type, name, value, onChange, label } = props;

  return (
    <>
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
      />
    </>
  );
};

CustomInput.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default CustomInput;
