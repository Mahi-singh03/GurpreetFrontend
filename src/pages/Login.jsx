import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import './css/Login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await axios.post('https://backend-mqy5.onrender.com/api/users/login', {
        email,
        password
      });

      const userRes = await axios.get('https://backend-mqy5.onrender.com/api/users/score', {
        headers: { 'x-auth-token': res.data.token }
      });

      login(res.data.token, userRes.data);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      alert(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container"> 
      <div className="register-card">
        <div className="register-header">
          <h2 className="register-title">Welcome Back</h2>
          <p className="register-subtitle">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <AiOutlineMail className="input-icon" />
            <input
              type="email"
              className="register-input"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <AiOutlineLock className="input-icon" />
            <input
              type="password"
              className="register-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="6"
              required
            />
          </div>

          <button 
            type="submit" 
            className="register-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="loading-spinner" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="login-link">
          Don't have an account?{' '}
          <Link to="/register" className="login-link">
            Create account
          </Link>
        </p>

        <div className="forgot-password">
          <Link to="/forgot-password" className="login-link">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;