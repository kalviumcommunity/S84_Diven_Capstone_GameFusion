import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginImage1 from '../assets/login(1).jpg';
import loginImage2 from '../assets/login(2).jpg';
import './SignupForm.css';

export default function SignupForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [theme] = useState('dark');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token in localStorage
        localStorage.setItem('token', data.token);
        // Navigate to the second page
        navigate('/second');
      } else {
        // Handle error
        console.error('Signup failed:', data.message);
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <div className={`signup-container ${theme}`}>
      <button className="back-arrow" onClick={() => navigate('/second')}>
        ←
      </button>
      <div className="signup-box">
        <div className="signup-header">
          <h1 className="signup-title">
            <span>GameFusion</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={`signup-input ${theme}`}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`signup-input ${theme}`}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`signup-input ${theme}`}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={`signup-input ${theme}`}
              required
            />
          </div>

          <button type="submit" className="signup-submit">
            Sign Up
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <button 
              className="switch-auth"
              onClick={() => navigate('/auth', { state: { isLogin: true } })}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
} 