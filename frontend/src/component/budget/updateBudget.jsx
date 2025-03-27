import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import './UpdateBudget.css';

const API_URL = "http://localhost:5000/budget";

function UpdateBudget() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [inputs, setInputs] = useState({
        amount: "",
        category: "",
        date: "",
        description: "",
    });

    // Fetch existing budget data
    useEffect(() => {
        const fetchBudget = async () => {
            try {
                const response = await axios.get(`${API_URL}/display/${id}`);
                setInputs(response.data);
            } catch (error) {
                console.error("Error fetching budget data:", error);
            }
        };
        fetchBudget();
    }, [id]);

    // Handle input changes
    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const today = new Date();
        const selectedDate = new Date(inputs.date);
        if (selectedDate < today) {
            alert("The budget date should be in the future.");
            return;
        }

        try {
            await axios.put(`${API_URL}/update/${id}`, inputs);
            alert("Budget updated successfully!");
            navigate("/"); // Redirect after updating
        } catch (error) {
            console.error("Error updating budget:", error);
            alert("Failed to update budget");
        }
    };

    return (
        <div className="form">
            <form onSubmit={handleSubmit}>
                <h2>Update Budget</h2>

                <label>Amount:</label>
                <input type="number" name="amount" onChange={handleChange} value={inputs.amount} required />

                <label>Category:</label>
                <select name="category" onChange={handleChange} value={inputs.category} required>
                    <option value="">Select Category</option>
                    <option value="Utility">Utility</option>
                    <option value="Rent">Rent</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Others">Others</option>
                </select>

                <label>Date:</label>
                <input type="date" name="date" onChange={handleChange} value={inputs.date} required />

                <label>Description:</label>
                <textarea name="description" onChange={handleChange} value={inputs.description} required />

                <button type="submit">Update</button>
                <button type="button" className="back" onClick={() => navigate("/")}>✖ Close</button>
            </form>
        </div>
    );
}

export default UpdateBudget;
