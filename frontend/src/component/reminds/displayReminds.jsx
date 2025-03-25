import Nav from "../navbar/navbar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./reminds.css";
const URL = "http://localhost:5000/notification/displayRemind";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function RemindersAll() {
  const [reminders, setReminds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    fetchHandler().then((data) => setReminds(data));
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleSavePhone = async (e) => {
    e.preventDefault();
    const phoneReg = /^(\+94)?[0-9]{9}$/; 
    
    if (!phoneReg.test(phone)) {
      alert("Please enter a valid phone number.");
      return;
    }
    try {
        const response = await axios.post('http://localhost:5000/number/add', {
          phone 
        });
    
        alert(response.data.message || 'Phone number saved successfully!');
    
        setPhone('');
      } catch (error) {
        alert('Error saving phone number: ' + (error.response ? error.response.data.message : error.message));
      }
  };

  const filteredReminders = reminders.filter(
    (remind) =>
      remind.descrption.toLowerCase().includes(searchQuery) ||
      remind._id.toLowerCase().includes(searchQuery)
  );

  const deleteOldReminders = () => {
    const now = new Date();
    const updatedReminders = reminders.filter((reminder) => {
      const dateAdded = new Date(reminder.dateAdded);
      const diffInDays = (now - dateAdded) / (1000 * 3600 * 24);
      return diffInDays <= 3;
    });
    setReminds(updatedReminders);
  };

  useEffect(() => {
    const interval = setInterval(deleteOldReminders, 86400000);
    return () => clearInterval(interval);
  }, [reminders]);

  return (
    <div>
        <Nav/>
    <div>
        <br></br>
        <br></br>
        <h1 className="description-text">"Smart Restocking automates inventory monitoring and replenishment, 
            ensuring optimal stock levels based on real-time data. Stay ahead of demand with seamless, 
            data-driven decisions that keep your shelves stocked and your operations running smoothly"</h1>
    </div>
    <br></br>
    <div>
    <div className="container mt-4 p-3 border rounded" style={{ maxWidth: "500px", margin: "auto" }}>
        <h4 className="text-center">Add a number to recive reminders</h4>
        <form onSubmit={handleSavePhone} className="mt-3">
          <div className="mb-3">
            <label className="form-label fw-semibold">Phone Number:</label>
            <input
              type="text"
              className="form-control"
              placeholder="+94"
              value={phone}
              onChange={handlePhoneChange}
              required
              maxLength="13"/>
          </div>
          <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-success w-30">
            Save Phone Number
          </button>
          </div>
        </form>
      </div>
    </div>
    <div className="mt-5"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/de/af/9e/deaf9e67922a86c2363fb775f85b239e.jpg')",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "20px 0",
      }}>
      <div
        className="container py-4 notification-container mt-3"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "10px",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="b-0 fw-bold" style={{ fontSize: "2.5rem" }}>
            REMINDERS LIST
          </h1>
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search by description or ID"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="col-md-12 text-md-end text-center mt-2 mt-md-0">
             <Link to="/add" className="btn btn-success fw-bold px-4 py-2">
         + Add Reminder
         </Link>
        </div>
        <br></br>
        <br></br>
        <div className="d-flex flex-column gap-5">
          {filteredReminders &&
            filteredReminders.map((remind, i) => (
              <div key={remind._id || i}>
                <div
                  className="card border-3 shadow-lg rounded-3 remind-card"
                  style={{
                    minHeight: "200px",
                    maxWidth: "80%",
                    backgroundColor: "rgba(255,255,255,0.95)",
                    padding: "15px",
                    display: "flex",
                    justifyContent: "center",
                    margin: "0 auto",
                  }}
                >
                  <div className="card-body">
                    <p
                      className="card-title fw-semibold"
                      style={{ fontSize: "1.2rem" }}
                    >
                      Reference number: {remind._id}
                    </p>
                    <p
                      className="card-text mb-1 fw-semibold"
                      style={{ fontSize: "1.2rem" }}
                    >
                      Date: {remind.dateRemind}
                    </p>
                    <p
                      className="card-text mb-1 fw-semibold"
                      style={{ fontSize: "1.2rem" }}
                    >
                      Priority: {remind.piority}
                    </p>
                    <p
                      className="card-text fw-semibold"
                      style={{ fontSize: "1.2rem" }}
                    >
                      Description: {remind.descrption}
                    </p>
                  </div>

                  <div className="card-footer bg-transparent border-0 text-end p-3">
                    <Link
                      to={`/updateremind/${remind._id}`}
                      className="btn btn-primary btn-lg">
                      Update
                    </Link>
                  </div>
                </div>
              </div>
            ))}

          {filteredReminders.length === 0 && (
            <div>
              <div
                className="alert alert-info fw-bold"
                style={{ fontSize: "1.2rem" }}
              >
                No reminders available.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

export default RemindersAll;
