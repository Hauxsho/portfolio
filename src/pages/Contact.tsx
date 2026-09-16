import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMetric } from '../context/MetricContext';
import './Contact.css';

export default function Contact() {
  const { unit } = useMetric();
  const [copied, setCopied] = useState(false);
  const email = 'shubhamsrivastavaa9@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="wrap">
      <section className="about-hero-section">
        <div className="about-breadcrumb mono">
          <Link to="/">Home</Link> / <span>Contact</span>
        </div>
        <h1 className="about-page-title">Get in Touch</h1>
        <p className="about-page-lead">
          Open to full-time senior backend engineering roles, distributed systems architecture. Feel free to reach out to discuss team requirements, system scale, or technical challenges.
        </p>
      </section>

      <section className="section-block">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Direct Communication Channels</h2>
          </div>
        </div>

        <div className="contact-grid">
          <div className="contact-primary-card">
            <div className="contact-card-top">
              <span className="contact-card-tag mono">PRIMARY CONTACT</span>
            </div>

            <h3 className="contact-email-val">{email}</h3>
            <p className="contact-card-desc">
              Direct inbox for technical inquiries, platform discussions, and full-time senior backend engineering opportunities.
            </p>

            <div className="contact-actions-row">
              <a href={`mailto:${email}`} className="hero-btn hero-btn-primary">
                Compose Email &rarr;
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="hero-btn hero-btn-secondary"
              >
                {copied ? 'Copied to Clipboard!' : 'Copy Email Address'}
              </button>
            </div>
          </div>

          <div className="contact-details-card">
            <div className="contact-detail-row">
              <span className="detail-k mono">LOCATION &middot; BASE</span>
              <span className="detail-v">Bengaluru, India (UTC+5:30)</span>
            </div>
            <div className="contact-detail-row">
              <span className="detail-k mono">WORK AUTHORIZATION</span>
              <span className="detail-v">India (Immediate) &middot; Open to UK/EU Remote</span>
            </div>
            <div className="contact-detail-row">
              <span className="detail-k mono">ROLE FOCUS</span>
              <span className="detail-v">SDE-2 / Senior Backend &middot; Distributed Systems</span>
            </div>
            <div className="contact-detail-row">
              <span className="detail-k mono">CORE STACK</span>
              <span className="detail-v">Java &middot; Spring Boot &middot; Postgres &middot; AWS</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Profiles &amp; Code Repositories</h2>
          </div>
        </div>

        <div className="profiles-grid">
          <a
            href="https://github.com/Hauxsho"
            target="_blank"
            rel="noreferrer"
            className="profile-link-card"
          >
            <div className="profile-card-head">
              <span className="profile-badge mono">CODE</span>
              <span className="profile-arrow">&rarr;</span>
            </div>
            <h3 className="profile-name">GitHub</h3>
            <p className="profile-handle mono">@Hauxsho</p>
            <p className="profile-desc">
              Open source distributed systems, Kintsugi transaction engine, and Java implementations.
            </p>
          </a>

          <a
            href="https://www.linkedin.com/in/shubhamsrivastavaa9/"
            target="_blank"
            rel="noreferrer"
            className="profile-link-card"
          >
            <div className="profile-card-head">
              <span className="profile-badge mono">NETWORK</span>
              <span className="profile-arrow">&rarr;</span>
            </div>
            <h3 className="profile-name">LinkedIn</h3>
            <p className="profile-handle mono">in/shubhamsrivastavaa9</p>
            <p className="profile-desc">
              Professional history, verified endorsements, and production platform recommendations.
            </p>
          </a>

          <a
            href={unit === 'INR' ? '/Shubham_Srivastava_Backend_Engineer.pdf' : '/Shubham_Srivastava_Backend_Engineer_Remote.pdf'}
            download={unit === 'INR' ? 'Shubham_Srivastava_Backend_Engineer.pdf' : 'Shubham_Srivastava_Backend_Engineer_Remote.pdf'}
            target="_blank"
            rel="noreferrer"
            className="profile-link-card"
          >
            <div className="profile-card-head">
              <span className="profile-badge mono">RESUME</span>
              <span className="profile-arrow">&darr;</span>
            </div>
            <h3 className="profile-name">Resume (PDF)</h3>
            <p className="profile-handle mono">
              {unit === 'INR' ? 'Shubham_Srivastava_Backend_Engineer.pdf' : 'Shubham_Srivastava_Backend_Engineer_Remote.pdf'}
            </p>
            <p className="profile-desc">
              Complete single-page printable PDF resume covering 4+ years of backend platform experience.
            </p>
          </a>
        </div>
      </section>
    </div>
  );
}
