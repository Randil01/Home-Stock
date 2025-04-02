import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect to home page or dashboard
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <Container fluid 
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
      }}
    >
      {/* Overlay with gradient */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)',
          zIndex: 1
        }}
      ></div>

      <Row className="w-100 justify-content-center position-relative" style={{ zIndex: 2 }}>
        <Col xs={11} sm={8} md={6} lg={5} xl={4}>
          <div className="text-center mb-4">
            <h1 className="display-4 fw-bold fst-italic text-white mb-4">Join Home Stock</h1>
            <p className="lead text-white fst-italic">Create Your Account and Start Managing Your Home</p>
          </div>
          <Card className="shadow-lg border-0 bg-white bg-opacity-95 position-relative overflow-hidden">
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-primary bg-opacity-10"></div>
            <Card.Body className="p-4 position-relative">
              <h2 className="text-center mb-4 text-primary">Sign Up</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-primary">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="rounded-3 shadow-sm"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-primary">Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="rounded-3 shadow-sm"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-primary">Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="rounded-3 shadow-sm"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-primary">Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="rounded-3 shadow-sm"
                  />
                </Form.Group>

                <div className="d-flex justify-content-center">
                  <Button variant="primary" type="submit" className="rounded-pill px-5 shadow-sm" style={{ width: '200px' }}>
                    Sign Up
                  </Button>
                </div>
              </Form>
              
              <div className="text-center mt-3">
                <p className="mb-0">Already have an account? <Link to="/login" className="text-primary text-decoration-none">Login</Link></p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup; 