import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import './AddBudget.css';  // Import the CSS file

function AddBudget() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    category: "",
    amount: "",
    dueDate: "",
    status: "Pending", // Default status is Pending
    description: "",
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
    const selectedDate = new Date(inputs.dueDate);

    if (selectedDate <= today) {
      alert("You can only set due dates for upcoming bills");
      return;
    }

    console.log(inputs);
    await sendRequest();
    history("/"); // Redirect to the home page after submission
  };

  const sendRequest = async () => {
    await axios.post("http://localhost:5000/budget/add", {
      category: String(inputs.category),
      amount: Number(inputs.amount),
      dueDate: new Date(inputs.dueDate),
      status: String(inputs.status),
      description: String(inputs.description),
    });
  };

  // Clear functions for each part of the form
  const handleClearCategory = () => {
    setInputs((prevState) => ({
      ...prevState,
      category: "",
    }));
  };

  const handleClearAmount = () => {
    setInputs((prevState) => ({
      ...prevState,
      amount: "",
    }));
  };

  const handleClearDueDate = () => {
    setInputs((prevState) => ({
      ...prevState,
      dueDate: "",
    }));
  };

  const handleClearStatus = () => {
    setInputs((prevState) => ({
      ...prevState,
      status: "Pending",
    }));
  };

  const handleClearDescription = () => {
    setInputs((prevState) => ({
      ...prevState,
      description: "",
    }));
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <h2>Add a Budget Entry</h2>

        <div className="input-group">
          <label htmlFor="category">Category:</label>
          <select
            name="category"
            value={inputs.category}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Category</option>
            <option value="Rent">Rent</option>
            <option value="Utility Bills">Utility Bills</option>
            <option value="Groceries">Groceries</option>
            <option value="Other Expense">Other Expense</option>
          </select>
          <button type="button" className="clear" onClick={handleClearCategory}>
            Clear
          </button>
        </div>

        <div className="input-group">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            placeholder="Enter amount"
            name="amount"
            onChange={handleChange}
            value={inputs.amount}
            required
          />
          <button type="button" className="clear" onClick={handleClearAmount}>
            Clear
          </button>
        </div>

        <div className="input-group">
          <label htmlFor="dueDate">Due Date:</label>
          <input
            type="date"
            name="dueDate"
            onChange={handleChange}
            value={inputs.dueDate}
            required
          />
          <button type="button" className="clear" onClick={handleClearDueDate}>
            Clear
          </button>
        </div>

        <div className="input-group">
          <label htmlFor="status">Status:</label>
          <select
            name="status"
            value={inputs.status}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
          <button type="button" className="clear" onClick={handleClearStatus}>
            Clear
          </button>
        </div>

        <div className="input-group">
          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            onChange={handleChange}
            value={inputs.description}
            placeholder="Enter bill details"
            required
          ></textarea>
          <button type="button" className="clear" onClick={handleClearDescription}>
            Clear
          </button>
        </div>

        <div className="button-container">
          <button type="submit">Submit</button>
          <button
            type="button"
            className="back"
            onClick={() => history("/")}>
            ✖ Close
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddBudget;
