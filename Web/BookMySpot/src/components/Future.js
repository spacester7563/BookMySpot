import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { useState, useEffect } from 'react';

firebase.initializeApp({
    apiKey: "AIzaSyAhSjpjZfAoYIPz6NXgyu-R0TayNglvyeE",
    authDomain: "bookmyevent-1d870.firebaseapp.com",
    projectId: "bookmyevent-1d870",
    storageBucket: "bookmyevent-1d870.appspot.com",
    messagingSenderId: "89914221999",
    appId: "1:89914221999:web:1327c59c882bbf305a7b5a",
    measurementId: "G-3YZM2WV4LL"
});

const db = firebase.firestore();

const Future = () => {

  const [info, setInfo] = useState([]);

  useEffect(() => {
    Fetchdata();
  }, []);

  const Fetchdata = () => {
    db.collection("events").get().then((querySnapshot) => {
      let events = [];
      querySnapshot.forEach(element => {
        var data = element.data();
        events.push(data);
      });
      setInfo(events);
    })
  }

  return (
    <div >
      <center>
        <h2 style={{color: '#3c82f6', fontWeight: 'black', fontSize: '30px', margin: '25px'}}>Upcoming Events</h2>
      </center>
<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }} >
      {info.map((data) => {
        const currentDate = new Date();
        const startDate = new Date(data.start.seconds * 1000);
        const endDate = new Date(data.end.seconds * 1000);
        if (currentDate < startDate) {
          return (
            <Frame name={data.name}
              start={data.start}
              end={data.end} 
              image = {data.image}
              attendeeCount = {data.attendeeCount}
              checkInCount = {data.checkInCount}
              
              />
          )
        } else {
          return null;
        }
      })}
</div>
    </div>

  );
}

const Frame = ({ name, start, end, image, attendeeCount, checkInCount }) => {
    const startDate = new Date(start.seconds * 1000).toLocaleDateString();
    const endDate = new Date(end.seconds * 1000).toLocaleDateString();
    return (
      <center>
        <div className="event-card" style={{ 
          
          borderRadius: '10px', 
          maxWidth:'300px', 
          backgroundColor: '#fff', 
          marginRight: '10px', 
          boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)' // added box shadow for depth
        }}>
          <img src={image} alt="Event" style={{ 
            width: '280px', 
             
            borderRadius: '10px 10px 0 0', // rounded top corners
          }}/>
          <div style={{ padding: '10px' }}>
            <p style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '5px', // added margin bottom for spacing
            }}>NAME: {name}</p>
            <p style={{ marginBottom: '5px' }}>START DATE: {startDate}</p>
            <p style={{ marginBottom: '5px' }}>END DATE: {endDate}</p>
            <p style={{ marginBottom: '5px' }}>ATTENDEE COUNT: {attendeeCount}</p>
            <p style={{ marginBottom: '5px' }}>CHECK-IN COUNT: {checkInCount}</p>
          </div>
        </div>
      </center>
    );    
}

export default Future;
