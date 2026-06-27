import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/api/auth/register', {
        username,
        password,
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
        setError('Registration failed. Please try again.');
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
            <label className="form-label">Username / Email</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
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
          <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
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
