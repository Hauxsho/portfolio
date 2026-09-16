import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import TopoField from './TopoField';
import { useMetric } from '../context/MetricContext';
import './Layout.css';

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { unit, setUnit } = useMetric();

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="site-wrapper">
      <TopoField opacity={0.6} speed={0.8} />
      <header className="site-header">
        <div className="header-container">
          <Link to="/" className="site-brand">
            <span className="brand-title">Shubham Srivastava</span>
            <span className="brand-role">/ Backend Engineer</span>
          </Link>

          <div className="header-right-nav">
            <nav className="site-nav">
              <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                Systems
              </Link>
              <Link
                to="/about"
                className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
              >
                Contact
              </Link>
            </nav>

            <div className="currency-toggle header-unit-toggle" aria-label="Select Metric System">
              <span className="currency-label">Metric:</span>
              <button
                type="button"
                className={`currency-btn ${unit === 'INR' ? 'active' : ''}`}
                onClick={() => setUnit('INR')}
                aria-pressed={unit === 'INR'}
                title="Indian numbering system (Crore / Lakh)"
              >
                Indian (Cr/L)
              </button>
              <button
                type="button"
                className={`currency-btn ${unit === 'USD' ? 'active' : ''}`}
                onClick={() => setUnit('USD')}
                aria-pressed={unit === 'USD'}
                title="International numbering system (USD / Thousands)"
              >
                International ($/K)
              </button>
            </div>

            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="main-viewport">{children}</main>

      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="footer-title">Shubham Srivastava</span>
            <span className="footer-sub">&middot; Distributed Systems &amp; Fintech</span>
          </div>

          <div className="footer-nav">
            <Link to="/">Systems</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-right">
            <span>&copy; {new Date().getFullYear()} &middot; Built for Scale</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
