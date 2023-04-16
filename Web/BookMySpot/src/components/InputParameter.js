import { useState } from "react";
import React from "react";
import { useLocation } from "react-router-dom";


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from 'firebase/firestore/lite';
import 'firebase/compat/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

// Initialize Firebase Storage
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhSjpjZfAoYIPz6NXgyu-R0TayNglvyeE",
  authDomain: "bookmyevent-1d870.firebaseapp.com",
  projectId: "bookmyevent-1d870",
  storageBucket: "bookmyevent-1d870.appspot.com",
  messagingSenderId: "89914221999",
  appId: "1:89914221999:web:1327c59c882bbf305a7b5a",
  measurementId: "G-3YZM2WV4LL"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();

function InputParameter() {
  const [formData, setformData] = useState({
    createEvent: "",
    createEventMode: "",
    startdate: "",
    endDate: "",
    eventType: "offline",
    fileUpload: "",
    eventLocation: ""
  });

  const location = useLocation();
  const uid = new URLSearchParams(location.search).get("uid");
  console.log(uid);

  const [uploadImages, setUploadImage] = useState('');

  function changehandler(event) {
    const { name, value, } = event.target;
    setformData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function changehandle(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function () {
      const base64Url = reader.result;
      // Do something with the base64Url here
      console.log(base64Url);
      setUploadImage(base64Url)
    };
    reader.readAsDataURL(file);
  }

  async function uploadImage(file) {
  // Create a storage reference from a Firebase Storage root reference
  const storageRef = ref(storage, "images/" +  Math.random() * 100);
  

  // Upload file to Firebase Storage with the content type
  await uploadString(storageRef, file, 'data_url');

  // Get download URL for the file
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
  }

  async function submitHandler(event) {
    event.preventDefault();
    // connect your backen form here
    console.log(formData);
    try {

      let end_date = new Date(formData.endDate);
      end_date.setMinutes(1);
      end_date.setHours(0);
      let start_date = new Date(formData.startdate);
      start_date.setMinutes(1);
      start_date.setHours(0);

        //createEvent: formData.createEvent,
        //createEventMode: formData.createEventMode,
        //eventType: formData.eventType,
        //fileUpload: formData.fileUpload,

      const createdAts = new Date();

      const downloadURL = await uploadImage(uploadImages);
      

      const docRef = await addDoc(collection(db, "events"), {
        addedBy: uid,
        attendeeCount: 0,
        checkInCount: 0,
        createdAt: createdAts,
        end: end_date,
        orgId: "dy",
        start: start_date,
        type: Number.parseInt(2),
        image: downloadURL,
        name: formData.createEvent,
        location: formData.eventLocation

      });
      console.log("Document written with ID: ", docRef.id);
      alert("Event created successfully!");

    // Reset the form
    setformData({
      createEvent: "",
      createEventMode: "",
      startdate: "",
      endDate: "",
      eventType: "offline",
      fileUpload: "",
      eventLocation: ""
    });
    setUploadImage('');
    
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  return (
    <div className="items-center flex place-content-around">
    <form onSubmit={submitHandler} className="flex flex-col justify-center my-20">
      <div className="text-center">
        <label htmlFor="createEvent" className="text-4xl font-bold text-blue-500 mb-5">
          Create Event
        </label>
      </div>
      <br />
      <div>
        <label htmlFor="eventLocation" className="text-xl font-semibold mt-2">
          Event Name
        </label>
        <br />
        <input
          type="text"
          name="createEvent"
          id="createEvent"
          placeholder="Event Name"
          value={formData.createEvent}
          onChange={changehandler}
          className="bg-gray-200 p-4 rounded-lg w-full mt-2 mb-5"
        />
  
        <br />
        <label htmlFor="eventLocation" className="text-xl font-semibold mt-2">
          Event Location
        </label>
        <br />
        <input
          type="text"
          name="eventLocation"
          id="eventLocation"
          placeholder="Event Location"
          value={formData.eventLocation}
          onChange={changehandler}
          className="bg-gray-200 p-4 rounded-lg w-full mt-2 mb-5"
        />
  
        <br />
        <label htmlFor="startdate" className="text-xl font-semibold mt-2" >
          Start Date
        </label>
        <br />
        <input
          type="date"
          name="startdate"
          id="startdate"
          placeholder="startdate"
          value={formData.startdate}
          onChange={changehandler}
          className="bg-gray-200 p-4 rounded-lg w-full mt-2 mb-5"
        />
        <br />
        <label htmlFor="endDate" className="text-xl font-semibold mt-2">
          End Date
        </label>
        <br />
        <input
          type="date"
          name="endDate"
          id="endDate"
          placeholder="endDate"
          value={formData.endDate}
          onChange={changehandler}
          className="bg-gray-200 p-4 rounded-lg w-full mt-2 mb-5"
        />
        <br />
  
        <label htmlFor="fileUpload" className="text-xl font-semibold mt-2">
          Upload Image
        </label>
        <br />
        <input
          type="file"
          name="fileUpload"
          id="fileUpload"
          placeholder="fileUpload"
          value={formData.fileUpload}
          onChange={changehandle}
          className="bg-gray-200 p-4 rounded-lg w-full mt-2 mb-5"
        />
        <br />
        <label htmlFor="eventType" className="text-xl font-semibold mt-2">
          Event Type
        </label>
        <br />
        <select
          id="eventType"
          name="eventType"
          value={formData.eventType}
          onChange={changehandler}
          className="bg-gray-200 p-4 rounded-lg w-full mt-2"
        >
          <option>Workshop</option>
          <option>Event</option>
          <option>Concert</option>
          <option>Conference</option>
        </select>
        <br />
      </div>
      <br />
      <button className="bg-blue-500 text-white font-bold rounded py-2 px-4">
        Submit
      </button>
      <br />
    </form>
  </div>
  
  );

}

export default InputParameter;
