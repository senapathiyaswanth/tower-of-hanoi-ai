import React, { useEffect, useRef, useState } from 'react';
import { useHanoi } from './hooks/useHanoi';
import { Board } from './components/Board';
import { ConceptHub } from './components/ConceptHub';
import { AlgorithmFlowchartTab } from './components/AlgorithmFlowchartTab';
import { PlayTab } from './components/PlayTab';

const GITHUB_URL = 'https://github.com/senapathiyaswanth/';

function GitHubIcon() {
  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      title="View on GitHub"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        border: '1px solid var(--panel-border)',
        background: 'rgba(255,255,255,0.04)',
        color: 'var(--text-secondary)',
        transition: 'all 0.25s ease',
        textDecoration: 'none',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(0,212,255,0.12)';
        e.currentTarget.style.borderColor = 'var(--electric-cyan)';
        e.currentTarget.style.color = 'var(--electric-cyan)';
        e.currentTarget.style.boxShadow = '0 0 12px rgba(0,212,255,0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
        e.currentTarget.style.borderColor = 'var(--panel-border)';
        e.currentTarget.style.color = 'var(--text-secondary)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-label="GitHub">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    </a>
  );
}

function App() {
  const hanoi = useHanoi();
  const logEndRef = useRef(null);
  const [diskInput, setDiskInput] = useState(String(hanoi.numDisks));
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('hanoi-theme') || 'dark';
  });
  const [activeTab, setActiveTab] = useState('concept');
  const [showFullLogs, setShowFullLogs] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hanoi-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hanoi.logs]);

  const handleDiskChange = (e) => {
    setDiskInput(e.target.value);
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 2 && val <= 8) {
      hanoi.setNumDisks(val);
    }
  };

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <div className="app-container">
      <div className="app-bg" aria-hidden="true" />

      {/* ── Header ── */}
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-title">
            <div className="app-title-badge" />
            <div>
              <h1 className="app-title-text">Artificial Intelligence</h1>
              <div className="app-title-subtext">Project</div>
            </div>
          </div>

          <div className="header-controls" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <nav className="nav-tabs">
              <button className={`tab-btn ${activeTab === 'concept' ? 'active' : ''}`} onClick={() => setActiveTab('concept')}>Learn Hub</button>
              <button className={`tab-btn ${activeTab === 'simulation' ? 'active' : ''}`} onClick={() => setActiveTab('simulation')}>Simulation</button>
              <button className={`tab-btn ${activeTab === 'play' ? 'active' : ''}`} onClick={() => setActiveTab('play')}>Play Hub</button>
              <button className={`tab-btn ${activeTab === 'algorithm' ? 'active' : ''}`} onClick={() => setActiveTab('algorithm')}>Algorithm &amp; Flowchart</button>
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <GitHubIcon />
              <label className="theme-switch" title="Toggle Theme">
                <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
                <span className="slider round" />
              </label>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="app-main">

        {/* Simulation Tab */}
        {activeTab === 'simulation' && (
          <div className="tab-content fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="top-card" style={{ padding: '0.75rem 1.5rem' }}>
              <h1 style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                background: 'linear-gradient(135deg, var(--electric-cyan), var(--neon-purple))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0,
              }}>
                Tower of Hanoi
              </h1>
            </div>

            <div className="board-section panel" style={{ padding: '0.75rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div className="controls-row" style={{ marginBottom: '1rem' }}>
                <div className="input-group">
                  <label>Disks:</label>
                  <input
                    type="number" min="2" max="8"
                    value={diskInput}
                    onChange={handleDiskChange}
                    disabled={hanoi.isSolving || hanoi.moveIndex > 0}
                  />
                </div>
                <div className="input-group">
                  <label>Speed:</label>
                  <select value={hanoi.speed} onChange={e => hanoi.setSpeed(parseInt(e.target.value))}>
                    <option value="800">Slow</option>
                    <option value="500">Medium</option>
                    <option value="150">Fast</option>
                  </select>
                </div>
              </div>

              <div className="btn-group" style={{ marginBottom: '1rem' }}>
                {(!hanoi.isSolving || hanoi.isPaused) ? (
                  <button className="btn icon-btn primary" onClick={hanoi.isPaused ? hanoi.resume : hanoi.start} disabled={hanoi.moveIndex >= hanoi.totalMoves && hanoi.totalMoves > 0} title="Play">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  </button>
                ) : (
                  <button className="btn icon-btn warning" onClick={hanoi.pause} title="Pause">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                  </button>
                )}
                <button className="btn icon-btn outline" onClick={hanoi.step} disabled={(hanoi.isSolving && !hanoi.isPaused) || (hanoi.moveIndex >= hanoi.totalMoves && hanoi.totalMoves > 0)} title="Step Forward">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" /></svg>
                </button>
                <button className="btn icon-btn reset" onClick={hanoi.reset} title="Reset">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><polyline points="3 3 3 8 8 8" /></svg>
                </button>
              </div>

              <Board rods={hanoi.rods} numDisks={hanoi.numDisks} transitionSpeed={hanoi.speed} />
            </div>

            <div className="status-section" style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) minmax(300px, 2fr)', gap: '1.5rem', alignItems: 'start' }}>
              <aside className="panel progress-panel" style={{ padding: '0.75rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, border: 'none', padding: 0, fontSize: '0.9rem' }}>Live Progress</h3>
                  <div style={{ color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    STEPS: {hanoi.moveIndex} / {hanoi.totalMoves}
                  </div>
                </div>
                <div className="progress-bar-bg" style={{ height: '6px', background: 'rgba(0,0,0,0.4)', marginBottom: 0 }}>
                  <div className="progress-bar-fill" style={{ width: `${(hanoi.moveIndex / hanoi.totalMoves) * 100 || 0}%` }} />
                </div>
              </aside>

              <aside className="panel log-panel" style={{ padding: '0.5rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <h3 style={{ margin: 0, border: 'none', padding: 0, fontSize: '0.9rem' }}>Move Terminal</h3>
                  <button
                    className="btn icon-btn"
                    style={{ width: '28px', height: '28px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--panel-border)', padding: 0, borderRadius: '6px' }}
                    onClick={() => setShowFullLogs(!showFullLogs)}
                    title="Toggle Full Logs"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                  </button>
                </div>
                <div className="terminal-body" style={{ padding: 0, background: 'transparent', border: 'none' }}>
                  {hanoi.logs.slice(-2).map((log, i, arr) => {
                    const isLatest = i === arr.length - 1;
                    return (
                      <div key={log.step} className={`log-line ${isLatest ? 'new-move' : ''}`} style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', padding: '0.25rem 0.5rem', background: isLatest ? 'var(--highlight-bg)' : 'transparent', color: isLatest ? 'var(--text-color)' : 'var(--text-secondary)', borderLeft: isLatest ? '2px solid var(--text-color)' : '2px solid transparent', borderRadius: '4px' }}>
                        #{log.step} {log.text.replace('→', '→')}
                      </div>
                    );
                  })}
                </div>
              </aside>
            </div>
          </div>
        )}

        {activeTab === 'concept' && <ConceptHub />}
        {activeTab === 'algorithm' && <AlgorithmFlowchartTab numDisks={hanoi.numDisks} rods={hanoi.rods} />}
        {activeTab === 'play' && <PlayTab />}

        {/* Full Log Modal */}
        {showFullLogs && (
          <div className="modal-overlay" onClick={() => setShowFullLogs(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Complete Move History</h3>
                <button className="modal-close" onClick={() => setShowFullLogs(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="modal-body terminal-body" style={{ maxHeight: 'none', background: 'transparent', padding: '1rem' }}>
                {hanoi.logs.map((log, i) => {
                  const isLatest = i === hanoi.logs.length - 1;
                  return (
                    <div key={log.step} className={`log-line ${isLatest ? 'new-move' : ''}`} style={{ fontFamily: 'var(--mono)', padding: '0.4rem 0.75rem', background: isLatest ? 'var(--highlight-bg)' : 'transparent', color: isLatest ? 'var(--text-color)' : 'var(--text-secondary)', borderLeft: isLatest ? '2px solid var(--text-color)' : '2px solid transparent', borderRadius: '4px' }}>
                      #{log.step} {log.text.replace('→', '→')}
                    </div>
                  );
                })}
                <div ref={logEndRef} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="app-footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <span>Developed by SENAPATHI YASWANTH (RA17)</span>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Profile"
            style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-secondary)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--electric-cyan)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-label="GitHub">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
