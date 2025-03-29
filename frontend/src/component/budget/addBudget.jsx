import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';

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
    await axios.post("http://localhost:5000/budget/add", {
      category: String(inputs.category),
      amount: Number(inputs.amount),
      dueDate: new Date(inputs.dueDate),
      status: String(inputs.status),
      description: String(inputs.description),
    });
  };

  // Clear functions for each part of the form
  const handleClearCategory = () => {
    setInputs((prevState) => ({
      ...prevState,
      category: "",
    }));
  };

  const handleClearAmount = () => {
    setInputs((prevState) => ({
      ...prevState,
      amount: "",
    }));
  };

  const handleClearDueDate = () => {
    setInputs((prevState) => ({
      ...prevState,
      dueDate: "",
    }));
  };

  const handleClearStatus = () => {
    setInputs((prevState) => ({
      ...prevState,
      status: "Pending",
    }));
  };

  const handleClearDescription = () => {
    setInputs((prevState) => ({
      ...prevState,
      description: "",
    }));
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h2 className="text-center mb-0">Add a Budget Entry</h2>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <div className="d-flex">
                    <Form.Select
                      name="category"
                      value={inputs.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>Select Category</option>
                      <option value="Rent">Rent</option>
                      <option value="Utility Bills">Utility Bills</option>
                      <option value="Groceries">Groceries</option>
                      <option value="Other Expense">Other Expense</option>
                    </Form.Select>
                    <Button 
                      variant="warning" 
                      className="ms-2" 
                      onClick={handleClearCategory}
                      style={{ minWidth: '80px' }}
                    >
                      Clear
                    </Button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="number"
                      placeholder="Enter amount"
                      name="amount"
                      onChange={handleChange}
                      value={inputs.amount}
                      required
                    />
                    <Button 
                      variant="warning" 
                      className="ms-2" 
                      onClick={handleClearAmount}
                      style={{ minWidth: '80px' }}
                    >
                      Clear
                    </Button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="date"
                      name="dueDate"
                      onChange={handleChange}
                      value={inputs.dueDate}
                      required
                    />
                    <Button 
                      variant="warning" 
                      className="ms-2" 
                      onClick={handleClearDueDate}
                      style={{ minWidth: '80px' }}
                    >
                      Clear
                    </Button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <div className="d-flex">
                    <Form.Select
                      name="status"
                      value={inputs.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </Form.Select>
                    <Button 
                      variant="warning" 
                      className="ms-2" 
                      onClick={handleClearStatus}
                      style={{ minWidth: '80px' }}
                    >
                      Clear
                    </Button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      onChange={handleChange}
                      value={inputs.description}
                      placeholder="Enter bill details"
                      required
                    />
                    <Button 
                      variant="warning" 
                      className="ms-2 align-self-start" 
                      onClick={handleClearDescription}
                      style={{ minWidth: '80px' }}
                    >
                      Clear
                    </Button>
                  </div>
                </Form.Group>

                <div className="d-flex justify-content-center gap-2">
                  <Button variant="success" type="submit" size="3g">
                    Submit
                  </Button>
                  <Button 
                    variant="danger"          // Red color theme
                    onClick={() => history("/")} 
                    size="3g"                 // Large size
                  >
                  Close
                  </Button>

                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AddBudget;
