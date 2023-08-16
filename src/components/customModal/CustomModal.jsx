import React from "react";
import PropTypes from "prop-types";

const CustomModal = (props) => {
  const { name, image, price, description, onClick, deleteHandler, id } = props;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 shadow-md sm:w-3/4 sm:h-4/6 flex relative items-center w-full h-full flex-col md:flex-row overflow-y-scroll">
        <img
          src={image}
          alt={name}
          className="md:w-1/3 h-auto object-cover mr-4 w-1/2"
        />
        <div className="flex flex-col w-2/3">
          <div className="mb-4">
            <p className="text-lg font-semibold">{name}</p>
            <p className="text-gray-600">${price}</p>
          </div>
          <p className="text-gray-500">{description}</p>
        </div>
        <button
          className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700"
          onClick={onClick}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="mt-auto text-center">
          <button
            onClick={deleteHandler}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Remove
          </button>
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
