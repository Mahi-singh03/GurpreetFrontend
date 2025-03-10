import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AiOutlineUser, AiOutlinePhone, AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import './css/Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (e) => {
    setPhone(formatPhoneNumber(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('https://backend-production-e56f.up.railway.app/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone: phone.replace(/-/g, ''), // Remove dashes before sending
          email,
          password
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await res.json();

      // Fetch user details including score
      const userRes = await fetch('https://backend-production-e56f.up.railway.app/api/users/score', {
        headers: { 'x-auth-token': data.token }
      });

      if (!userRes.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userRes.json();

      // Store token and user info in context
      login(data.token, userData);
      
      // Show the popup modal
      setIsRegistered(true);
    } catch (err) {
      console.error('Registration error:', err);
      alert(err.message || 'Registration failed. Please try again.');
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
            {isSubmitting ? <div className="loading-spinner" /> : 'Register Now'}
          </button>
        </form>

        <p className="login-link">
          Already have an account?{' '}
          <Link to="/login" className="login-link">Sign in here</Link>
        </p>
      </div>

      {/* POPUP MODAL */}
      {isRegistered && (
        <div className="modal-overlay" onClick={() => setIsRegistered(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Registration Complete 🎉</h2>
            <p>You have successfully registered. Click below to start your exam.</p>
            <button className="exam-button" onClick={() => navigate('/exam')}>
              Go to Exam
            </button>
          </div>
        </div>
      )}

      {/* MODAL STYLES */}
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          width: 300px;
        }
        .exam-button {
          margin-top: 15px;
          padding: 10px 15px;
          border: none;
          background: #007bff;
          color: white;
          border-radius: 5px;
          cursor: pointer;
        }
        .exam-button:hover {
          background: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default Register;
