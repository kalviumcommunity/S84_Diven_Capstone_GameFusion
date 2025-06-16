import React from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

export default function AuthPage() {
  const location = useLocation();
  const isLogin = location.state?.isLogin ?? true;

  return isLogin ? <LoginForm /> : <SignupForm />;
} 