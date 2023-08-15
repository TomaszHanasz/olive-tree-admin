import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const useDishManagement = () => {
  const defaultDishValues = {
    id: "",
    name: "",
    price: 0,
    description: "",
    image: "",
  };

  const [dish, setDish] = useState(defaultDishValues);
  const [dishes, setDishes] = useState([]);

  const onChangeHandler = (e) => {
    setDish({ ...dish, id: uuidv4(), [e.target.name]: e.target.value });
  };

  return {
    dish,
    dishes,
    setDish,
    setDishes,
    onChangeHandler,
    defaultDishValues,
  };
};

export default useDishManagement;
