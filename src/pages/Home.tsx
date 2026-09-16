import { useState } from 'react';
import { projects, type Project } from '../data/projects';
import ArchitectureModal from '../components/ArchitectureModal';
import ArchitecturalBanner from '../components/ArchitecturalBanner';
import { useMetric } from '../context/MetricContext';
import './Home.css';

const STAT_ICONS: Record<string, string> = {
  throughput:       '⚡',
  'monthly volume': '💰',
  turnaround:       '⏱',
  volume:           '📄',
  security:         '🔐',
  'rendering speed':'🚀',
  execution:        '⚙️',
  'vendor network': '🌐',
  'branch reach':   '🏢',
  automation:       '🤖',
  lifecycle:        '🔄',
  engine:           '🛠',
  impact:           '📈',
};

export default function Home() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const { unit, metric } = useMetric();

  return (
    <div className="wrap">
      <ArchitecturalBanner />

      <section className="modern-hero">
        <h2 className="hero-title">
          Engineering high-throughput, <br></br> fault-tolerant backend platforms that move money reliably.
        </h2>

        <p className="hero-desc">
          <br></br>
          Software Engineer with nearly 4 years of fintech experience building distributed systems in{' '}
          <strong>Java</strong>, <strong>Spring Boot</strong>, <strong>PostgreSQL</strong>, and{' '}
          <strong>AWS</strong>. Shipped platforms powering{' '}
          <strong>{metric.disbursementMonthly}</strong> in disbursements and{' '}
          <strong>{metric.ckycThroughput}</strong> in compliance automation, alongside dynamic document generation engines and durable state-machine retry workflows. Building with modern AI and agentic engineering workflows daily.
        </p>

        <div className="hero-actions-row">
          <div className="hero-actions-left">
            <a
              href="mailto:shubhamsrivastavaa9@gmail.com"
              className="hero-btn hero-btn-primary"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              shubhamsrivastavaa9@gmail.com
            </a>
            <a
              href={`${import.meta.env.BASE_URL}${unit === 'INR' ? 'Shubham_Srivastava_Backend_Engineer.pdf' : 'Shubham_Srivastava_Backend_Engineer_Remote.pdf'}`}
              download={unit === 'INR' ? 'Shubham_Srivastava_Backend_Engineer.pdf' : 'Shubham_Srivastava_Backend_Engineer_Remote.pdf'}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn hero-btn-secondary"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Resume (PDF)
            </a>
            <a
              href="https://github.com/Hauxsho/"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn hero-btn-secondary"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/shubhamsrivastavaa9/"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn hero-btn-secondary"
            >
              LinkedIn
            </a>
            <span className="hero-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Bengaluru, India
            </span>
          </div>

          <div className="hero-actions-right">
            <div className="hero-status-chip">
              <span className="chip-pulse" aria-hidden="true" />
              <span>Open to UK/EU &amp; Remote Roles</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Production Systems &amp; Architectures</h2>
          </div>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <article
              key={project.id}
              className="modern-project-card"
              onClick={() => setActiveProject(project)}
            >
              <h3 className="card-title">{project.title}</h3>

              <p className="card-problem">
                {(unit === 'INR' ? project.taglineInr : project.taglineUsd) || project.tagline}
              </p>

              <div className="card-stats-row">
                {project.figures.slice(0, 2).map((fig, i) => (
                  <div key={i} className="card-stat-pill">
                    <span className="stat-icon" aria-hidden="true">
                      {STAT_ICONS[fig.label] ?? '📊'}
                    </span>
                    <div className="stat-body">
                      <span className="stat-label">{fig.label}</span>
                      <span className="stat-value">
                        {unit === 'INR' ? fig.valueInr : fig.valueUsd}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card-footer">
                <div className="card-stack-chips">
                  {project.stack.slice(0, 4).map((tech, idx) => (
                    <span key={idx} className="tech-chip mono">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="card-inspect-link mono">
                  <span>Inspect Architecture &rarr;</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {activeProject && (
        <ArchitectureModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </div>
  );
}
