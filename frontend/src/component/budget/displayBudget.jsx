import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import './BudgetReport.css'; // Import the CSS

function BudgetReport() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");  
  const [filteredBudgets, setFilteredBudgets] = useState([]);  
  const [editingBudget, setEditingBudget] = useState(null); // State to hold the budget being edited

  // Fetch budget data from MongoDB
  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get("http://localhost:5000/budget/display"); // Adjust API URL if needed
      setBudgets(response.data);  
      setFilteredBudgets(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query state
  };

  // Automatically filter budgets as the user types
  useEffect(() => {
    const filtered = budgets.filter((budget) =>
      budget.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      budget.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (budget.description && budget.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredBudgets(filtered);
  }, [searchQuery, budgets]); // Trigger this effect when `searchQuery` or `budgets` changes

  // Delete a budget entry
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget entry?")) {
      try {
        await axios.delete(`http://localhost:5000/budget/delete/${id}`);
        alert("Budget entry deleted successfully!");
        fetchBudgets(); // Refresh the data after deletion
      } catch (error) {
        console.error("Error deleting budget entry:", error);
        alert("Failed to delete budget entry.");
      }
    }
  };

  // Handle updating a budget entry
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/budget/update/${editingBudget._id}`, editingBudget);
      alert("Budget entry updated successfully!");
      setEditingBudget(null); // Clear the form after update
      fetchBudgets(); // Refresh the data
    } catch (error) {
      console.error("Error updating budget:", error);
      alert("Failed to update budget entry.");
    }
  };

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();

    // Title for the PDF report: "Budget Entries Report"
    const title = "Budget Entries Report";

    // Set the font style for the title
    doc.setFontSize(16);
    
    // Center the title by calculating the x position
    const pageWidth = doc.internal.pageSize.width;
    const titleWidth = doc.getTextWidth(title);
    const xPosition = (pageWidth - titleWidth) / 2;  // Center the text on the page

    // Text display for "Budget Entries Report"
    doc.text(title, xPosition, 15);

    // Underline the title by drawing a line beneath it
    doc.setLineWidth(0.5); // Set line width for underlining
    doc.line(xPosition, 17, xPosition + titleWidth, 17); // Line starts under the title

    // Table headers
    const headers = [["Category", "Amount (Rs)", "Due Date", "Status", "Description"]];  // Changed "$" to "Rs"

    // Table data
    const data = filteredBudgets.map(item => [
      item.category,
      `Rs. ${item.amount.toFixed(2)}`,  // Changed currency symbol to "Rs"
      new Date(item.dueDate).toLocaleDateString(),
      item.status,
      item.description || "N/A"
    ]);

    // Generate table
    doc.autoTable({
      head: headers,
      body: data,
      startY: 35, // Adjust startY so the table doesn't overlap with the title
    });

    doc.save("Budget_Entries_Report.pdf"); // Save as PDF
  };

  // Handle editing a budget entry (set state to show edit form)
  const handleEdit = (budget) => {
    setEditingBudget(budget);
  };

  return (
    <div className="budget-container">
      <h2 className="budget-title">Budget Entries</h2>

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by category, status, or description"
          value={searchQuery}
          onChange={handleSearchChange} // Automatically filter as the user types
        />
      </div>

      {loading ? (
        <p>Loading budget entries...</p>
      ) : (
        <>
          <table className="budget-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount (Rs)</th> {/* Changed header to "Amount (Rs)" */}
                <th>Due Date</th>
                <th>Status</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBudgets.length > 0 ? (
                filteredBudgets.map((item, index) => (
                  <tr key={index}>
                    <td>{item.category}</td>
                    <td>Rs. {item.amount.toFixed(2)}</td> {/* Changed currency symbol to "Rs" */}
                    <td>{new Date(item.dueDate).toLocaleDateString()}</td>
                    <td>{item.status}</td>
                    <td>{item.description || "N/A"}</td>
                    <td>
                      <button onClick={() => handleEdit(item)} className="edit-btn">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="delete-btn">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>No budget data available</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Download PDF Button */}
          <button onClick={generatePDF} className="download-btn">
            Download PDF
          </button>

          {/* Edit Budget Form */}
          {editingBudget && (
            <div className="edit-form">
              <h3>Edit Budget</h3>
              <input
                type="text"
                value={editingBudget.category}
                onChange={(e) => setEditingBudget({ ...editingBudget, category: e.target.value })}
              />
              <input
                type="number"
                value={editingBudget.amount}
                onChange={(e) => setEditingBudget({ ...editingBudget, amount: e.target.value })}
              />
              <input
                type="date"
                value={editingBudget.dueDate}
                onChange={(e) => setEditingBudget({ ...editingBudget, dueDate: e.target.value })}
              />
              <textarea
                value={editingBudget.description}
                onChange={(e) => setEditingBudget({ ...editingBudget, description: e.target.value })}
              />
              <button onClick={handleUpdate}>Update Budget</button>
              <button onClick={() => setEditingBudget(null)}>Cancel</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BudgetReport;
