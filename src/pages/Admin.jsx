import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { db, storage } from "./../firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
} from "firebase/firestore/lite";
import useDishManagement from "../hooks/useDishManagement";
import CustomInput from "../components/customInput/CustomInput";
import CustomModal from "../components/customModal/CustomModal";

const Admin = () => {
  const [percent, setPercent] = useState(0);
  const [file, setFile] = useState("");
  const [openAddImgModal, setOpenAddImgModal] = useState(false);
  const [openDishModal, setOpenDishModal] = useState(false);
  const [openAllDishes, setOpenAllDishes] = useState(false);

  const { dish, dishes, setDishes, setDish, onChangeHandler } =
    useDishManagement();

  // image handling
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

  const onClickAddDishToDatabase = async (newDish) => {
    try {
      const dishesCollection = collection(db, "dishes");
      await addDoc(dishesCollection, newDish);
    } catch (error) {
      console.log("Error adding to database", error);
    }
  };

  const onClickOpenAddImgModal = () => {
    setOpenAddImgModal(true);
  };

  // delete dish from list
  const deleteHandler = async (dishId) => {
    try {
      await deleteDoc(doc(db, "dishes", dishId));
      await getData();
      console.log(dishId);
    } catch (error) {
      console.log("Deleting dish error", error);
    }
  };

  // fetch all dishes from db
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

  // open new page with dishes
  const onClickSeeAllDishes = () => {
    setOpenAllDishes(!openAllDishes);
    getData();
  };

  // submit new dish
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
    setDish({
      id: "",
      name: "",
      price: 0,
      description: "",
      image: "",
    });
    setFile("");
    setPercent(0);
  };

  const addImageModal = (
    <div className=" fixed inset-0 bg-black bg-opacity-50 transition-opacity">
      <div className=" relative w-full max-w-md p-6 mx-auto mt-20 bg-white rounded-lg shadow-md ">
        <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
        <input type="file" accept="image/*" onChange={onClickUploadImage} />
        <button
          className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleImageUpload}
        >
          Add Image
        </button>
        <p className="mt-2">{percent}% done</p>
        {percent === 100 ? (
          <img
            src={dish.image}
            alt="Preview"
            className="mt-4 max-w-full h-auto"
          />
        ) : null}
        <button
          className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700"
          onClick={() => setOpenAddImgModal(!openAddImgModal)}
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
      </div>
    </div>
  );

  const renderInputs = (
    <section className=" w-full lg:flex flex-col lg:w-2/4 mx-auto md:flex md:w-3/4 sm: flex sm:w-full ">
      <CustomInput
        name="name"
        value={dish.name}
        type="text"
        onChange={onChangeHandler}
        label="Name"
        className=" lg: w-1/2 mx-auto mb-4"
      />
      <CustomInput
        name="price"
        value={dish.price}
        type="number"
        onChange={onChangeHandler}
        label="Price"
        className=" lg: w-1/2 mx-auto mb-4"
      />
      <CustomInput
        name="description"
        value={dish.description}
        type="text"
        onChange={onChangeHandler}
        label="Description"
        className=" lg: w-1/2 mx-auto mb-4"
      />
    </section>
  );

  return (
    <>
      {!openAllDishes ? (
        <div className="lg:mx-auto lg:w-2/3 text-center p-8 md:w-11/12 mx-auto sm:w-full">
          <form
            onSubmit={onSubmitDishHandler}
            className="bg-gray-100 p-6 rounded-lg"
          >
            {openAddImgModal && addImageModal}
            {renderInputs}
            <div className=" flex flex-col mx-auto w-32">
              <button
                onClick={onClickOpenAddImgModal}
                className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-green-600"
              >
                Add image
              </button>
              <button
                type="submit"
                className={`${
                  !dish.name ||
                  !dish.price ||
                  !dish.description ||
                  percent !== 100
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white px-4 py-2 rounded-lg`}
                disabled={
                  !dish.name ||
                  !dish.price ||
                  !dish.description ||
                  percent !== 100
                }
                title={
                  !dish.name ||
                  !dish.price ||
                  !dish.description ||
                  percent !== 100
                    ? "Please fill in all fields before adding"
                    : ""
                }
              >
                Add Dish
              </button>
            </div>
          </form>
          <div>
            <button
              onClick={onClickSeeAllDishes}
              className=" text-white px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 mt-4"
            >
              See all dishes
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid gap-4 mt-8 lg:w-2/3 mx-auto bg-gray-100 p-6 rounded-lg">
            {dishes.map((el, index) => (
              <div
                key={index}
                id={el.id}
                className="flex items-center justify-between space-x-4 border p-4 rounded-lg bg-white"
              >
                <img
                  src={el.image}
                  className="w-16 h-16 object-cover rounded"
                  loading="lazy"
                  alt={el.name}
                />
                <div>
                  <p className="text-lg font-semibold">{el.name}</p>
                  <p className="text-gray-600">${el.price}</p>
                  <p className="text-gray-500">{el.description}</p>
                </div>
                <button
                  onClick={() => deleteHandler(el.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={onClickSeeAllDishes}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Back to Add Dish
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Admin;
