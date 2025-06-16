import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginImage from '../assets/login(2).jpg';
import './LoginForm.css';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token in localStorage
        localStorage.setItem('token', data.token);
        // Navigate to the second page
        navigate('/second');
      } else {
        // Handle error
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className={`login-container ${theme}`}>
      <button className="back-arrow" onClick={() => navigate('/second')}>
        ←
      </button>
      <div className="login-box">
        <div className="login-header">
          <h1 className="login-title">
            <span>GameFusion</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`login-input ${theme}`}
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
              className={`login-input ${theme}`}
              required
            />
          </div>

          <button type="submit" className="login-submit">
            Login
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <button 
              className="switch-auth"
              onClick={() => navigate('/auth', { state: { isLogin: false } })}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
} 