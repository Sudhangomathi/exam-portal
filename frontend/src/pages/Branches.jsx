import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Branches({ user }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get('/api/branches');
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '1.2rem', fontWeight: 'bold' }}>Loading Portal Data...</div>;

  // Calculate live statistics from data
  const totalUniqueExams = new Set(
    branches.flatMap(b => (b.exams || []).map(e => e.name))
  ).size;

  const totalUniqueBodies = new Set(
    branches.flatMap(b => (b.exams || []).map(e => e.conductingBody))
  ).size;

  return (
    <div id="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Announcements Marquee Strip */}
      <div className="announcement-ticker" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div className="ticker-label">🔔 ANNOUNCEMENTS</div>
        <div className="ticker-content">
          <marquee behavior="scroll" direction="left" scrollamount="4">
            <span className="ticker-item">
              <span className="ticker-badge">NEW</span> 
              GATE 2026 Registration Portal is now active. Technical Graduates must register before the last date.
            </span>
            <span className="ticker-item">
              <span className="ticker-badge">UPDATED</span> 
              UPSC Engineering Services Examination (ESE/IES) 2026 preliminary syllabus and dates released.
            </span>
            <span className="ticker-item">
              <span className="ticker-badge">INFO</span> 
              NTPC & ONGC invite executive applications for Graduate Engineer Trainees through GATE-2026.
            </span>
            <span className="ticker-item">
              <span className="ticker-badge">NEW</span> 
              DRDO Recruitment and Assessment Centre (RAC) updates scientist recruitment vacancies.
            </span>
          </marquee>
        </div>
      </div>

      {/* Gov Portal Banner & Hero */}
      <div className="gov-hero">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
          alt="Emblem of India" 
          className="gov-hero-emblem"
        />
        <h2 className="gov-hero-title" style={{ fontSize: '1.8rem', fontWeight: 600, opacity: 0.9, marginTop: '0.2rem', marginBottom: '1rem' }}>
          National Engineering Exam Portal
        </h2>
        <p className="gov-hero-subtitle">
          An official Digital India initiative mapping engineering academic disciplines to various Union Public Service commissions, state-level commissions, and Public Sector Undertakings (PSUs) recruitment examinations.
        </p>

        {/* Dashboard Statistics Grid */}
        <div className="gov-stats-grid">
          <div className="gov-stat-card">
            <span className="gov-stat-number">{branches.length}</span>
            <span className="gov-stat-label">Departments</span>
          </div>
          <div className="gov-stat-card">
            <span className="gov-stat-number">{totalUniqueExams}</span>
            <span className="gov-stat-label">PSU & Govt Exams</span>
          </div>
          <div className="gov-stat-card">
            <span className="gov-stat-number">{totalUniqueBodies}</span>
            <span className="gov-stat-label">Recruiting Bodies</span>
          </div>
        </div>
      </div>

      {/* Unified Department Dropdown Selector */}
      <div 
        className="glass-card" 
        style={{ 
          maxWidth: '600px', 
          margin: '0 auto 3rem auto', 
          padding: '2.5rem', 
          textAlign: 'center', 
          borderTop: '5px solid var(--saffron)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.08)'
        }}
      >
        <h3 style={{ color: 'var(--navy)', fontSize: '1.8rem', marginTop: 0, marginBottom: '0.8rem' }}>
          Select Engineering Department
        </h3>
        <p style={{ color: 'var(--text-color)', opacity: 0.8, fontSize: '1rem', marginBottom: '1.8rem', lineHeight: '1.5' }}>
          Choose a department from the options below to view its corresponding examinations{user?.role === 'ADMIN' && ', or select "All Departments" to view the combined list'}.
        </p>

        <div style={{ position: 'relative', width: '100%', maxWidth: '450px', margin: '0 auto' }}>
          <select
            onChange={(e) => {
              const val = e.target.value;
              if (val) {
                navigate(`/branches/${val}/exams`);
              }
            }}
            defaultValue=""
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              borderRadius: '8px',
              border: '2px solid rgba(0, 0, 128, 0.12)',
              fontSize: '1.1rem',
              background: 'white',
              cursor: 'pointer',
              color: 'var(--navy)',
              fontWeight: '600',
              outline: 'none',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23000080\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><polyline points=\'6 9 12 15 18 9\'></polyline></svg>")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1.5rem center',
              backgroundSize: '1.2rem'
            }}
          >
            <option value="" disabled>-- Select Department --</option>
            {user?.role === 'ADMIN' && <option value="all">All Departments (Admin Only)</option>}
            {branches.map(b => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.shortName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Official Gov Footer */}
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <a href="#policies" onClick={(e) => { e.preventDefault(); alert("National Portal Policies: This portal complies with the Guidelines for Indian Government Websites (GIGW)."); }} style={{ color: 'var(--navy)', fontWeight: '600' }}>Website Policies</a>
          <span>|</span>
          <a href="#help" onClick={(e) => { e.preventDefault(); alert("Helpdesk Email: support-examportal@nic.in\nPhone: 1800-11-4040"); }} style={{ color: 'var(--navy)', fontWeight: '600' }}>Helpdesk</a>
          <span>|</span>
          <a href="#feedback" onClick={(e) => { e.preventDefault(); alert("We value your feedback. Please send comments to feedback-portal@nic.in"); }} style={{ color: 'var(--navy)', fontWeight: '600' }}>Feedback</a>
          <span>|</span>
          <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms of Use: Content on this portal is managed by the Ministry of Education."); }} style={{ color: 'var(--navy)', fontWeight: '600' }}>Terms of Use</a>
        </div>
        <div className="gov-brand-container" style={{ justifyContent: 'center', marginBottom: '10px', opacity: 0.8 }}>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
            alt="Emblem of India" 
            style={{ height: '35px', filter: 'invert(0.1)' }}
          />
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>National Informatics Centre</span>
        </div>
        <p style={{ fontSize: '0.85rem', margin: '4px 0' }}>© 2026 National Engineering Exam Portal, Ministry of Education, Government of India.</p>
        <p style={{ fontSize: '0.78rem', color: '#666' }}>Developed and hosted by National Informatics Centre (NIC). Content owned and updated by Ministry of Education.</p>
      </footer>

    </div>
  );
}

export default Branches;
