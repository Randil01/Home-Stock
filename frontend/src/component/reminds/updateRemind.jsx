import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router";
import { useParams } from "react-router";

function UpdatedReminders(){

    const history = useNavigate();

    const [inputs, setInputs] = useState({
        dateRemind: "",
        piority: "",
        descrption: "",
    });
    const { id } = useParams();

    useEffect(() => {
        const fetchHandler = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/notification/displayRemindOne/${id}`);
                setInputs(response.data);

            } catch (error) {
                console.error("Error fetching vehicle data:", error);
            }
        };
        fetchHandler();
    }, [id]);

    const sendRequest = async () => {
        await axios.put(`http://localhost:5000/notification/updateRemind/${id}`, inputs);
    };

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
        sendRequest().then(()=>
        history("/"));
      };

    return(
        <div className="form">
        <form onSubmit={handleSubmit}>
          <h2>Update The Reminder</h2>
          <div>
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              placeholder="Enter date for remind"
              className="reminder"
              name="dateRemind"
              onChange={handleChange}
              value={inputs.dateRemind}
              required
            />
          </div>
          <div>
            <label htmlFor="Piority">Priority:</label>
            <select
              className="piority"
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
  
          <div>
            <label htmlFor="Descrption">Description:</label>
            <textarea
              className="Descrption"
              placeholder="Enter reminder details"
              name="descrption"
              onChange={handleChange}
              value={inputs.descrption}
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

export default UpdatedReminders;