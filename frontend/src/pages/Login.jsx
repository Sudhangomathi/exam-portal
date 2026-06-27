import { useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState(() => location.state?.username || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(() => location.state?.message || '');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password
      });
      onLogin(response.data);
      navigate('/branches');
    } catch (err) {
      console.error(err);
      setError('Invalid username or password');
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
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#000080' }}>
          🇮🇳 Exam Portal Login
        </h2>
        {successMessage && <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>{successMessage}</div>}
        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
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
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#555' }}>
            Don't have an account? <Link to="/register" style={{ fontWeight: 'bold', color: 'var(--green)' }}>Create new account</Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}

export default Login;
