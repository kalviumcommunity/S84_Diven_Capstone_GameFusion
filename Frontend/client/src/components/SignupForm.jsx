import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

export default function SignupForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple navigation without authentication
    navigate('/second');
  };

  return (
    <div className="login-container">
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
            <label>Username</label>
            <input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="login-input"
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
              className="login-input"
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
              className="login-input"
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
              className="login-input"
              required
            />
          </div>

          <button type="submit" className="login-submit">
            Sign Up
          </button>
        </form>

        <div className="login-footer">
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