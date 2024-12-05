import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import './Notification.css'; // Import the Notification CSS file

const Notification = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [doctorData, setDoctorData] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  const [showNotification, setShowNotification] = useState(true); // State for notification visibility

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('email');
    const storedDoctorData = JSON.parse(localStorage.getItem('doctorData'));
    const storedAppointmentData = JSON.parse(localStorage.getItem(storedDoctorData?.name));

    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
    if (storedDoctorData) {
      setDoctorData(storedDoctorData);
    }
    if (storedAppointmentData) {
      setAppointmentData(storedAppointmentData);
    }
  }, []);

  // Function to hide notification
  const handleCancelNotification = () => {
    setShowNotification(false);
  };

  return (
    <div>
      <Navbar></Navbar>
      {children}

      {isLoggedIn && appointmentData && showNotification && (
        <div className="notification-container">
          <div className="notification-content">
            <h3>Appointment Details</h3>
            <p><strong>User:</strong> {username}</p>
            <p><strong>Doctor:</strong> {doctorData?.name}</p>
            <p><strong>Time:</strong> {appointmentData?.time}</p>
            <p><strong>Date:</strong> {appointmentData?.date}</p>
            <button onClick={handleCancelNotification} className="close-btn">Cancel Notification</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
