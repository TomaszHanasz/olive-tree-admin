import React, { useState } from "react";
import { db, storage } from "./../firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
} from "firebase/firestore/lite";
import useDishManagement from "./useDishManagement";
import { v4 as uuidv4 } from "uuid";

const useDishDatabase = () => {
  const [percent, setPercent] = useState(0);
  const [file, setFile] = useState("");

  const { dish, dishes, setDish, setDishes, defaultDishValues } =
    useDishManagement();

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

  const onSubmitDishHandler = async (e) => {
    e.preventDefault();

    if (percent !== 100) {
      console.log("Please wait for image upload");
      return;
    }

    const newDish = { ...dish, id: uuidv4() };

    await onClickAddDishToDatabase(newDish);

    const updatedDishes = [...dishes, newDish];
    setDishes(updatedDishes);
    setDish(defaultDishValues);
    setFile("");
    setPercent(0);
  };

  const onClickAddDishToDatabase = async (newDish) => {
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
  return {
    deleteHandler,
    onClickAddDishToDatabase,
    onSubmitDishHandler,
    handleImageUpload,
    onClickUploadImage,
    percent,
    file,
  };
};

export default useDishDatabase;
