import { Link } from 'react-router-dom';
import { useMetric } from '../context/MetricContext';
import './About.css';

export default function About() {
  const { metric } = useMetric();

  return (
    <div className="wrap">
      <section className="about-hero-section">
        <div className="about-breadcrumb mono">
          <Link to="/">Home</Link> / <span>About</span>
        </div>
        <h1 className="about-page-title">About Shubham Srivastava</h1>
        <p className="about-page-lead">
          Backend Software Engineer specializing in distributed systems, financial transaction reliability, and high-throughput batch pipelines.
        </p>
      </section>

      <section className="section-block">
        <div className="about-grid">
          <div className="about-bio-col">
            <h2 className="section-title">Engineering, end to end</h2>
            <p>
              I design and operate production backend platforms where transactional consistency, system boundaries, and operational scale meet. Across 4 years at <strong>Protium Finance</strong>, I owned the path from system design and API contracts through implementation, failure testing, and production operations.
            </p>
            <p>
              My work centers on the mission-critical layers of financial engineering: automated compliance verification engines handling {metric.ckycRecords}, multi-lending disbursement state machines executing {metric.disbursementMonthly}, and durable workflow engines that guarantee zero double-disbursement risk.
            </p>
            <p>
              I treat modern AI and agentic tools as an indispensable daily multiplier—leveraging LLM-driven workflows for rapid architectural prototyping, comprehensive test generation, and stress-testing distributed systems.
            </p>
          </div>

          <div className="about-summary-card">
            <div className="summary-card-head">
              <span className="summary-card-tag mono">EXECUTIVE SPEC</span>
              <h3 className="summary-card-title">Engineering Summary</h3>
            </div>
            <div className="summary-card-rows">
              <div className="summary-row">
                <span className="row-k mono">EXPERIENCE</span>
                <span className="row-v">4+ Years</span>
              </div>
              <div className="summary-row">
                <span className="row-k mono">PRODUCTION SCALE</span>
                <span className="row-v">{metric.disbursementMonthlyShort} &middot; {metric.ckycThroughputShort}</span>
              </div>
              <div className="summary-row">
                <span className="row-k mono">CORE FOCUS</span>
                <span className="row-v">Distributed Systems &middot; Fintech Core</span>
              </div>
              <div className="summary-row">
                <span className="row-k mono">AI &amp; TOOLING</span>
                <span className="row-v">Agentic Workflows &middot; Daily Practitioner</span>
              </div>
              <div className="summary-row">
                <span className="row-k mono">LOCATION</span>
                <span className="row-v">Bengaluru (Open to UK/EU &amp; Remote)</span>
              </div>
              <div className="summary-row">
                <span className="row-k mono">CORE STACK</span>
                <span className="row-v">Java &middot; Spring Boot &middot; Postgres &middot; AWS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Work Experience &amp; Engineering Roles</h2>
          </div>
        </div>

        <div className="modern-timeline">
          <div className="timeline-card">
            <div className="timeline-meta mono">2022 &middot; 2026</div>
            <h3 className="timeline-title">Protium Finance &middot; Backend Software Engineer</h3>
            <p className="timeline-role-desc">
              Owned core lending and compliance infrastructure in Java, Spring Boot, Spring Batch, PostgreSQL, and AWS:
            </p>
            <ul className="timeline-bullets">
              <li>
                <strong>CKYC Compliance Automation:</strong> Designed distributed batch engine with AWS SQS chunk partitioning, processing {metric.ckycRecords} and directly driving revenue generation within year 1.
              </li>
              <li>
                <strong>Loan Disbursement Engine:</strong> Built end-to-end multi-product disbursal state machines handling {metric.disbursementMonthly} with optimistic locking and zero double-disbursements.
              </li>
              <li>
                <strong>Automated Document Generation Engine:</strong> Architected dynamic contract and document generation platform with template-driven PDF rendering, digital signatures, and asynchronous AWS S3 archival, generating {metric.docGenMonthly} with sub-second latency.
              </li>
              <li>
                <strong>Collateral Valuation Platform:</strong> Architected dual-portal asynchronous workflow engine with AWS SNS/SQS, slashing property inspection turnaround from {metric.collateralTurnaroundText} across 450+ vendor agencies.
              </li>
            </ul>
          </div>

          <div className="timeline-card">
            <h3 className="timeline-title">Kintsugi &middot; Creator &amp; Distributed Systems Architect</h3>
            <p className="timeline-role-desc">
              Architected an open-source payment transaction recovery engine in Java 21, Spring Boot 3.3, and Temporal durable workflows to recover revenue lost to involuntary churn from failed recurring payments, through HMAC-SHA256 verification, non-blocking multi-day retry timers, and failure-reason-adaptive retry strategies.
            </p>
          </div>

          <div className="timeline-card">
            <div className="timeline-meta mono">2018 &middot; 2022</div>
            <h3 className="timeline-title">B.Tech in Computer Science &amp; Engineering &middot; Integral University, Lucknow</h3>
            <p className="timeline-role-desc">
              Rigorous foundation in computer science, operating systems, and distributed algorithms. During college, focused extensively on <strong>Java</strong>, Object-Oriented Software Engineering, and native <strong>Android Development</strong>, building mobile and client-server projects that sparked my passion for distributed backend systems.
            </p>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Technical Domains &amp; Stack</h2>
          </div>
        </div>

        <div className="domains-grid">
          <div className="domain-card">
            <h3 className="domain-title">Backend &amp; APIs</h3>
            <ul className="domain-list mono">
              <li>Java 17 / 21</li>
              <li>Spring Boot 3.x</li>
              <li>Spring Batch</li>
              <li>RESTful API Design</li>
              <li>Microservices Architecture</li>
            </ul>
          </div>

          <div className="domain-card">
            <h3 className="domain-title">Data &amp; Persistence</h3>
            <ul className="domain-list mono">
              <li>PostgreSQL (ACID)</li>
              <li>Optimistic Locking</li>
              <li>AWS S3 (Audit Trails)</li>
              <li>Redis (Distributed Cache)</li>
              <li>Database Migration (Flyway)</li>
            </ul>
          </div>

          <div className="domain-card">
            <h3 className="domain-title">Messaging &amp; Distributed</h3>
            <ul className="domain-list mono">
              <li>AWS SQS &amp; SNS</li>
              <li>Temporal Workflows</li>
              <li>Event-Driven Fanout</li>
              <li>Dead Letter Queues (DLQ)</li>
              <li>Idempotent Retries</li>
            </ul>
          </div>

          <div className="domain-card">
            <h3 className="domain-title">Quality &amp; Delivery</h3>
            <ul className="domain-list mono">
              <li>JUnit 5 &amp; Mockito</li>
              <li>OpenSearch / Kibana</li>
              <li>Docker &amp; Compose</li>
              <li>AWS EC2 &amp; IAM</li>
              <li>CI/CD &amp; Git Workflows</li>
            </ul>
          </div>

          <div className="domain-card highlight-domain">
            <h3 className="domain-title">AI &amp; Active Learning</h3>
            <ul className="domain-list mono">
              <li><strong style={{ color: 'var(--bp-ink)' }}>AI Tooling:</strong> Agentic Workflows &amp; LLMs (Daily)</li>
              <li><strong style={{ color: 'var(--bp-ink)' }}>AI Backend:</strong> Tool-Calling &amp; Vector Stores</li>
              <li><strong style={{ color: 'var(--bp-ink)' }}>Learning:</strong> Go (Golang) &amp; Concurrency</li>
              <li><strong style={{ color: 'var(--bp-ink)' }}>Exploring:</strong> Distributed Consensus &amp; gRPC</li>
              <li><strong style={{ color: 'var(--bp-ink)' }}>Foundation:</strong> System Design &amp; ACID</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="about-cta-card">
        <h2 className="about-cta-title">Looking for Senior Backend Engineering Strength?</h2>
        <p className="about-cta-desc">
          Core platform architecture, high-throughput batch pipelines, and transactional consistency for engineering teams that need it. Let&apos;s talk.
        </p>
        <div className="about-cta-actions">
          <Link to="/contact" className="hero-btn hero-btn-primary">
            Get in Touch &rarr;
          </Link>
          <Link to="/" className="hero-btn hero-btn-secondary">
            View My Systems &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
