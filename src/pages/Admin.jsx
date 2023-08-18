import React, { useEffect } from "react";
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
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./admin.style.css";

const Admin = () => {
  const [percent, setPercent] = useState(0);
  const [file, setFile] = useState("");
  const [openDishModal, setOpenDishModal] = useState(false);
  const [selectedDish, setSelectedDish] = useState({});
  const [openedPanel, setOpenedPanel] = useState("home");
  const [hidden, setHidden] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const { user, logOut } = UserAuth();
  const navigate = useNavigate();

  const { dish, dishes, setDishes, setDish, onChangeHandler } =
    useDishManagement();

  // log out
  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (e) {
      console.log(e.message);
    }
  };

  // image handling
  const onClickUploadImage = (e) => {
    setFile(e.target.files[0]);
    console.log(file);
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

  // delete dish from list
  const deleteHandler = async (dishId) => {
    try {
      await deleteDoc(doc(db, "dishes", dishId));
      await getData();
      setOpenDishModal(false);
      setOpenedPanel("allDishes");
      setConfirmRemove(false);
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

  // open panels
  const onClickOpenPanel = (name) => {
    setOpenedPanel(name);
    setOpenDishModal(false);
    setSelectedDish({});
    setConfirmRemove(false);
  };

  const allDishesOpened = openedPanel === "allDishes";

  useEffect(() => {
    getData(); // eslint-disable-next-line
  }, [allDishesOpened]);

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

  //open dish modal
  const onClickSelectDish = (dish) => {
    setSelectedDish({ ...dish });
    setOpenedPanel("dishDetails");
    setOpenDishModal(!openDishModal);
    console.log(selectedDish);
  };

  //hide left panel
  const onClickHidePanel = () => {
    setHidden(!hidden);
  };

  const renderInputs = (
    <section className="admin-panel__inputs">
      <CustomInput
        name="name"
        value={dish.name}
        type="text"
        onChange={onChangeHandler}
        label="1.Name"
        className=" lg: w-1/2 mx-auto mb-4 bg-black"
      />
      <CustomInput
        name="price"
        value={dish.price}
        type="number"
        onChange={onChangeHandler}
        label="2.Price"
        className=" lg: w-1/2 mx-auto mb-4"
      />
      <CustomInput
        name="description"
        value={dish.description}
        type="text"
        onChange={onChangeHandler}
        label="3.Description"
        className=" lg: w-1/2 mx-auto mb-4"
      />
    </section>
  );

  return (
    <>
      <div className="admin-panel-background">
        <section className="admin-panel-glass">
          <div className="admin-panel-container">
            <h1 className="title">
              Admin Panel
              <button
                className="btn close-left-panel"
                onClick={() => onClickHidePanel(!hidden)}
              >
                {hidden ? ">" : "<"}
              </button>
            </h1>

            <div className="admin-panel">
              <div className={`admin-panel-left ${hidden ? "hidden" : ""}`}>
                <ul>
                  <li>
                    <button
                      className="btn"
                      onClick={() => onClickOpenPanel("home")}
                    >
                      Home
                    </button>
                  </li>
                  <li>
                    <button
                      className="btn"
                      onClick={() => onClickOpenPanel("addDish")}
                    >
                      Add Dish
                    </button>
                  </li>
                  <li>
                    <button
                      className="btn"
                      onClick={() => onClickOpenPanel("allDishes")}
                    >
                      Dish List
                    </button>
                  </li>
                </ul>
                <button className="btn" onClick={handleLogOut}>
                  Log Out
                </button>
              </div>
              <div className="admin-panel-right">
                {openedPanel === "home" && (
                  <h1>Welcome {user && user.email}</h1>
                )}
                {openedPanel === "addDish" && (
                  <>
                    <form onSubmit={onSubmitDishHandler}>
                      {renderInputs}
                      <div className="admin-panel__add-image">
                        <p style={{ margin: "10px auto" }}>4.Upload Image</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={onClickUploadImage}
                        />
                        <button
                          className="btn add-dish__btn"
                          onClick={handleImageUpload}
                        >
                          5.Add Image
                        </button>
                        <p className="mt-2">{percent}% done</p>

                        <button
                          type="submit"
                          className="btn add-dish__btn"
                          disabled={
                            !dish.name ||
                            !dish.price ||
                            !dish.description ||
                            percent !== 100
                          }
                        >
                          Add Dish
                        </button>
                      </div>
                    </form>
                    {percent === 100 ? (
                      <img
                        src={dish.image}
                        alt="Preview"
                        className="dish__preview-image"
                      />
                    ) : null}
                  </>
                )}
                {openedPanel === "dishDetails" && selectedDish && (
                  <div className="selected-dish">
                    <img
                      src={selectedDish.image}
                      className="selected-dish__image"
                      alt={selectedDish.name}
                    />
                    <p style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                      {selectedDish.name}
                    </p>
                    <p>{selectedDish.price}</p>
                    <p>{selectedDish.description}</p>
                    <div>
                      <button
                        className="btn dishDetails-btn back-btn"
                        onClick={() => setOpenedPanel("allDishes")}
                      >
                        Back
                      </button>
                    </div>
                    <div>
                      {!confirmRemove && (
                        <button
                          className="btn dishDetails-btn"
                          onClick={() => setConfirmRemove(true)}
                        >
                          Remove Dish
                        </button>
                      )}
                      {confirmRemove && (
                        <>
                          <button
                            className="btn dishDetails-btn remove-btn "
                            onClick={() => deleteHandler(selectedDish.id)}
                          >
                            Remove
                          </button>
                          <button
                            className="btn dishDetails-btn"
                            onClick={() => setConfirmRemove(false)}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
                {openedPanel === "allDishes" && (
                  <div className="dish__grid">
                    {dishes.map((el, index) => (
                      <div
                        key={index}
                        id={el.id}
                        className="dish-box"
                        onClick={() => onClickSelectDish(el)}
                      >
                        <img
                          src={el.image}
                          className="dish-box__img"
                          loading="lazy"
                          alt={el.name}
                        />
                        <div className="dish-box__text">
                          <p>{el.name}</p>
                          <p>${el.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
      </div>
    </>
  );
};

export default Admin;
