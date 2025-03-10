import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { AiOutlineUser, AiOutlinePhone, AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import './css/Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await axios.post('https://backend-mqy5.onrender.com/api/users/register', {
        name,
        phone: phone.replace(/-/g, ''),
        email,
        password
      });

      const userRes = await axios.get('https://backend-mqy5.onrender.com/api/users/score', {
        headers: { 'x-auth-token': res.data.token }
      });

      login(res.data.token, userRes.data);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      alert(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">Join our community today</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <AiOutlineUser className="input-icon" />
            <input
              type="text"
              className="register-input"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <AiOutlinePhone className="input-icon" />
            <input
              type="tel"
              className="register-input"
              placeholder="Phone Number"
              value={phone}
              onChange={handlePhoneChange}
              maxLength="12"
              required
            />
          </div>

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
              'Register Now'
            )}
          </button>
        </form>

        <p className="login-link">
          Already have an account?{' '}
          <Link to="/login" className="login-link">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;