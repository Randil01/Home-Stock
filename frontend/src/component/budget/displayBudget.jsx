import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; // Ensure the direct import if needed

function BudgetReport() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch budget data from MongoDB
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axios.get("http://localhost:5000/budget/display");
        setBudgets(response.data); // Assuming response.data is an array
        setLoading(false);
      } catch (error) {
        console.error("Error fetching budgets:", error);
        setLoading(false);
      }
    };
    fetchBudgets();
  }, []);

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Budget Entries Report", 14, 15); // Title

    // Table headers
    const headers = [["Category", "Amount ($)", "Due Date", "Status", "Description"]];

    // Table data
    const data = budgets.map(item => [
      item.category,
      item.amount.toFixed(2),
      new Date(item.dueDate).toLocaleDateString(),
      item.status,
      item.description || "N/A"
    ]);

    // Generate table using autoTable
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 25,
    });

    // Save the PDF file
    doc.save("Budget_Entries_Report.pdf");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Budget Entries</h2>
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
              {budgets.length > 0 ? (
                budgets.map((item, index) => (
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
