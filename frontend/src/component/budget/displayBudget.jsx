import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

function BudgetReport() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch budget data from MongoDB
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axios.get("http://localhost:5000/budget/display"); // Adjust API URL if needed
        setBudgets(response.data);  // Directly setting the budget entries
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

  // Filtered budgets based on search query
  const filteredBudgets = budgets.filter(
    (budget) =>
      budget.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      budget.amount.toString().includes(searchQuery) ||
      budget.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (budget.description && budget.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
    <div style={{ padding: "20px" }}>
      <h2>Budget Entries</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Category, Amount, Status, Description"
        value={searchQuery}
        onChange={handleSearchChange}
        style={{
          padding: "10px",
          marginBottom: "15px",
          width: "100%",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />

      {loading ? (
        <p>Loading budget entries...</p>
      ) : (
        <>
          <table border="1" style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
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
          <button
            onClick={generatePDF}
            style={{
              padding: "10px 15px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            Download PDF
          </button>
        </>
      )}
    </div>
  );
}

export default BudgetReport;
