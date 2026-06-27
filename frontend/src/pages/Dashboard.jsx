import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard({ user }) {
  const [branches, setBranches] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/branches');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [branchesResponse, usersResponse] = await Promise.all([
          axios.get('/api/branches'),
          axios.get('/api/auth/users')
        ]);
        setBranches(branchesResponse.data);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user, navigate]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '1.2rem', fontWeight: 'bold' }}>Loading Portal Dashboard...</div>;

  // Calculate student count
  const studentUsers = users.filter(u => u.role === 'USER');
  const studentCount = studentUsers.length;
  const courseCount = branches.length;

  // Compute course popularity ("Highly Studied Courses")
  const coursePopularityMap = {};
  branches.forEach(b => {
    coursePopularityMap[b.name] = 0;
  });
  studentUsers.forEach(u => {
    if (u.course && u.course !== 'N/A') {
      coursePopularityMap[u.course] = (coursePopularityMap[u.course] || 0) + 1;
    }
  });

  const sortedPopularCourses = Object.entries(coursePopularityMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Compile master exam list for the Master Database tab
  const examMasterList = [];
  const examSeen = new Set();
  branches.forEach(b => {
    if (b.exams) {
      b.exams.forEach(e => {
        if (!examSeen.has(e.id)) {
          examSeen.add(e.id);
          const applicableBranches = branches
            .filter(branch => branch.exams?.some(exam => exam.id === e.id))
            .map(branch => branch.shortName);
          examMasterList.push({
            ...e,
            branches: applicableBranches
          });
        }
      });
    }
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Back to Home Button */}
      <button 
        onClick={() => navigate('/branches')}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--navy)',
          cursor: 'pointer',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          outline: 'none'
        }}
      >
        ← Back to Home
      </button>

      {/* Header title */}
      <div style={{ marginBottom: '2rem', borderBottom: '3px solid var(--navy)', paddingBottom: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--saffron)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          🛡️ Administrator Console
        </span>
        <h2 style={{ color: 'var(--navy)', fontSize: '2.2rem', marginTop: '0.2rem', marginBottom: 0 }}>
          Portal Management & Analytics
        </h2>
      </div>

      {/* Option Selection Tabs (Master Database is stored under a single option tab) */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #ddd', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            padding: '1rem 2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            border: 'none',
            borderBottom: activeTab === 'analytics' ? '4px solid var(--navy)' : 'none',
            backgroundColor: 'transparent',
            color: activeTab === 'analytics' ? 'var(--navy)' : '#555',
            fontSize: '1.1rem',
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          📊 Student Analytics & Logins
        </button>
        <button
          onClick={() => setActiveTab('master_db')}
          style={{
            padding: '1rem 2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            border: 'none',
            borderBottom: activeTab === 'master_db' ? '4px solid var(--navy)' : 'none',
            backgroundColor: 'transparent',
            color: activeTab === 'master_db' ? 'var(--navy)' : '#555',
            fontSize: '1.1rem',
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          📋 Master Exam Database
        </button>
      </div>

      {/* Tab Content Panel */}
      {activeTab === 'analytics' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Statistics Info Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', borderLeft: '6px solid var(--navy)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>👥</span>
              <span style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--navy)' }}>{studentCount}</span>
              <h4 style={{ margin: '0.5rem 0 0 0', color: '#666', fontWeight: '600' }}>Registered Students</h4>
            </div>
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', borderLeft: '6px solid var(--saffron)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>📚</span>
              <span style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--saffron)' }}>{courseCount}</span>
              <h4 style={{ margin: '0.5rem 0 0 0', color: '#666', fontWeight: '600' }}>Available Courses</h4>
            </div>
          </div>

          {/* Highly Studied Courses Ranking */}
          <div className="glass-card" style={{ padding: '2rem', boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)' }}>
            <h3 style={{ color: 'var(--navy)', fontSize: '1.4rem', marginTop: 0, marginBottom: '1.5rem' }}>
              🔥 Highly Studied Courses (Popularity Ranking)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {sortedPopularCourses.map((item, index) => {
                const maxStudents = Math.max(...sortedPopularCourses.map(c => c.count)) || 1;
                const percentage = (item.count / maxStudents) * 100;
                return (
                  <div key={item.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', fontSize: '0.95rem' }}>
                      <span style={{ color: 'var(--navy)' }}>{index + 1}. {item.name}</span>
                      <span style={{ color: 'var(--saffron)' }}>{item.count} student(s) studying</span>
                    </div>
                    <div style={{ width: '100%', height: '12px', backgroundColor: '#f0f0f0', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${percentage}%`, 
                        height: '100%', 
                        backgroundColor: index === 0 ? 'var(--navy)' : index === 1 ? '#3b82f6' : 'var(--saffron)', 
                        borderRadius: '6px',
                        transition: 'width 0.5s ease-in-out' 
                      }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Logins detail table */}
          <div className="glass-card" style={{ padding: '2rem', boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)' }}>
            <h3 style={{ color: 'var(--navy)', fontSize: '1.4rem', marginTop: 0, marginBottom: '1.2rem' }}>
              👤 Active Student Logins
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--navy)', backgroundColor: '#f0f4f8' }}>
                    <th style={{ padding: '1rem', color: 'var(--navy)', fontWeight: 'bold' }}>Student Name (Login)</th>
                    <th style={{ padding: '1rem', color: 'var(--navy)', fontWeight: 'bold' }}>Registered Engineering Course</th>
                    <th style={{ padding: '1rem', color: 'var(--navy)', fontWeight: 'bold' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentUsers.map((student, idx) => (
                    <tr key={student.id} style={{ borderBottom: '1px solid #eee', backgroundColor: idx % 2 === 0 ? 'white' : '#fcfcfc' }}>
                      <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--navy)' }}>{student.username}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ backgroundColor: '#e6f7ff', color: '#0050b3', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                          {student.course || 'Unassigned'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ color: 'green', fontWeight: 'bold' }}>● Registered</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        /* Tab 2: Master Exam Database */
        <div className="glass-card" style={{ padding: '2.5rem', boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)' }}>
          <h3 style={{ color: 'var(--navy)', fontSize: '1.6rem', marginTop: 0, marginBottom: '1rem' }}>
            📋 Master Exam Database
          </h3>
          <p style={{ color: 'var(--text-color)', opacity: 0.8, fontSize: '1rem', marginBottom: '2rem', lineHeight: '1.5' }}>
            A comprehensive overview showing all government and PSU examinations mapped against the respective academic engineering departments.
          </p>
          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid rgba(0,0,128,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f4f8', borderBottom: '2px solid var(--navy)' }}>
                  <th style={{ padding: '1rem 1.2rem', color: 'var(--navy)', fontWeight: 'bold' }}>Exam</th>
                  <th style={{ padding: '1rem 1.2rem', color: 'var(--navy)', fontWeight: 'bold' }}>Conducting Body</th>
                  <th style={{ padding: '1rem 1.2rem', color: 'var(--navy)', fontWeight: 'bold' }}>Category</th>
                  <th style={{ padding: '1rem 1.2rem', color: 'var(--navy)', fontWeight: 'bold' }}>Purpose & Description</th>
                  <th style={{ padding: '1rem 1.2rem', color: 'var(--navy)', fontWeight: 'bold' }}>Mapped Departments</th>
                </tr>
              </thead>
              <tbody>
                {examMasterList.map((exam, idx) => (
                  <tr key={exam.id} style={{ borderBottom: '1px solid rgba(0,0,128,0.05)', backgroundColor: idx % 2 === 0 ? 'white' : '#f9fbfe' }}>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: 'bold', color: 'var(--navy)' }}>{exam.name}</td>
                    <td style={{ padding: '1rem 1.2rem', color: 'var(--text-color)' }}>{exam.conductingBody}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <span style={{ 
                        backgroundColor: exam.category.toLowerCase() === 'defence' ? '#ffe8d6' : '#e6f7ff', 
                        color: exam.category.toLowerCase() === 'defence' ? 'var(--saffron)' : '#0050b3', 
                        padding: '0.25rem 0.6rem', 
                        borderRadius: '12px', 
                        fontSize: '0.8rem', 
                        fontWeight: 'bold' 
                      }}>
                        {exam.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.2rem', fontSize: '0.92rem', color: '#444', maxWidth: '350px', lineHeight: '1.5' }}>{exam.purpose}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        {exam.branches.map(brName => (
                          <span key={brName} style={{ backgroundColor: 'var(--navy)', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                            {brName}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Official Footer */}
      <footer style={{ 
        marginTop: '4rem', 
        borderTop: '2px solid var(--navy)', 
        paddingTop: '2rem', 
        paddingBottom: '2rem', 
        color: 'var(--text-color)', 
        textAlign: 'center', 
        fontSize: '0.9rem',
        opacity: 0.95
      }}>
        <p style={{ fontSize: '0.85rem', margin: '4px 0' }}>© 2026 National Engineering Exam Portal, Ministry of Education, Government of India.</p>
        <p style={{ fontSize: '0.78rem', color: '#666' }}>Developed and hosted by National Informatics Centre (NIC).</p>
      </footer>

    </div>
  );
}

export default Dashboard;
