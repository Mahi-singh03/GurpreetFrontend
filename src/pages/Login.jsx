import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { AiOutlinePhone, AiOutlineLock } from 'react-icons/ai';
import './css/Login.css'; 

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Step 1: Authenticate the user
      const res = await axios.post('https://backend-production-e56f.up.railway.app/api/users/login', {
        phone,
        password,
      });

      // Step 2: Fetch user data (including exam status)
      const userRes = await axios.get('https://backend-mqy5.onrender.com/api/users/score', {
        headers: { 'x-auth-token': res.data.token },
      });

      // Step 3: Log the user in
      login(res.data.token, userRes.data);

      // Step 4: Redirect based on exam status
      if (userRes.data.hasGivenExam) {
        navigate('/score'); // Navigate to score page if exam is already taken
      } else {
        navigate('/'); // Navigate to dashboard if exam is not taken
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to continue</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <AiOutlinePhone className="input-icon" />
            <input
              type="tel"
              className="auth-input"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <AiOutlineLock className="input-icon" />
            <input
              type="password"
              className="auth-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="6"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="loading-spinner" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Create account
            </Link>
          </p>
          <p>
            <Link to="/forgot-password" className="auth-link">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;