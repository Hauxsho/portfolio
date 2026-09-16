import { useState, useEffect, type FC } from 'react';
import './ArchitecturalBanner.css';

const ICON_Y = 175;
const BASE_Y = 250;
const R = 54;
const EDGE = 'var(--bp-cyan)';

function BannerBackdrop({ width, height }: { width: number; height: number }) {
  return (
    <svg
      className="arch-backdrop-svg"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id="backdropHatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="6" stroke={EDGE} strokeOpacity="0.5" strokeWidth="1" />
        </pattern>
      </defs>

      <line x1="0" y1={height} x2={width} y2="0" stroke="var(--bp-ink)" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="4 6" />
      <line x1="0" y1="0" x2={width * 0.6} y2={height} stroke="var(--bp-ink)" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="4 6" />
      <line x1={width * 0.4} y1="0" x2={width} y2={height} stroke="var(--bp-ink)" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="4 6" />
      <line x1="0" y1={height * 0.3} x2={width} y2={height * 0.7} stroke="var(--bp-ink)" strokeOpacity="0.06" strokeWidth="1" strokeDasharray="3 6" />

      {/* Alternating V (top perimeter) and ^ (bottom perimeter) chevrons */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = (width / 5) * i - 90;
        const isBottom = i % 2 === 1;
        const y = isBottom ? height - 150 : -85;
        return (
          <g key={`bg-box-${i}`} opacity="0.5" transform={`translate(${x}, ${y})`}>
            <polygon points="0,120 90,70 180,120 90,170" fill="url(#backdropHatch)" stroke={EDGE} strokeOpacity="0.3" strokeWidth="1" />
            <polygon points="0,120 90,170 90,240 0,190" fill={EDGE} fillOpacity="0.03" stroke={EDGE} strokeOpacity="0.22" strokeWidth="1" />
            <polygon points="180,120 90,170 90,240 180,190" fill={EDGE} fillOpacity="0.015" stroke={EDGE} strokeOpacity="0.22" strokeWidth="1" />
          </g>
        );
      })}
    </svg>
  );
}

function DiamondBase({ x }: { x: number }) {
  const w = 84;
  const h = 28;
  return (
    <polygon
      points={`${x},${BASE_Y - h / 2} ${x + w / 2},${BASE_Y} ${x},${BASE_Y + h / 2} ${x - w / 2},${BASE_Y}`}
      fill={EDGE}
      fillOpacity="0.05"
      stroke={EDGE}
      strokeOpacity="0.3"
      strokeWidth="1.2"
    />
  );
}

const UsersIcon: FC<{ x: number }> = ({ x }) => (
  <g filter="url(#neonGlow)">
    <circle cx={x + 4} cy={ICON_Y - 20} r="17" fill="none" stroke={EDGE} strokeWidth="3" />
    <path d={`M ${x - 32} ${ICON_Y + 32} q 0 -30 36 -30 q 36 0 36 30`} fill="none" stroke={EDGE} strokeWidth="3" strokeLinecap="round" />
  </g>
);

const CodeIcon: FC<{ x: number }> = ({ x }) => {
  const w = 56, h = 78;
  const left = x - w / 2;
  const top = ICON_Y - h / 2;
  return (
    <g filter="url(#neonGlow)">
      <path d={`M ${left} ${top} l -10 8 v ${h - 16} l 10 8`} fill="none" stroke={EDGE} strokeOpacity="0.7" strokeWidth="2.4" />
      <rect x={left} y={top} width={w} height={h} rx="6" fill="none" stroke={EDGE} strokeWidth="3" />
      <path d={`M ${x - 10} ${ICON_Y - 9} l -11 9 l 11 9`} fill="none" stroke={EDGE} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M ${x + 10} ${ICON_Y - 9} l 11 9 l -11 9`} fill="none" stroke={EDGE} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

const ServersIcon: FC<{ x: number }> = ({ x }) => {
  const w = 66, uH = 20, gap = 4, skew = 7;
  const left = x - w / 2;
  const startTop = ICON_Y - (uH * 3 + gap * 2) / 2;
  return (
    <g filter="url(#neonGlow)">
      {[0, 1, 2].map((i) => {
        const top = startTop + i * (uH + gap);
        return (
          <g key={i}>
            <polygon
              points={`${left},${top} ${left + w},${top} ${left + w - skew},${top - 5} ${left + skew},${top - 5}`}
              fill={EDGE} fillOpacity="0.12" stroke={EDGE} strokeWidth="1.6"
            />
            <rect x={left} y={top} width={w} height={uH} rx="3" fill="none" stroke={EDGE} strokeWidth="2.6" />
            <circle cx={left + 11} cy={top + uH / 2} r="2.4" fill={EDGE} />
          </g>
        );
      })}
    </g>
  );
};

const QueueIcon: FC<{ x: number }> = ({ x }) => {
  const cy = ICON_Y;
  const len = 96;
  const rx = 15;
  const ry = 34;
  const left = x - len / 2;
  const right = x + len / 2;
  const ringsAt = [1, 2, 3].map((i) => left + (len / 4) * i);
  return (
    <g filter="url(#neonGlow)">
      <path d={`M ${left} ${cy - ry} H ${right} M ${left} ${cy + ry} H ${right}`} fill="none" stroke={EDGE} strokeWidth="2.6" />
      <ellipse cx={right} cy={cy} rx={rx} ry={ry} fill="none" stroke={EDGE} strokeWidth="2.6" />
      {ringsAt.map((rx0) => (
        <ellipse key={rx0} cx={rx0} cy={cy} rx={rx} ry={ry} fill="none" stroke={EDGE} strokeOpacity="0.85" strokeWidth="2.2" />
      ))}
      <ellipse cx={left} cy={cy} rx={rx} ry={ry} fill="none" stroke={EDGE} strokeWidth="2.6" />
    </g>
  );
};

const DatabaseIcon: FC<{ x: number }> = ({ x }) => {
  const rx = 30, ry = 12;
  const top = ICON_Y - 42;
  const h = 84;
  return (
    <g filter="url(#neonGlow)">
      <path d={`M ${x - rx} ${top} v ${h} a ${rx} ${ry} 0 0 0 ${rx * 2} 0 v ${-h}`} fill="none" stroke={EDGE} strokeWidth="2.8" />
      <ellipse cx={x} cy={top} rx={rx} ry={ry} fill="none" stroke={EDGE} strokeWidth="2.8" />
      {[h * 0.33, h * 0.66].map((d) => (
        <path key={d} d={`M ${x - rx} ${top + d} a ${rx} ${ry} 0 0 0 ${rx * 2} 0`} fill="none" stroke={EDGE} strokeOpacity="0.8" strokeWidth="2.2" />
      ))}
    </g>
  );
};

const CloudIcon: FC<{ x: number }> = ({ x }) => {
  const cy = ICON_Y + 42;
  return (
    <g filter="url(#neonGlow)">
      <path
        d={`M ${x - 36} ${cy} a 25.5 25.5 0 0 1 4.5 -50.55 a 33 33 0 0 1 63 -7.2 a 24 24 0 0 1 -5.25 57.75 z`}
        fill="none" stroke={EDGE} strokeWidth="4.2" strokeLinejoin="round"
      />
    </g>
  );
};

const DESKTOP_NODES = [UsersIcon, CodeIcon, ServersIcon, QueueIcon, DatabaseIcon, CloudIcon];
const MOBILE_NODES = [UsersIcon, ServersIcon, QueueIcon, DatabaseIcon];

export default function ArchitecturalBanner() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    update(mq);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const nodes = isMobile ? MOBILE_NODES : DESKTOP_NODES;
  const vbW = isMobile ? 960 : 1600;
  const vbH = isMobile ? 360 : 420;
  const padding = isMobile ? 120 : 160;
  const step = (vbW - padding * 2) / (nodes.length - 1);
  const nodeX = Array.from({ length: nodes.length }, (_, i) => padding + i * step);

  return (
    <div className="arch-banner-wrapper">
      <div className="arch-canvas-frame">
        <BannerBackdrop width={vbW} height={vbH} />

        <svg
          className="arch-isometric-svg"
          viewBox={`0 0 ${vbW} ${vbH}`}
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <filter id="neonGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker id="flowArrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={EDGE} />
            </marker>
          </defs>

          {nodeX.map((x) => (
            <DiamondBase x={x} key={`base-${x}`} />
          ))}

          {nodeX.slice(0, -1).map((x, i) => {
            const nextX = nodeX[i + 1];
            const id = `arrow-${isMobile ? 'm' : 'd'}-${i}`;
            return (
              <g key={id}>
                <path
                  id={id}
                  d={`M ${x + R} ${ICON_Y} L ${nextX - R} ${ICON_Y}`}
                  stroke={EDGE}
                  strokeWidth="2"
                  strokeOpacity="0.6"
                  markerEnd="url(#flowArrowhead)"
                  filter="url(#neonGlow)"
                />
                <circle r="3.5" fill={EDGE} filter="url(#neonGlow)">
                  <animateMotion dur="1.8s" begin="0s" repeatCount="indefinite">
                    <mpath href={`#${id}`} />
                  </animateMotion>
                </circle>
                <circle r="3.5" fill={EDGE} filter="url(#neonGlow)" opacity="0.6">
                  <animateMotion dur="1.8s" begin="0.9s" repeatCount="indefinite">
                    <mpath href={`#${id}`} />
                  </animateMotion>
                </circle>
              </g>
            );
          })}

          {nodes.map((Icon, i) => (
            <Icon x={nodeX[i]} key={`n-${i}`} />
          ))}
        </svg>
      </div>

      <div className="arch-profile-row">
        <div className="arch-avatar-container">
          <img src={`${import.meta.env.BASE_URL}avatar.jpg`} alt="Shubham Srivastava" className="arch-avatar-img" />
          <span className="arch-status-dot" title="Available for Opportunities" />
        </div>

        <div className="arch-identity-wrap">
          <div className="arch-name-line">
            <h1 className="arch-name">Shubham Srivastava</h1>
            <span className="arch-verified-badge" title="Verified Backend Engineer">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
              </svg>
            </span>
          </div>
          <div className="arch-meta-line">
            <span className="arch-role-title">
              Backend Engineer &middot; Distributed Systems &amp; Fintech
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}