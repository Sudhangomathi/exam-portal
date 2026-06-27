import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');

  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) {
      setError('Please enter your email address first.');
      return;
    }
    setError('');
    setOtpMessage('');
    setOtpLoading(true);

    try {
      const response = await axios.post('/api/auth/send-otp', { email: email.trim() });
      setOtpSent(true);
      setOtpMessage(response.data.message);
      if (response.data.simulated && response.data.otp) {
        setSimulatedOtp(response.data.otp);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to send verification OTP. Please try again.');
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!otpSent) {
      setError('Please request and verify the OTP code before registering.');
      return;
    }

    setLoading(true);

    try {
      await axios.post('/api/auth/register', {
        username,
        password,
        email: email.trim(),
        otp: otp.trim(),
        role,
        course: 'N/A'
      });
      // Redirect to login page instead of auto-logging in
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please log in.', 
          username: username 
        } 
      });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed. Please check your OTP and details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <img 
        src="/emblem.svg" 
        alt="Indian Emblem" 
        style={{
          position: 'fixed',
          top: '50%',
          left: '10%',
          transform: 'translateY(-50%)',
          width: '20%',
          opacity: 0.9,
          zIndex: -1,
          pointerEvents: 'none'
        }} 
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: '80vh', paddingRight: '2rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '550px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--navy)' }}>
          🇮🇳 Create Account
        </h2>
        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={otpSent}
                required
              />
              <button
                type="button"
                className="btn btn-navy"
                onClick={handleSendOtp}
                disabled={otpLoading || !email || otpSent}
                style={{ whiteSpace: 'nowrap', padding: '0.6rem 1rem' }}
              >
                {otpLoading ? 'Sending...' : otpSent ? 'Sent ✓' : 'Send OTP'}
              </button>
            </div>
          </div>

          {otpSent && (
            <div className="form-group" style={{ animation: 'fadeIn 0.3s ease' }}>
              <label className="form-label">OTP Verification Code</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter 6-digit OTP code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
              {otpMessage && <div style={{ color: 'green', fontSize: '0.85rem', marginTop: '0.25rem', fontWeight: 'bold' }}>{otpMessage}</div>}
              {simulatedOtp && (
                <div style={{
                  backgroundColor: '#fff8e6',
                  border: '1px solid #ffe8b3',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  marginTop: '0.5rem',
                  fontSize: '0.85rem',
                  color: '#b7791f',
                  fontWeight: 'bold',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem'
                }}>
                  <span>💡 <strong>Development Mode OTP:</strong></span>
                  <span style={{ fontSize: '1.1rem', letterSpacing: '2px', color: 'var(--navy)' }}>{simulatedOtp}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'normal', opacity: 0.8 }}>This mock code is provided because SMTP configuration was skipped or not set.</span>
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Account Type</label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="USER">User (Student/Candidate)</option>
              <option value="ADMIN">Admin (Portal Administrator)</option>
            </select>
          </div>
          <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '1.2rem' }} disabled={loading}>
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#555' }}>
            Already have an account? <Link to="/login" style={{ fontWeight: 'bold', color: 'var(--saffron)' }}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}

export default Register;
