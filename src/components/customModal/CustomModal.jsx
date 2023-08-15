import React from "react";

const CustomModal = (props) => {
  const { name, image, price, description, onClick } = props;

  return (
    <div>
      <div onClick={onClick}>
        <img src={image} />
        <h2>{name}</h2>
        <p>{price}</p>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default CustomModal;
