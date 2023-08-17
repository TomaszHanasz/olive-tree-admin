import React, { useState } from "react";
import PropTypes from "prop-types";
import "./customModal.style.css";

const CustomModal = (props) => {
  const { name, image, price, description, onClick, deleteHandler } = props;

  const [confirmRemoval, setConfirmRemoval] = useState(false);

  const onClickConfirm = () => {
    setConfirmRemoval(!confirmRemoval);
  };

  const onCloseModal = () => {
    setConfirmRemoval(false);
    onClick();
  };

  return (
    <div className="dish-modal__overlay">
      <div className="dish-modal">
        <img src={image} alt={name} className="dish-modal__img" />
        <div className="dish-modal__text">
          <div>
            <p>{name}</p>
            <p>${price}</p>
          </div>
          <p>{description}</p>
        </div>
        <button className="btn close-modal-btn" onClick={onCloseModal}>
          X
        </button>
        <div className="mt-auto text-center">
          {confirmRemoval ? (
            <div className=" w-28">
              <h2>Are you sure?</h2>
              <button
                onClick={deleteHandler}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mb-2"
              >
                Remove
              </button>
              <button
                onClick={onClickConfirm}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 "
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className=" w-28">
              <h2>Remove dish</h2>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={onClickConfirm}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CustomModal.propTypes = {
  name: PropTypes.string,
  image: PropTypes.string,
  description: PropTypes.string,
  price: PropTypes.number,
  onClick: PropTypes.func,
  deleteHandler: PropTypes.func,
  id: PropTypes.string,
};

export default CustomModal;
