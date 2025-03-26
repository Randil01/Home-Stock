import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router";
import { useParams } from "react-router";

function UpdateBudget() {
    const history = useNavigate();
    const { id } = useParams(); // Get the ID from URL params to fetch the correct data
    
    // Set up the initial state based on budget management fields
    const [inputs, setInputs] = useState({
        amount: "",
        category: "",
        date: "",
        description: "",
    });

    // Fetch the existing budget data based on the ID passed in the URL
    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/budget/displayBudgetOne/${id}`);
                setInputs(response.data); // Set the state with the fetched data
            } catch (error) {
                console.error("Error fetching budget data:", error);
            }
        };
        fetchHandler();
    }, [id]);

    // Handle form field changes and update state
    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    // Send updated data to the backend API
    const sendRequest = async () => {
        await axios.put(`http://localhost:5000/budget/updateBudget/${id}`, inputs);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation for budget date
        const today = new Date();
        const selectedDate = new Date(inputs.date);
        
        if (selectedDate < today) {
            alert("The budget date should be in the future.");
            return;
        }

        // Send the updated data
        await sendRequest();
        history("/"); // Redirect after updating
    };

    return (
        <div className="form">
            <form onSubmit={handleSubmit}>
                <h2>Update Budget</h2>
                
                {/* Amount field */}
                <div>
                    <label htmlFor="amount">Amount:</label>
                    <input
                        type="number"
                        placeholder="Enter the budget amount"
                        name="amount"
                        onChange={handleChange}
                        value={inputs.amount}
                        required
                    />
                </div>

                {/* Category field */}
                <div>
                    <label htmlFor="category">Category:</label>
                    <select
                        name="category"
                        onChange={handleChange}
                        value={inputs.category}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Utility">Utility</option>
                        <option value="Rent">Rent</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Others">Others</option>
                    </select>
                </div>

                {/* Date field */}
                <div>
                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        name="date"
                        onChange={handleChange}
                        value={inputs.date}
                        required
                    />
                </div>

                {/* Description field */}
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        placeholder="Enter description of the budget item"
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

export default UpdateBudget;

