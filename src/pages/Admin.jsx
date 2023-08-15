import React from "react";
import { useState, useEffect } from "react";
import { db, storage } from "./../firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
} from "firebase/firestore/lite";
import { v4 as uuidv4 } from "uuid";
import CustomInput from "../components/customInput/CustomInput";

const defaultDishValues = {
  id: "",
  name: "",
  price: 0,
  description: "",
  image: "",
};

const Admin = () => {
  const [dish, setDish] = useState(defaultDishValues);
  const [dishes, setDishes] = useState([]);
  const [percent, setPercent] = useState(0);
  const [file, setFile] = useState("");

  const onClickGetData = () => {
    getData();
  };

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

  const onClickUploadImage = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImageUpload = () => {
    if (!file) {
      return alert("Please choose a file first!");
    }
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setPercent(percent);
      },
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
          setDish({ ...dish, image: url });
        });
      }
    );
  };

  const onChangeHandler = (e) => {
    setDish({ ...dish, id: uuidv4(), [e.target.name]: e.target.value });
  };

  const onSubmitDishHandler = async (e) => {
    e.preventDefault();

    if (percent !== 100) {
      alert("Please wait for image upload");
      return;
    }

    const newDish = { ...dish, id: uuidv4() };

    await onClickAddToDatabase(newDish);

    const updatedDishes = [...dishes, newDish];
    setDishes(updatedDishes);
    setDish(defaultDishValues);
    setFile("");
    setPercent(0);
  };

  const onClickAddToDatabase = async (newDish) => {
    try {
      const dishesCollection = collection(db, "dishes");
      await addDoc(dishesCollection, newDish);
    } catch (error) {
      console.log("Error adding to database", error);
    }
  };

  const deleteHandler = async (dishId) => {
    try {
      await deleteDoc(doc(db, "dishes", dishId));
      await getData();
      console.log(dishId);
    } catch (error) {
      console.log("Deleting dish error", error);
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
