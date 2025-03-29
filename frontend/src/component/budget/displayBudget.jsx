import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Table, Button, Container, Form, Card, Row, Col } from 'react-bootstrap';

function BudgetReport() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBudgets, setFilteredBudgets] = useState([]);
  const [editingBudget, setEditingBudget] = useState(null);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get("http://localhost:5000/budget/display");
      setBudgets(response.data);
      setFilteredBudgets(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const filtered = budgets.filter((budget) =>
      budget.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      budget.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (budget.description && budget.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredBudgets(filtered);
  }, [searchQuery, budgets]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget entry?")) {
      try {
        await axios.delete(`http://localhost:5000/budget/delete/${id}`);
        alert("Budget entry deleted successfully!");
        fetchBudgets();
      } catch (error) {
        console.error("Error deleting budget entry:", error);
        alert("Failed to delete budget entry.");
      }
    }
  };

  const handleUpdate = async () => {
    if (!editingBudget || !editingBudget._id) {
      alert("No budget entry selected for update");
      return;
    }
    
    try {
      await axios.put(`http://localhost:5000/budget/update/${editingBudget._id}`, editingBudget);
      alert("Budget entry updated successfully!");
      setEditingBudget(null);
      fetchBudgets();
    } catch (error) {
      console.error("Error updating budget:", error);
      alert("Failed to update budget entry.");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const title = "Budget Entries Report";
    doc.setFontSize(16);
    const pageWidth = doc.internal.pageSize.width;
    const titleWidth = doc.getTextWidth(title);
    const xPosition = (pageWidth - titleWidth) / 2;
    doc.text(title, xPosition, 15);
    doc.setLineWidth(0.5);
    doc.line(xPosition, 17, xPosition + titleWidth, 17);

    const headers = [["Category", "Amount (Rs)", "Due Date", "Status", "Description"]];
    const data = filteredBudgets.map(item => [
      item.category || 'N/A',
      `Rs. ${item.amount ? item.amount.toFixed(2) : '0.00'}`,
      item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'No date',
      item.status || 'N/A',
      item.description || "N/A"
    ]);

    doc.autoTable({
      head: headers,
      body: data,
      startY: 35,
    });

    doc.save("Budget_Entries_Report.pdf");
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
  };

  return (
    <Container className="py-5">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white">
          <h2 className="text-center mb-0">Budget Entries</h2>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={6} className="mx-auto">
              <Form.Control
                type="text"
                placeholder="Search by category, status, or description"
                value={searchQuery}
                onChange={handleSearchChange}
                className="shadow-sm"
              />
            </Col>
          </Row>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table striped bordered hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Category</th>
                      <th>Amount (Rs)</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBudgets.length > 0 ? (
                      filteredBudgets.map((item, index) => (
                        <tr key={index}>
                          <td>{item.category}</td>
                          <td>Rs. {item.amount ? item.amount.toFixed(2) : '0.00'}</td>
                          <td>{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'No date'}</td>
                          <td>
                            {item.status ? (
                              <span className={`badge bg-${item.status === 'Paid' ? 'success' : item.status === 'Pending' ? 'warning' : 'danger'}`}>
                                {item.status}
                              </span>
                            ) : (
                              <span className="badge bg-secondary">N/A</span>
                            )}
                          </td>
                          <td>{item.description || "N/A"}</td>
                          <td>
                            <Button variant="primary" size="sm" onClick={() => handleEdit(item)} className="me-2">
                              Edit
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(item._id)}>
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">No budget data available</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              <div className="text-center mt-4">
                <Button variant="success" onClick={generatePDF} size="lg">
                  Download PDF
                </Button>
              </div>

              {editingBudget && (
                <Card className="mt-4">
                  <Card.Header className="bg-warning">
                    <h3 className="mb-0">Edit Budget</h3>
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                          type="text"
                          value={editingBudget?.category || ''}
                          onChange={(e) => setEditingBudget({ ...editingBudget, category: e.target.value })}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                          type="number"
                          value={editingBudget?.amount || ''}
                          onChange={(e) => setEditingBudget({ ...editingBudget, amount: e.target.value })}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Due Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={editingBudget?.dueDate ? editingBudget.dueDate.substring(0, 10) : ''}
                          onChange={(e) => setEditingBudget({ ...editingBudget, dueDate: e.target.value })}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={editingBudget?.description || ''}
                          onChange={(e) => setEditingBudget({ ...editingBudget, description: e.target.value })}
                        />
                      </Form.Group>
                      <div className="d-flex justify-content-center gap-2">
                        <Button variant="success" onClick={handleUpdate}>Update Budget</Button>
                        <Button variant="secondary" onClick={() => setEditingBudget(null)}>Cancel</Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default BudgetReport;