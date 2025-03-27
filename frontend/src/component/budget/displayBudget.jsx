import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import './BudgetReport.css'; // Import the CSS

function BudgetReport() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");  // State for search query
  const [filteredBudgets, setFilteredBudgets] = useState([]);  // State for filtered results

  // Fetch budget data from MongoDB
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axios.get("http://localhost:5000/budget/display"); // Adjust API URL if needed
        setBudgets(response.data);  // Directly setting the budget entries
        setFilteredBudgets(response.data);  // Initially, show all budgets
        setLoading(false);
      } catch (error) {
        console.error("Error fetching budgets:", error);
        setLoading(false);
      }
    };
    fetchBudgets();
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Perform search filter
  const handleSearch = () => {
    const filtered = budgets.filter((budget) =>
      budget.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      budget.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (budget.description && budget.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredBudgets(filtered);
  };

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Budget Entries Report", 14, 15); // Title

    // Table headers
    const headers = [["Category", "Amount ($)", "Due Date", "Status", "Description"]];

    // Table data
    const data = filteredBudgets.map(item => [
      item.category,
      item.amount.toFixed(2),
      new Date(item.dueDate).toLocaleDateString(),
      item.status,
      item.description || "N/A"
    ]);

    // Generate table
    doc.autoTable({
      head: headers,
      body: data,
      startY: 25,
    });

    doc.save("Budget_Entries_Report.pdf"); // Save as PDF
  };

  return (
    <div className="budget-container">
      <h2 className="budget-title">Budget Entries</h2>

      {/* Search Input and Button */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by category, status, or description"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button onClick={handleSearch} className="search-btn">Search</button>
      </div>

      {loading ? (
        <p>Loading budget entries...</p>
      ) : (
        <>
          <table className="budget-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount ($)</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredBudgets.length > 0 ? (
                filteredBudgets.map((item, index) => (
                  <tr key={index}>
                    <td>{item.category}</td>
                    <td>${item.amount.toFixed(2)}</td>
                    <td>{new Date(item.dueDate).toLocaleDateString()}</td>
                    <td>{item.status}</td>
                    <td>{item.description || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>No budget data available</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Download PDF Button */}
          <button onClick={generatePDF} className="download-btn">
            Download PDF
          </button>
        </>
      )}
    </div>
  );
}

export default BudgetReport;
