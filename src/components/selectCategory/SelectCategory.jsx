import React from "react";

const SelectCategory = (props) => {
  return (
    <div>
      <label>1. Select Category:</label>
      <select onChange={props.onChange}>
        <option>Breakfast</option>
        <option>Entree</option>
        <option>Bakery</option>
        <option>Drink</option>
        <option>Salad</option>
        <option>Soup</option>
      </select>
    </div>
  );
};

export default SelectCategory;
