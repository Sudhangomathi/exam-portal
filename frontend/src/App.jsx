import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Branches from './pages/Branches';
import BranchExams from './pages/BranchExams';
import ExamVideos from './pages/ExamVideos';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      {user && <Navbar user={user} onLogout={handleLogout} theme={theme} setTheme={setTheme} />}
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/branches" />} />
          <Route path="/register" element={!user ? <Register onLogin={handleLogin} /> : <Navigate to="/branches" />} />
          <Route path="/branches" element={user ? <Branches user={user} /> : <Navigate to="/" />} />
          <Route path="/dashboard" element={user && user.role === 'ADMIN' ? <Dashboard user={user} /> : <Navigate to={user ? "/branches" : "/"} />} />
          <Route path="/branches/:id/exams" element={user ? <BranchExams user={user} /> : <Navigate to="/" />} />
          <Route path="/branches/:branchId/exams/:examId" element={user ? <ExamVideos user={user} /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to={user ? "/branches" : "/"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
