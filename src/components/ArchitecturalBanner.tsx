import type { FC } from 'react';
import './ArchitecturalBanner.css';

const VB_W = 1600;
const VB_H = 480;
const ICON_Y = 240;
const BASE_Y = 330;
const R = 60;

const NODE_X = [200, 440, 680, 920, 1160, 1400];

const EDGE = 'var(--bp-cyan)';

function BannerBackdrop() {
  return (
    <svg
      className="arch-backdrop-svg"
      viewBox="0 0 1600 480"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id="backdropHatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="6" stroke={EDGE} strokeOpacity="0.5" strokeWidth="1" />
        </pattern>
      </defs>

      <line x1="0" y1="480" x2="1600" y2="0" stroke="var(--bp-ink)" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="4 6" />
      <line x1="0" y1="0" x2="900" y2="480" stroke="var(--bp-ink)" strokeOpacity="0.09" strokeWidth="1" strokeDasharray="4 6" />
      <line x1="700" y1="0" x2="1600" y2="480" stroke="var(--bp-ink)" strokeOpacity="0.09" strokeWidth="1" strokeDasharray="4 6" />
      <line x1="200" y1="0" x2="0" y2="300" stroke="var(--bp-ink)" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="3 5" />
      <line x1="1600" y1="120" x2="1300" y2="480" stroke="var(--bp-ink)" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="3 5" />
      <line x1="400" y1="480" x2="600" y2="0" stroke="var(--bp-ink)" strokeOpacity="0.07" strokeWidth="1" strokeDasharray="4 6" />
      <line x1="1000" y1="0" x2="1200" y2="480" stroke="var(--bp-ink)" strokeOpacity="0.07" strokeWidth="1" strokeDasharray="4 6" />
      <line x1="0" y1="90" x2="1600" y2="390" stroke="var(--bp-ink)" strokeOpacity="0.06" strokeWidth="1" strokeDasharray="2 5" />

      <g opacity="0.65" transform="translate(1220,-70)">
        <polygon points="0,120 90,70 180,120 90,170" fill="url(#backdropHatch)" stroke={EDGE} strokeOpacity="0.3" strokeWidth="1" />
        <polygon points="0,120 90,170 90,240 0,190" fill={EDGE} fillOpacity="0.03" stroke={EDGE} strokeOpacity="0.22" strokeWidth="1" />
        <polygon points="180,120 90,170 90,240 180,190" fill={EDGE} fillOpacity="0.015" stroke={EDGE} strokeOpacity="0.22" strokeWidth="1" />
      </g>

      <g opacity="0.65" transform="translate(10,-70)">
        <polygon points="0,120 90,70 180,120 90,170" fill="url(#backdropHatch)" stroke={EDGE} strokeOpacity="0.3" strokeWidth="1" />
        <polygon points="0,120 90,170 90,240 0,190" fill={EDGE} fillOpacity="0.03" stroke={EDGE} strokeOpacity="0.22" strokeWidth="1" />
        <polygon points="180,120 90,170 90,240 180,190" fill={EDGE} fillOpacity="0.015" stroke={EDGE} strokeOpacity="0.22" strokeWidth="1" />
      </g>

      <g opacity="0.65" transform="translate(300,90)">
        <polygon points="0,120 90,70 180,120 90,170" fill="url(#backdropHatch)" stroke={EDGE} strokeOpacity="0.3" strokeWidth="1" />
        <polygon points="0,120 90,170 90,240 0,190" fill={EDGE} fillOpacity="0.03" stroke={EDGE} strokeOpacity="0.22" strokeWidth="1" />
        <polygon points="180,120 90,170 90,240 180,190" fill={EDGE} fillOpacity="0.015" stroke={EDGE} strokeOpacity="0.22" strokeWidth="1" />
      </g>

      <g opacity="0.65" transform="translate(600,-70)">
        <polygon points="0,120 90,70 180,120 90,170" fill="url(#backdropHatch)" stroke={EDGE} strokeOpacity="0.3" strokeWidth="1" />
        <polygon points="0,120 90,170 90,240 0,190" fill={EDGE} fillOpacity="0.03" stroke={EDGE} strokeOpacity="0.22" strokeWidth="1" />
        <polygon points="180,120 90,170 90,240 180,190" fill={EDGE} fillOpacity="0.015" stroke={EDGE} strokeOpacity="0.22" strokeWidth="1" />
      </g>

      <g opacity="0.65" transform="translate(1560,90)">
        <polygon points="0,120 90,70 180,120 90,170" fill="url(#backdropHatch)" stroke={EDGE} strokeOpacity="0.3" strokeWidth="1" />
        <polygon points="0,120 90,170 90,240 0,190" fill={EDGE} fillOpacity="0.03" stroke={EDGE} strokeOpacity="0.22" strokeWidth="1" />
        <polygon points="180,120 90,170 90,240 180,190" fill={EDGE} fillOpacity="0.015" stroke={EDGE} strokeOpacity="0.22" strokeWidth="1" />
      </g>

      <g opacity="0.22" transform="translate(60,340)">
        <polygon points="0,60 50,35 100,60 50,85" fill="url(#backdropHatch)" stroke={EDGE} strokeOpacity="0.25" strokeWidth="1" />
        <polygon points="0,60 50,85 50,125 0,100" fill={EDGE} fillOpacity="0.02" stroke={EDGE} strokeOpacity="0.18" strokeWidth="1" />
      </g>


    </svg>
  );
}

function DiamondBase({ x }: { x: number }) {
  const w = 96;
  const h = 34;
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

const NODES: FC<{ x: number }>[] = [UsersIcon, CodeIcon, ServersIcon, QueueIcon, DatabaseIcon, CloudIcon];

export default function ArchitecturalBanner() {
  return (
    <div className="arch-banner-wrapper">
      <div className="arch-canvas-frame">
        <BannerBackdrop />

        <svg
          className="arch-isometric-svg"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
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

          {NODE_X.map((x) => <DiamondBase x={x} key={`base-${x}`} />)}

          {NODE_X.slice(0, -1).map((x, i) => {
            const id = `arrow-${i}`;
            return (
              <g key={id}>
                <path
                  id={id}
                  d={`M ${x + R} ${ICON_Y} L ${NODE_X[i + 1] - R} ${ICON_Y}`}
                  stroke={EDGE} strokeWidth="2" strokeOpacity="0.6"
                  markerEnd="url(#flowArrowhead)" filter="url(#neonGlow)"
                />
                <circle r="3.5" fill={EDGE} filter="url(#neonGlow)">
                  <animateMotion dur="1.8s" begin="0s" repeatCount="indefinite"><mpath href={`#${id}`} /></animateMotion>
                </circle>
                <circle r="3.5" fill={EDGE} filter="url(#neonGlow)" opacity="0.6">
                  <animateMotion dur="1.8s" begin="0.9s" repeatCount="indefinite"><mpath href={`#${id}`} /></animateMotion>
                </circle>
              </g>
            );
          })}

          {NODES.map((Icon, i) => <Icon x={NODE_X[i]} key={`n-${i}`} />)}
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