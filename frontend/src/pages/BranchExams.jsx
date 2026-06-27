import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BranchExams({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id === 'all' && user?.role !== 'ADMIN') {
      alert("Access Denied: Only administrators can view consolidated data across all departments.");
      navigate('/branches');
      return;
    }

    const fetchBranch = async () => {
      try {
        if (id === 'all') {
          const response = await axios.get('/api/branches');
          const allExamsMap = new Map();
          response.data.forEach(b => {
            if (b.exams) {
              b.exams.forEach(e => {
                allExamsMap.set(e.id, e);
              });
            }
          });
          setBranch({
            name: "All Engineering Departments",
            shortName: "ALL",
            description: "A consolidated list of all government and PSU recruitment examinations across all engineering disciplines.",
            exams: Array.from(allExamsMap.values())
          });
        } else {
          const response = await axios.get(`/api/branches/${id}`);
          setBranch(response.data);
        }
      } catch (error) {
        console.error("Error fetching branch details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBranch();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  if (!branch) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Branch not found.</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/branches')}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--navy)',
          cursor: 'pointer',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        ← Back to Departments
      </button>

      <div className="glass-card" style={{ marginBottom: '3rem', textAlign: 'center', borderTop: '5px solid var(--saffron)' }}>
        <h2 style={{ color: 'var(--navy)', fontSize: '2.5rem', marginBottom: '1rem', marginTop: 0 }}>
          {branch.name} ({branch.shortName})
        </h2>
        <p style={{ color: '#555', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
          {branch.description}
        </p>
      </div>

      <h3 style={{ color: 'var(--navy)', fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
        Applicable Government & PSU Exams
      </h3>

      {branch.exams && branch.exams.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {branch.exams.map(exam => (
            <div 
              key={exam.id} 
              onClick={() => navigate(`/branches/${id}/exams/${exam.id}`)}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = 'var(--saffron)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                e.currentTarget.style.borderColor = '#f0f0f0';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h4 style={{ color: 'var(--primary-color)', margin: 0, fontSize: '1.2rem' }}>{exam.name}</h4>
                <span style={{ 
                  backgroundColor: '#e6f7ff', 
                  color: '#0050b3', 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: '12px', 
                  fontSize: '0.8rem', 
                  fontWeight: 'bold' 
                }}>
                  {exam.category}
                </span>
              </div>
              
              <div style={{ marginBottom: '1rem', color: '#666', fontSize: '0.95rem' }}>
                <strong>Conducting Body:</strong> {exam.conductingBody}
              </div>
              
              <p style={{ color: '#444', lineHeight: '1.5', flexGrow: 1, margin: 0 }}>
                {exam.purpose}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#f9f9f9', borderRadius: '12px', color: '#666' }}>
          <p style={{ fontSize: '1.2rem' }}>No specific government exams are listed for this department yet.</p>
        </div>
      )}
    </div>
  );
}

export default BranchExams;
