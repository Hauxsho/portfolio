import './EngagementModal.css';

interface EngagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EngagementModal({ isOpen, onClose }: EngagementModalProps) {
  if (!isOpen) return null;

  return (
    <div className="engagement-backdrop" onClick={onClose}>
      <div
        className="engagement-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="engagement-title"
      >
        <div className="engagement-header">
          <span className="engagement-manifest mono">MANIFEST &middot; ENGAGEMENT.cfg</span>
          <button
            type="button"
            className="engagement-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>

        <div className="engagement-body">
          <div className="engagement-tag mono">
            <span className="bp-pill-dot"></span>
            # AvailableForEngagement
          </div>

          <h3 id="engagement-title" className="engagement-title">
            Open to Senior Backend &amp; Distributed Systems Roles
          </h3>

          <p className="engagement-desc">
            Direct channel to discuss core backend platform engineering, high-throughput batch and event pipelines, distributed systems architecture, or full-time remote / UK / EU engineering roles.
          </p>

          <div className="engagement-spec-grid mono">
            <div className="engagement-spec-cell">
              <span className="spec-k">LOCATION / TIMEZONE</span>
              <span className="spec-v">Bengaluru (UTC+5:30) &middot; Remote</span>
            </div>
            <div className="engagement-spec-cell">
              <span className="spec-k">RESPONSE TIME</span>
              <span className="spec-v">&lt; 24h guaranteed</span>
            </div>
            <div className="engagement-spec-cell">
              <span className="spec-k">ELIGIBILITY</span>
              <span className="spec-v">Open to UK, EU &amp; Worldwide Remote</span>
            </div>
            <div className="engagement-spec-cell">
              <span className="spec-k">FOCUS AREAS</span>
              <span className="spec-v">Fintech &middot; Java/Spring &middot; Distributed Systems</span>
            </div>
          </div>

          <div className="engagement-actions">
            <a
              href="mailto:shubhamsrivastavaa9@gmail.com?subject=[Engineering%20Engagement]%20Role%20Discussion"
              className="engagement-cta-btn mono"
            >
              Email a Brief &rarr;
            </a>
            <button
              type="button"
              className="engagement-dismiss-btn mono"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
