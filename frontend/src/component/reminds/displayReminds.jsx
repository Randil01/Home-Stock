import React, { useEffect, useState } from 'react';
import axios from "axios";
import {Link} from "react-router-dom"

const URL = "http://localhost:5000/notification/displayRemind";

const fetchHandler = async () => {
    return await axios.get(URL).then((res) => res.data);
};

function RemindersAll() {
    const [reminders, setReminds] = useState([]); 
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchHandler().then((data) => setReminds(data)); // Set the response data directly
    }, []);

    // Handle search query change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase()); // Update the search query
    };

    // Filter reminders based on search query
    const filteredReminders = reminders.filter((remind) =>
        remind.descrption.toLowerCase().includes(searchQuery) ||
        remind._id.toLowerCase().includes(searchQuery)
    );

    const deleteOldReminders = () => {
        const now = new Date();
        const updatedReminders = reminders.filter((reminder) => {
            const dateAdded = new Date(reminder.dateAdded); 
            const diffInMilliseconds = now - dateAdded;
            const diffInDays = diffInMilliseconds / (1000 * 3600 * 24); // Convert milliseconds to days
            
            // Keep reminders that are not older than 3 days
            return diffInDays <= 3;
        });

        setReminds(updatedReminders); // Update the state with reminders that are not older than 3 days
    };

    
    useEffect(() => {
        const interval = setInterval(deleteOldReminders, 86400000); 
        return () => clearInterval(interval); 
    }, [reminders]); 

    return (
        <div>
            <h1>Reminders List</h1>
            <input
                type="text"
                placeholder="Search by description or ID"
                value={searchQuery}
                onChange={handleSearchChange}
            />
            <div>
                {filteredReminders && filteredReminders.map((remind, i) => (
                    <div key={remind._id || i}>
                        <h1>Reference Number: {remind._id}</h1>
                        <h1>Date: {remind.dateRemind}</h1>
                        <h1>Priority: {remind.priority}</h1>
                        <h1>Description: {remind.descrption}</h1>
                        <Link to ={`/updateremind/${remind._id}`}><button>Update</button></Link>
                    </div>
                ))}
                {filteredReminders.length === 0 && (
                    <p>No reminders available.</p>
                )}
            </div>
        </div>
    );
}

export default RemindersAll;
