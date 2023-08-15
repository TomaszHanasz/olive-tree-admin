import React, { useEffect } from "react";

import { db } from "./../firebase-config";

import { collection, getDocs } from "firebase/firestore/lite";
import useDishManagement from "../hooks/useDishManagement";
import useDishDatabase from "../hooks/useDishDatabase";
import CustomInput from "../components/customInput/CustomInput";

const Admin = () => {
  const {
    deleteHandler,
    onSubmitDishHandler,
    handleImageUpload,
    onClickUploadImage,
    percent,
  } = useDishDatabase();

  const { dish, dishes, setDishes, onChangeHandler } = useDishManagement();

  const onClickGetData = () => {
    getData();
  };

  useEffect(() => {
    getData();
  }, [dishes]);

  const getData = async () => {
    try {
      const data = collection(db, "dishes");
      const dishesSnapshot = await getDocs(data);
      const dishesData = dishesSnapshot.docs.map((el) => {
        return { ...el.data(), id: el.id };
      });
      setDishes(dishesData);
      console.log(dishesData);
    } catch (error) {
      console.log(error);
    }
  };

  const renderInputs = (
    <>
      <CustomInput
        name="name"
        value={dish.name}
        type="text"
        onChange={onChangeHandler}
        label="Name"
      />
      <CustomInput
        name="price"
        value={dish.price}
        type="number"
        onChange={onChangeHandler}
        label="Price"
      />
      <CustomInput
        name="description"
        value={dish.description}
        type="text"
        onChange={onChangeHandler}
        label="Description"
      />
    </>
  );

  return (
    <div>
      <button onClick={onClickGetData}>Get Dishes</button>
      <form onSubmit={onSubmitDishHandler}>
        {renderInputs}
        <input
          type="file"
          accept="image/*"
          onChange={onClickUploadImage}
          required
        />
        <button onClick={handleImageUpload}>add image</button>
        <p>{percent}% done</p>
        <button type="submit">Add dish</button>
      </form>
      <ul>
        {dishes.map((el, index) => (
          <div key={index} id={el.id}>
            <img
              src={el.image}
              style={{ width: 100, height: 100 }}
              loading="lazy"
            />
            <li>
              Name: {el.name}, Price: {el.price}, Desc:
              {el.description}
            </li>
            <button onClick={() => deleteHandler(el.id)}>Remove</button>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
