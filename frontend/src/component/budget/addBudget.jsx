import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

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
    await axios.post("http://localhost:5000/api/budget/add", {
      category: String(inputs.category),
      amount: Number(inputs.amount),
      dueDate: new Date(inputs.dueDate),
      status: String(inputs.status),
      description: String(inputs.description),
    });
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <h2>Add a Budget Entry</h2>

        <div>
          <label htmlFor="category">Category:</label>
          <input
            type="text"
            placeholder="Enter category (e.g., Rent, Utilities)"
            className="category"
            name="category"
            onChange={handleChange}
            value={inputs.category}
            required
          />
        </div>

        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            placeholder="Enter amount"
            className="amount"
            name="amount"
            onChange={handleChange}
            value={inputs.amount}
            required
          />
        </div>

        <div>
          <label htmlFor="dueDate">Due Date:</label>
          <input
            type="date"
            className="dueDate"
            name="dueDate"
            onChange={handleChange}
            value={inputs.dueDate}
            required
          />
        </div>

        <div>
          <label htmlFor="status">Status:</label>
          <select
            className="status"
            name="status"
            onChange={handleChange}
            value={inputs.status}
            required
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            className="description"
            placeholder="Enter bill details"
            name="description"
            onChange={handleChange}
            value={inputs.description}
            required
          ></textarea>
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
