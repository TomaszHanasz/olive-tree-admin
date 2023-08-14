import React from "react";
import { useState, useEffect } from "react"; // Import useState to store the fetched data
import { db, storage } from "./../firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore/lite";

const Admin = () => {
  const [dish, setDish] = useState({
    name: "",
    price: 0,
    description: "",
    image: "",
  });
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
      const dishesData = [];
      dishesSnapshot.forEach((doc) => {
        dishesData.push(doc.data());
      });
      setDishes(dishesData);
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
    setDish({ ...dish, [e.target.name]: e.target.value });
  };

  const onSubmitDishHandler = (e) => {
    e.preventDefault();
    setDishes([...dishes, dish]);
    onClickAddToDatabase();
    console.log(dish);
    console.log(dishes);
  };

  const onClickAddToDatabase = async () => {
    try {
      const addingDish = { dish: dish };
      const dishesCollection = collection(db, "dishes");
      await addDoc(dishesCollection, addingDish);
    } catch (error) {
      console.log("Error adding to database", error);
    }
  };

  return (
    <div>
      <button onClick={onClickGetData}>Get Dishes</button>
      <form onSubmit={onSubmitDishHandler}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={dish.name}
          onChange={onChangeHandler}
          required
        />
        <label>Price</label>
        <input
          type="number"
          name="price"
          value={dish.price}
          onChange={onChangeHandler}
          required
        />
        <label>Description</label>
        <input
          type="text"
          name="description"
          value={dish.description}
          onChange={onChangeHandler}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={onClickUploadImage}
          required
        />
        <button onClick={handleImageUpload}>Upload to Firebase</button>
        <p>{percent}% done</p>
        <button type="submit">Add dish</button>
      </form>
      <ul>
        {dishes.map((el, index) => (
          <div key={index}>
            <img
              src={el.image}
              style={{ width: 100, height: 100 }}
              loading="lazy"
            />
            <li>
              Name: {el.name}, Price: {el.price}, Desc:
              {el.description}
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
