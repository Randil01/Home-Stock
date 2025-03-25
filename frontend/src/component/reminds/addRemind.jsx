import Nav from "../navbar/navbar"
import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

function AddRemind() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    dateRemind: "",
    piority: "",
    descrption: "",
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date();
    const selectedDate = new Date(inputs.dateRemind);
    
    if (selectedDate <= today) {
      alert("You can only set reminders for upcoming days");
      return;
    }

    console.log(inputs);
    await sendRequest();
    history("/");
  };

  const sendRequest = async () => {
    await axios.post("http://localhost:5000/notification/add", {
      dateRemind: new Date(inputs.dateRemind),
      piority: String(inputs.piority),
      descrption: String(inputs.descrption),
    });
  };

  return (
    <div>
        <Nav/>
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center mb-4">📌 Add a Reminder</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="date" className="form-label fw-bold">Date:</label>
            <input
              type="date"
              className="form-control"
              name="dateRemind"
              onChange={handleChange}
              value={inputs.dateRemind}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="piority" className="form-label fw-bold">Priority:</label>
            <select
              className="form-control"
              name="piority"
              onChange={handleChange}
              value={inputs.piority}
              required
            >
              <option value="">Select Priority</option>
              <option value="low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="descrption" className="form-label fw-bold">Description:</label>
            <textarea
              className="form-control"
              placeholder="Enter reminder details"
              name="descrption"
              onChange={handleChange}
              value={inputs.descrption}
              required
            ></textarea>
          </div>

          <div className="d-flex justify-content-between mt-4 me-2">
            <button type="submit" className="btn btn-success fw-bold px-4">
              ✅ Submit
            </button>
            <button
              type="button"
              className="btn btn-danger fw-bold px-4"
              onClick={() => history("/")}
            >
              ✖ Close
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}

export default AddRemind;
