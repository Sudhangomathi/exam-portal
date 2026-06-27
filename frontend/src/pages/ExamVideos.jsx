import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const fitnessPlaylist = [
  {
    id: 'hN3C4FK8jUo',
    listId: 'PLj8J2i5hdT4M-JOvHlIBjvXna8EuXEt_h',
    title: 'Mental Fitness & Sports Psychology',
    description: 'Understand the fundamentals of mental fitness and sports psychology, crucial for high-pressure military and physical test environments.',
    thumbnail: 'https://img.youtube.com/vi/hN3C4FK8jUo/mqdefault.jpg'
  },
  {
    id: 'AJgXVeaNZDY',
    listId: 'PLj8J2i5hdT4PjMzpuHP9VTLGJu1vb2vm2',
    title: 'Under Armour Hovr Sonic Shoe Review',
    description: 'Expert review of the Under Armour Hovr Sonic running shoes to help you choose the right gear for your physical training.',
    thumbnail: 'https://img.youtube.com/vi/AJgXVeaNZDY/mqdefault.jpg'
  },
  {
    id: 'qNDxquM1wUI',
    listId: 'PLj8J2i5hdT4Ox_fwX-n9qpg207xBqLY38',
    title: 'The Complete Guide to Hill Workouts',
    description: 'Learn how to build power, speed, and endurance using structured hill running workouts.',
    thumbnail: 'https://img.youtube.com/vi/qNDxquM1wUI/mqdefault.jpg'
  },
  {
    id: 'Zb5MyNZ3IHI',
    listId: 'PLj8J2i5hdT4PMwC8HLYOSM_gZ-bgqKPJ6',
    title: 'Circuit Workout for Runners',
    description: 'A full circuit training routine designed specifically for runners to strengthen key muscles and prevent injuries.',
    thumbnail: 'https://img.youtube.com/vi/Zb5MyNZ3IHI/mqdefault.jpg'
  },
  {
    id: 'cx-_D6PzLzM',
    listId: 'PLj8J2i5hdT4PwXrN_8WOlTZaJ02oalsvJ',
    title: 'How to Stock Your Home Gym',
    description: 'Budget-friendly guide to setting up an effective home workout space for under $102.',
    thumbnail: 'https://img.youtube.com/vi/cx-_D6PzLzM/mqdefault.jpg'
  },
  {
    id: 'Xx-a8AkE8Xg',
    listId: 'PLj8J2i5hdT4MCsD4GTWS87-58Huw9iF_a',
    title: 'Running Form Analysis (Slow Motion)',
    description: 'Visual breakdown of professional running forms in slow motion to help improve your stride efficiency.',
    thumbnail: 'https://img.youtube.com/vi/Xx-a8AkE8Xg/mqdefault.jpg'
  },
  {
    id: 'qkdhokdi284',
    listId: 'PLj8J2i5hdT4OGBHAnGsot4KQc1dOB5K-U',
    title: '3 Easy Plyometrics for Runners',
    description: 'Simple plyometric exercises that enhance explosive power while minimizing injury risks for technical physical tests.',
    thumbnail: 'https://img.youtube.com/vi/qkdhokdi284/mqdefault.jpg'
  }
];

const studyMaterialData = {
  general: [
    {
      title: "Quantitative Aptitude Study Notes",
      icon: "🔢",
      topics: [
        { name: "Time, Speed & Distance", details: "Speed = Distance / Time. Average Speed = 2xy/(x+y) when traveling equal distances at speeds x and y. Relative speed of two bodies moving in opposite directions is the sum of their individual speeds (x+y)." },
        { name: "Percentages & Profit/Loss", details: "Profit % = (Profit/CP) * 100. Markup % = (Markup/CP) * 100. Selling Price = CP * (100 + Profit%)/100. If two articles are sold at same price (one at profit x% and other at loss x%), there is a net loss of (x/10) percent." },
        { name: "Ratio, Proportion & Mixture", details: "If a:b = c:d, then ad = bc. Mixture Rule: (Quantity of Cheaper / Quantity of Dearer) = (CP of Dearer - Mean Price) / (Mean Price - CP of Cheaper)." }
      ]
    },
    {
      title: "Reasoning & Logical Ability",
      icon: "🧠",
      topics: [
        { name: "Syllogisms & Logic", details: "Use Venn Diagrams to check validity. 'All A are B' means A is a subset of B. 'Some A are B' means intersection is non-empty. Keep track of negative statements like 'No A is B'." },
        { name: "Coding-Decoding Formulas", details: "Reverse letter positions (A=26, Z=1) and alphabet offsets. The EJOTY series (5, 10, 15, 20, 25) helps calculate letter indexes quickly in exam conditions." },
        { name: "Blood Relations Diagrams", details: "Draw a family tree. Use squares for males, circles for females, double lines for spouses, and vertical lines to connect generations." }
      ]
    }
  ],
  CSE: [
    {
      title: "Data Structures & Algorithms",
      icon: "💻",
      topics: [
        { name: "Asymptotic Complexity Analysis", details: "Growth order: O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n). Binary Search: O(log n) worst case. QuickSort/MergeSort: O(n log n) average. Space complexity tracks memory stack frames." },
        { name: "Trees & Traversals Guide", details: "Inorder (Left-Root-Right) of a Binary Search Tree (BST) outputs keys in sorted order. Preorder (Root-Left-Right) is used for copying trees. Postorder (Left-Right-Root) is used for tree deletion." },
        { name: "Graph Algorithms (Shortest Path/MST)", details: "Dijkstra's Single Source Shortest Path: O(V^2) or O(E log V) with min-heap. Kruskal's MST using Union-Find: O(E log E) or O(E log V)." }
      ]
    },
    {
      title: "Databases & Operating Systems",
      icon: "🗄️",
      topics: [
        { name: "SQL Normalization & BCFN", details: "1NF: Atomic values. 2NF: No partial dependency. 3NF: No transitive dependency. BCFN: For every FD X -> Y, X must be a super key." },
        { name: "Process Synchronization & Semaphores", details: "Critical Section requirements: Mutual Exclusion, Progress, Bounded Waiting. Semaphores: wait() decreases, signal() increases. Deadlocks occur when Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait are met." }
      ]
    }
  ],
  ME: [
    {
      title: "Applied Thermodynamics",
      icon: "🔥",
      topics: [
        { name: "Laws of Thermodynamics Notes", details: "Zeroth Law: Thermal equilibrium. First Law: dQ = dU + dW. Second Law: Entropy increases (Clausius & Kelvin-Planck statements). Third Law: Entropy of pure crystal approaches zero at absolute temperature." },
        { name: "Standard Power Cycles", details: "Otto Cycle: Constant volume heat addition. Diesel Cycle: Constant pressure heat addition. Carnot Cycle: Maximum theoretical efficiency = 1 - T_cold/T_hot." }
      ]
    },
    {
      title: "Fluid Mechanics & Machine Design",
      icon: "⚙️",
      topics: [
        { name: "Bernoulli's Equation & Flow", details: "P + 1/2 rho v^2 + rho g h = Constant. Applies to steady, incompressible, frictionless, irrotational fluid flows along a streamline." },
        { name: "Strength of Materials Formulas", details: "Stress = Force/Area. Hooke's Law: Stress = E * Strain (within elastic limit). Bending Equation: M/I = sigma/y = E/R." }
      ]
    }
  ],
  CE: [
    {
      title: "Structural Engineering",
      icon: "🏗️",
      topics: [
        { name: "RCC Design Guidelines", details: "Design compressive strength of concrete = 0.67 f_ck / 1.5 = 0.446 f_ck. Max strain in bending = 0.0035. Limit state design balances safety and serviceability." },
        { name: "Shear Stress & Deflection", details: "Bending Equation: M/I = sigma/y = E/R. Shear stress distribution in rectangular beam is parabolic with max shear stress at the neutral axis." }
      ]
    },
    {
      title: "Geotechnical & Surveying",
      icon: "🗺️",
      topics: [
        { name: "Soil Index Properties", details: "Void Ratio (e) = V_v / V_s. Porosity (n) = V_v / V. Relation: e = n / (1 - n). Darcy's Law: v = k * i (velocity proportional to hydraulic gradient)." },
        { name: "Principles of Surveying", details: "1. Work from whole to part (prevents accumulation of errors). 2. Locate a point by at least two independent measurements." }
      ]
    }
  ],
  EEE: [
    {
      title: "Electromagnetics & Network Analysis",
      icon: "⚡",
      topics: [
        { name: "Network Theorems Cheat Sheet", details: "Thevenin's: Replace with V_th and R_th in series. Norton's: Replace with I_n and R_n in parallel. Superposition: Turn off independent sources (short voltage, open current)." },
        { name: "Maxwell's Equations Summary", details: "1. Gauss's Law: div D = rho. 2. Gauss's Magnetism: div B = 0. 3. Faraday's Law: curl E = -dB/dt. 4. Ampere-Maxwell: curl H = J + dD/dt." }
      ]
    }
  ],
  ECE: [
    {
      title: "Signals, Systems & Electronics",
      icon: "📡",
      topics: [
        { name: "Fourier Transform & LTI Systems", details: "Converts time domain signal x(t) to frequency domain X(f). Convolution in time domain equals multiplication in frequency domain." },
        { name: "OP-AMP & Transistor Circuits", details: "Ideal OP-AMP: Infinite input impedance, zero output impedance, infinite open-loop gain. Virtual short concept: V_plus = V_minus." }
      ]
    }
  ]
};

function ExamVideos({ user }) {
  const { branchId, examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('syllabus');
  const [selectedVideo, setSelectedVideo] = useState(fitnessPlaylist[0]);
  const [activeTopicDetail, setActiveTopicDetail] = useState(null);

  useEffect(() => {
    if (branchId === 'all' && user?.role !== 'ADMIN') {
      alert("Access Denied: Only administrators can view consolidated data.");
      navigate('/branches');
      return;
    }

    const fetchDetails = async () => {
      try {
        let foundExam = null;
        if (branchId === 'all') {
          const response = await axios.get('/api/branches');
          for (const b of response.data) {
            if (b.exams) {
              const matched = b.exams.find(e => e.id.toString() === examId);
              if (matched) {
                foundExam = matched;
                break;
              }
            }
          }
        } else {
          const response = await axios.get(`/api/branches/${branchId}`);
          if (response.data.exams) {
            foundExam = response.data.exams.find(e => e.id.toString() === examId);
          }
        }
        setExam(foundExam);
      } catch (error) {
        console.error("Error fetching details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [branchId, examId]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '1.2rem', fontWeight: 'bold' }}>Loading Prep Folder...</div>;
  if (!exam) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Exam details not found.</div>;

  const isDefence = exam.category.toLowerCase() === 'defence';

  // Get department specific study notes
  let deptKey = 'general';
  if (branchId && branchId !== 'all') {
    // Map database shortNames if applicable
    // We can infer the key based on target exams or simple mapping
    const match = branchId.toString();
    if (match === '1') deptKey = 'CSE';
    else if (match === '2') deptKey = 'ME';
    else if (match === '3') deptKey = 'CE';
    else if (match === '4') deptKey = 'EEE';
    else if (match === '5') deptKey = 'ECE';
  }

  const deptMaterials = studyMaterialData[deptKey] || [];
  const generalMaterials = studyMaterialData['general'];
  const allPrepMaterials = [...deptMaterials, ...generalMaterials];

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate(`/branches/${branchId}/exams`)}
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
          gap: '0.5rem',
          outline: 'none'
        }}
      >
        ← Back to Exams
      </button>

      {/* Title Header */}
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ 
          backgroundColor: isDefence ? '#ffe8d6' : '#e6f7ff', 
          color: isDefence ? 'var(--saffron)' : '#0050b3', 
          padding: '0.3rem 0.8rem', 
          borderRadius: '12px', 
          fontSize: '0.85rem', 
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {exam.category} Exam Portal
        </span>
        <h2 style={{ color: 'var(--navy)', fontSize: '2.5rem', marginTop: '0.6rem', marginBottom: '0.5rem' }}>
          {exam.name} Preparation Folder
        </h2>
        <p style={{ color: '#555', fontSize: '1.1rem', margin: 0 }}>
          Manage your syllabus, view structured study material guides, and access physical preparation files for the exam.
        </p>
      </div>

      {/* Folder Tab List */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '3px solid var(--navy)', 
        gap: '0.5rem',
        marginBottom: '2rem',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setActiveTab('syllabus')}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            border: '2px solid rgba(0, 0, 128, 0.15)',
            borderBottom: activeTab === 'syllabus' ? '3px solid white' : 'none',
            borderRadius: '12px 12px 0 0',
            backgroundColor: activeTab === 'syllabus' ? 'white' : '#f5f5f7',
            color: activeTab === 'syllabus' ? 'var(--navy)' : '#555',
            outline: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            position: 'relative',
            top: '3px',
            zIndex: activeTab === 'syllabus' ? 2 : 1,
            transition: 'all 0.2s ease'
          }}
        >
          📁 Syllabus & Info
        </button>

        <button
          onClick={() => setActiveTab('material')}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            border: '2px solid rgba(0, 0, 128, 0.15)',
            borderBottom: activeTab === 'material' ? '3px solid white' : 'none',
            borderRadius: '12px 12px 0 0',
            backgroundColor: activeTab === 'material' ? 'white' : '#f5f5f7',
            color: activeTab === 'material' ? 'var(--navy)' : '#555',
            outline: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            position: 'relative',
            top: '3px',
            zIndex: activeTab === 'material' ? 2 : 1,
            transition: 'all 0.2s ease'
          }}
        >
          📄 Study Material
        </button>

        {isDefence && (
          <button
            onClick={() => setActiveTab('fitness')}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              border: '2px solid rgba(0, 0, 128, 0.15)',
              borderBottom: activeTab === 'fitness' ? '3px solid white' : 'none',
              borderRadius: '12px 12px 0 0',
              backgroundColor: activeTab === 'fitness' ? 'white' : '#f5f5f7',
              color: activeTab === 'fitness' ? 'var(--navy)' : '#555',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              position: 'relative',
              top: '3px',
              zIndex: activeTab === 'fitness' ? 2 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            🏋️ Fitness Videos
          </button>
        )}
      </div>

      {/* Folder Content Panel */}
      <div className="glass-card" style={{ padding: '2.5rem', minHeight: '400px', boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)' }}>
        
        {/* Tab 1: Syllabus */}
        {activeTab === 'syllabus' && (
          <div>
            <h3 style={{ color: 'var(--navy)', fontSize: '1.8rem', marginTop: 0, marginBottom: '1.5rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.5rem' }}>
              Exam Overview & Detailed Syllabus
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
              <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e9ecef' }}>
                <strong style={{ color: 'var(--navy)', display: 'block', marginBottom: '0.5rem' }}>Conducting Authority</strong>
                <span>{exam.conductingBody}</span>
              </div>
              <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e9ecef' }}>
                <strong style={{ color: 'var(--navy)', display: 'block', marginBottom: '0.5rem' }}>Exam Category</strong>
                <span>{exam.category}</span>
              </div>
              <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e9ecef' }}>
                <strong style={{ color: 'var(--navy)', display: 'block', marginBottom: '0.5rem' }}>Objective/Purpose</strong>
                <span>{exam.purpose}</span>
              </div>
            </div>

            <h4 style={{ color: 'var(--navy)', fontSize: '1.3rem', marginBottom: '1rem' }}>General Syllabus Outline</h4>
            <ul style={{ lineHeight: '1.8', color: '#444', paddingLeft: '1.5rem', fontSize: '1.05rem' }}>
              <li><strong>Section A: General Aptitude & Reasoning</strong> - Numerical Ability, Verbal Ability, Spatial Aptitude, and Logical Reasoning.</li>
              <li><strong>Section B: Engineering Mathematics</strong> - Linear Algebra, Calculus, Differential Equations, Probability, and Statistics.</li>
              <li><strong>Section C: Core Technical Subjects</strong> - Specialized academic questions based on selected engineering stream.</li>
              {isDefence && <li><strong>Section D: Physical Standards</strong> - Mandatory physical efficiency test (running, long jump, chin-ups) matching Defence guidelines.</li>}
            </ul>
          </div>
        )}

        {/* Tab 2: Study Material */}
        {activeTab === 'material' && (
          <div>
            <h3 style={{ color: 'var(--navy)', fontSize: '1.8rem', marginTop: 0, marginBottom: '1.5rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.5rem' }}>
              Structured Technical Study Notes
            </h3>

            {/* Interactive Notes Section */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              
              {/* Left Side: Topic Cards */}
              <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <p style={{ color: '#666', fontSize: '1rem', margin: 0 }}>
                  Select a topic below to open and study the details, key formulas, and concepts compiled by the AI portal.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
                  {allPrepMaterials.map((section, index) => {
                    const headingColors = [
                      '#1a365d', // Deep Blue
                      '#2b6cb0', // Vibrant Blue
                      '#2c7a7b', // Dark Teal
                      '#2f855a', // Forest Green
                      '#b7791f', // Dark Saffron/Gold
                      '#742a2a', // Deep Red/Maroon
                      '#6b46c1', // Royal Purple
                      '#9c4221'  // Dark Orange/Rust
                    ];
                    const headingColor = headingColors[index % headingColors.length];

                    return (
                      <div 
                        key={section.title}
                        style={{
                          background: '#f8f9fa',
                          border: '1px solid #e9ecef',
                          borderRadius: '12px',
                          padding: '1.2rem',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                          <span style={{ fontSize: '1.5rem' }}>{section.icon}</span>
                          <h4 style={{ color: headingColor, margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>{section.title}</h4>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          {section.topics.map((topic) => (
                            <button
                              key={topic.name}
                              onClick={() => setActiveTopicDetail(topic)}
                              style={{
                                textAlign: 'left',
                                background: activeTopicDetail?.name === topic.name ? 'var(--navy)' : 'white',
                                color: activeTopicDetail?.name === topic.name ? 'white' : 'var(--navy)',
                                border: '1px solid rgba(0, 0, 128, 0.1)',
                                padding: '0.6rem 1rem',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                outline: 'none'
                              }}
                            >
                              📖 {topic.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Topic Content Viewer */}
              <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{
                  background: 'white',
                  border: '2px solid rgba(0,0,128,0.08)',
                  borderRadius: '16px',
                  padding: '2rem',
                  minHeight: '280px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: activeTopicDetail ? 'flex-start' : 'center',
                  alignItems: activeTopicDetail ? 'stretch' : 'center',
                  textAlign: activeTopicDetail ? 'left' : 'center',
                  backgroundColor: activeTopicDetail ? '#fff' : '#fafafa'
                }}>
                  {activeTopicDetail ? (
                    <div>
                      <span style={{ 
                        backgroundColor: '#ffe8d6', 
                        color: 'var(--saffron)', 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '6px', 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        Key Revision Notes
                      </span>
                      <h4 style={{ color: 'var(--navy)', fontSize: '1.4rem', marginTop: '0.8rem', marginBottom: '1rem' }}>
                        {activeTopicDetail.name}
                      </h4>
                      <p style={{ color: 'var(--text-color)', lineHeight: '1.7', fontSize: '1.05rem', margin: 0 }}>
                        {activeTopicDetail.details}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📖</span>
                      <h4 style={{ color: '#888', margin: 0 }}>Select a revision topic to display notes here.</h4>
                    </div>
                  )}
                </div>

                {/* PDF Download Action Banner */}
                <div style={{ 
                  background: 'linear-gradient(135deg, #1e293b, #0f172a)', 
                  color: 'white', 
                  padding: '1.5rem', 
                  borderRadius: '16px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
                }}>
                  <h4 style={{ 
                    margin: '0 0 0.5rem 0', 
                    fontSize: '1.1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    color: 'white',
                    textShadow: 'none'
                  }}>
                    <span>📄</span> Official Study Syllabus PDF
                  </h4>
                  <p style={{ margin: '0 0 1.2rem 0', fontSize: '0.85rem', opacity: 0.8, lineHeight: '1.4' }}>
                    Download the comprehensive official NIC manual and past paper index.
                  </p>
                  <div style={{ display: 'flex', gap: '0.8rem' }}>
                    <a 
                      href="/study-material.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        backgroundColor: 'var(--saffron)',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '0.6rem',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e67e22';
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 153, 51, 0.8)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--saffron)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      View
                    </a>
                    <a 
                      href="/study-material.pdf" 
                      download
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '0.6rem',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        border: '1px solid rgba(255,255,255,0.4)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                        e.currentTarget.style.color = '#0f172a';
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.8)';
                        e.currentTarget.style.borderColor = 'white';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: Fitness Videos */}
        {activeTab === 'fitness' && isDefence && (
          <div>
            <h3 style={{ color: 'var(--navy)', fontSize: '1.8rem', marginTop: 0, marginBottom: '1.5rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '0.5rem' }}>
              Physical Fitness & Conditioning Playlist
            </h3>

            {/* Video Player & Playlist Layout */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              
              {/* Left Side: Large Player */}
              <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '56.25%', /* 16:9 Aspect Ratio */
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
                  backgroundColor: '#000'
                }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.id}?list=${selectedVideo.listId}&rel=0&autoplay=1`}
                    title={selectedVideo.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
                
                <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px', border: '1px solid #eee' }}>
                  <h4 style={{ color: 'var(--navy)', fontSize: '1.4rem', marginTop: 0, marginBottom: '0.8rem' }}>
                    {selectedVideo.title}
                  </h4>
                  <p style={{ color: '#555', lineHeight: '1.6', fontSize: '1rem', margin: 0 }}>
                    {selectedVideo.description}
                  </p>
                </div>
              </div>

              {/* Right Side: Sidebar Playlist */}
              <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ color: 'var(--navy)', fontSize: '1.2rem', marginTop: 0, marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Video Playlist
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '5px' }}>
                  {fitnessPlaylist.map((video, idx) => {
                    const isActive = video.id === selectedVideo.id;
                    return (
                      <div 
                        key={video.id} 
                        onClick={() => setSelectedVideo(video)}
                        style={{
                          display: 'flex',
                          gap: '1rem',
                          background: isActive ? 'rgba(0, 0, 128, 0.05)' : 'white',
                          border: isActive ? '2px solid var(--saffron)' : '2px solid rgba(0, 0, 128, 0.05)',
                          borderRadius: '12px',
                          padding: '0.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: isActive ? '0 4px 12px rgba(255, 153, 51, 0.15)' : '0 2px 6px rgba(0,0,0,0.02)'
                        }}
                        onMouseOver={(e) => {
                          if (!isActive) e.currentTarget.style.borderColor = 'rgba(0, 0, 128, 0.2)';
                        }}
                        onMouseOut={(e) => {
                          if (!isActive) e.currentTarget.style.borderColor = 'rgba(0, 0, 128, 0.05)';
                        }}
                      >
                        <div style={{ position: 'relative', width: '100px', height: '60px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden' }}>
                          <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{
                            position: 'absolute',
                            bottom: '2px',
                            right: '2px',
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            color: 'white',
                            fontSize: '0.65rem',
                            padding: '2px 4px',
                            borderRadius: '4px',
                            fontWeight: 'bold'
                          }}>
                            Video {idx + 1}
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <span style={{ 
                            color: 'var(--navy)', 
                            fontWeight: 'bold', 
                            fontSize: '0.9rem',
                            lineHeight: '1.3',
                            marginBottom: '4px'
                          }}>
                            {video.title}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ExamVideos;
