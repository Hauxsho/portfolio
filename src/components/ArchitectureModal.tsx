import { useState, useEffect } from 'react';
import type { Project, ArchitectureStep } from '../data/projects';
import { useMetric } from '../context/MetricContext';
import './ArchitectureModal.css';

interface ArchitectureModalProps {
  project: Project | null;
  onClose: () => void;
}

const STEP_ICONS: Record<string, React.ReactNode> = {
  client: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  queue: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 12h16M4 18h16" />
      <circle cx="20" cy="6" r="1.5" fill="currentColor" />
      <circle cx="20" cy="12" r="1.5" fill="currentColor" />
      <circle cx="20" cy="18" r="1.5" fill="currentColor" />
    </svg>
  ),
  worker: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="15" x2="23" y2="15" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="15" x2="4" y2="15" />
    </svg>
  ),
  gateway: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <line x1="3.6" y1="9" x2="20.4" y2="9" />
      <line x1="3.6" y1="15" x2="20.4" y2="15" />
      <path d="M11.5 3a15 15 0 0 0 0 18M12.5 3a15 15 0 0 1 0 18" />
    </svg>
  ),
  storage: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  recovery: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  ),
};

interface DiagramNode {
  index: number;
  shape: 'rect' | 'circle' | 'primary-circle';
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  cx?: number;
  cy?: number;
  r?: number;
  badge?: string;
}

interface DiagramEdge {
  type: 'line' | 'curve';
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  pathD?: string;
  label?: string;
  labelX?: number;
  labelY?: number;
  dashed?: boolean;
}

interface ProjectDiagramTopology {
  primaryIndex: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

const PROJECT_TOPOLOGIES: Record<string, ProjectDiagramTopology> = {
  '01': {
    primaryIndex: 2,
    nodes: [
      { index: 0, shape: 'rect', x: 25, y: 105, width: 130, height: 52, badge: '01 · RAZORPAY' },
      { index: 1, shape: 'circle', cx: 200, cy: 195, r: 46, badge: '02 · HMAC GATE' },
      { index: 2, shape: 'primary-circle', cx: 390, cy: 195, r: 66, badge: 'TEMPORAL WORKFLOW' },
      { index: 3, shape: 'circle', cx: 580, cy: 115, r: 46, badge: '04 · RETRY RULES' },
      { index: 4, shape: 'circle', cx: 705, cy: 245, r: 48, badge: '05 · ACTIVITIES' },
      { index: 5, shape: 'rect', x: 240, y: 325, width: 160, height: 50, badge: '06 · POSTGRESQL' },
    ],
    edges: [
      { type: 'curve', pathD: 'M 140 159 C 160 170, 175 180, 182 185', label: 'failed webhook', labelX: 148, labelY: 182 },
      { type: 'line', x1: 248, y1: 195, x2: 322, y2: 195, label: 'HMAC pass', labelX: 285, labelY: 186 },
      { type: 'curve', pathD: 'M 445 152 C 485 125, 510 115, 532 115', label: 'failure reason', labelX: 495, labelY: 124 },
      { type: 'curve', pathD: 'M 618 145 C 650 175, 670 200, 685 215', label: 'delay & rules', labelX: 668, labelY: 174 },
      { type: 'curve', pathD: 'M 705 295 C 705 370, 650 392, 480 392 L 180 392 C 100 392, 45 280, 75 160', dashed: true, label: 'payment retry', labelX: 460, labelY: 382 },
      { type: 'line', x1: 370, y1: 263, x2: 340, y2: 323, label: 'state log & dedup', labelX: 388, labelY: 298 },
    ],
  },

  '02': {
    primaryIndex: 1,
    nodes: [
      { index: 0, shape: 'rect', x: 25, y: 168, width: 130, height: 54, badge: '01 · INGRESS' },
      { index: 1, shape: 'primary-circle', cx: 340, cy: 195, r: 66, badge: 'STATE MACHINE' },
      { index: 2, shape: 'circle', cx: 340, cy: 65, r: 46, badge: '03 · VERIFY' },
      { index: 3, shape: 'rect', x: 530, y: 168, width: 145, height: 54, badge: '04 · ACID DB' },
      { index: 4, shape: 'rect', x: 670, y: 90, width: 150, height: 52, badge: '04B · ROUTE' },
      { index: 5, shape: 'circle', cx: 745, cy: 280, r: 48, badge: '05 · NEFT/RTGS' },
      { index: 6, shape: 'rect', x: 495, y: 275, width: 160, height: 52, badge: '05B · CONFIRM' },
      { index: 7, shape: 'rect', x: 120, y: 325, width: 155, height: 50, badge: '06 · AUDIT SINK' },
    ],
    edges: [
      { type: 'line', x1: 155, y1: 195, x2: 272, y2: 195, label: 'sanctioned', labelX: 212, labelY: 186 },
      { type: 'line', x1: 328, y1: 128, x2: 328, y2: 113, label: '₹1 drop', labelX: 302, labelY: 121 },
      { type: 'line', x1: 352, y1: 113, x2: 352, y2: 128, label: 'valid', labelX: 372, labelY: 121 },
      { type: 'line', x1: 408, y1: 195, x2: 528, y2: 195, label: 'atomic lock', labelX: 468, labelY: 186 },
      { type: 'curve', pathD: 'M 675 180 C 695 180, 715 165, 725 144', label: 'disburse', labelX: 726, labelY: 172 },
      { type: 'line', x1: 745, y1: 144, x2: 745, y2: 230, label: 'clearing order', labelX: 786, labelY: 188 },
      { type: 'line', x1: 697, y1: 280, x2: 657, y2: 280, label: 'settlement', labelX: 677, labelY: 270 },
      { type: 'line', x1: 570, y1: 273, x2: 570, y2: 224, label: 'verified commit', labelX: 520, labelY: 250 },
      { type: 'curve', pathD: 'M 295 240 C 265 280, 240 295, 215 323', label: 'trace logs', labelX: 232, labelY: 272 },
    ],
  },

  '03': {
    primaryIndex: 2,
    nodes: [
      { index: 0, shape: 'rect', x: 25, y: 168, width: 130, height: 54, badge: '01 · SOURCE' },
      { index: 1, shape: 'circle', cx: 240, cy: 195, r: 48, badge: '02 · QUEUE' },
      { index: 2, shape: 'primary-circle', cx: 430, cy: 195, r: 66, badge: 'PRIMARY PROCESS' },
      { index: 3, shape: 'rect', x: 355, y: 40, width: 150, height: 52, badge: '03B · VALIDATE' },
      { index: 4, shape: 'circle', cx: 620, cy: 115, r: 48, badge: '04 · REGISTRY' },
      { index: 5, shape: 'rect', x: 680, y: 265, width: 150, height: 52, badge: '04B · RESOLVE' },
      { index: 6, shape: 'rect', x: 680, y: 180, width: 150, height: 54, badge: '05 · STORAGE' },
      { index: 7, shape: 'rect', x: 355, y: 325, width: 150, height: 50, badge: '06 · DLQ' },
    ],
    edges: [
      { type: 'line', x1: 155, y1: 195, x2: 190, y2: 195 },
      { type: 'line', x1: 288, y1: 195, x2: 362, y2: 195, label: 'chunks', labelX: 325, labelY: 186 },
      { type: 'line', x1: 430, y1: 128, x2: 430, y2: 94, label: 'screen', labelX: 456, labelY: 112 },
      { type: 'curve', pathD: 'M 505 66 C 535 66, 560 72, 578 82', label: 'clean query', labelX: 540, labelY: 62 },
      { type: 'curve', pathD: 'M 645 152 C 665 185, 680 195, 715 208', label: 'verified', labelX: 682, labelY: 165 },
      { type: 'curve', pathD: 'M 635 160 C 648 215, 658 265, 678 285', label: 'ambiguous', labelX: 620, labelY: 232 },
      { type: 'line', x1: 430, y1: 262, x2: 430, y2: 320, label: 'quarantine', labelX: 456, labelY: 294 },
      { type: 'curve', pathD: 'M 680 295 C 610 330, 560 345, 507 348', dashed: true },
    ],
  },

  '04': {
    primaryIndex: 1,
    nodes: [
      { index: 0, shape: 'rect', x: 25, y: 110, width: 130, height: 52, badge: '01 · BRANCH' },
      { index: 1, shape: 'primary-circle', cx: 310, cy: 180, r: 66, badge: 'DISPATCH ENGINE' },
      { index: 2, shape: 'circle', cx: 500, cy: 110, r: 46, badge: '03 · FANOUT' },
      { index: 3, shape: 'rect', x: 685, y: 135, width: 140, height: 52, badge: '04 · SURVEYOR' },
      { index: 4, shape: 'rect', x: 650, y: 245, width: 155, height: 52, badge: '05 · S3 EVIDENCE' },
      { index: 5, shape: 'rect', x: 440, y: 320, width: 165, height: 52, badge: '05B · POSTGRESQL' },
      { index: 6, shape: 'circle', cx: 160, cy: 315, r: 46, badge: '06 · SLA WATCH' },
    ],
    edges: [
      { type: 'curve', pathD: 'M 155 138 C 195 152, 220 162, 242 170', label: 'task req', labelX: 198, labelY: 146 },
      { type: 'curve', pathD: 'M 370 145 C 410 125, 435 115, 452 112', label: 'match route', labelX: 412, labelY: 122 },
      { type: 'line', x1: 548, y1: 115, x2: 683, y2: 150, label: 'vendor push', labelX: 618, labelY: 124 },
      { type: 'curve', pathD: 'M 740 189 C 740 210, 735 225, 730 243', label: 'geo photos', labelX: 746, labelY: 218 },
      { type: 'curve', pathD: 'M 650 271 C 590 285, 550 298, 535 318', label: 'save report', labelX: 605, labelY: 288 },
      { type: 'curve', pathD: 'M 270 236 C 240 265, 205 285, 185 295', label: '48h SLA timer', labelX: 252, labelY: 268 },
      { type: 'curve', pathD: 'M 140 275 C 130 215, 185 185, 242 182', dashed: true, label: 'breach re-route', labelX: 126, labelY: 220 },
    ],
  },

  '05': {
    primaryIndex: 4,
    nodes: [
      { index: 0, shape: 'rect', x: 25, y: 168, width: 130, height: 54, badge: '01 · ORIGINATION' },
      { index: 1, shape: 'rect', x: 90, y: 50, width: 135, height: 52, badge: '01B · QUEUE' },
      { index: 2, shape: 'circle', cx: 225, cy: 195, r: 46, badge: '02 · TEMPLATE' },
      { index: 3, shape: 'rect', x: 260, y: 50, width: 155, height: 52, badge: '02B · NORMALIZE' },
      { index: 4, shape: 'primary-circle', cx: 410, cy: 195, r: 66, badge: 'RENDER ENGINE' },
      { index: 5, shape: 'circle', cx: 595, cy: 115, r: 46, badge: '04 · CHECKSUM' },
      { index: 6, shape: 'rect', x: 675, y: 240, width: 155, height: 54, badge: '05 · S3 VAULT' },
      { index: 7, shape: 'rect', x: 260, y: 325, width: 150, height: 50, badge: '06 · CALLBACK' },
    ],
    edges: [
      { type: 'line', x1: 135, y1: 168, x2: 135, y2: 104, label: 'doc req', labelX: 105, labelY: 136 },
      { type: 'line', x1: 225, y1: 76, x2: 258, y2: 76, label: 'dispatch', labelX: 242, labelY: 66 },
      { type: 'curve', pathD: 'M 195 102 C 200 120, 210 135, 220 148', label: 'params', labelX: 236, labelY: 125 },
      { type: 'line', x1: 271, y1: 195, x2: 342, y2: 195, label: 'merged DOM', labelX: 308, labelY: 186 },
      { type: 'curve', pathD: 'M 390 102 C 395 115, 395 125, 395 130', label: 'fitted assets', labelX: 436, labelY: 116 },
      { type: 'curve', pathD: 'M 465 155 C 500 125, 525 115, 547 115', label: 'binary stream', labelX: 508, labelY: 126 },
      { type: 'curve', pathD: 'M 625 148 C 655 185, 680 205, 715 238', label: 'SHA-256 bound', labelX: 686, labelY: 185 },
      { type: 'curve', pathD: 'M 673 270 C 580 340, 480 350, 412 350', dashed: true, label: 'presigned URL callback', labelX: 520, labelY: 338 },
      { type: 'curve', pathD: 'M 258 350 C 130 350, 80 270, 85 224', dashed: true, label: 'unlocked', labelX: 130, labelY: 310 },
    ],
  },
};

export default function ArchitectureModal({ project, onClose }: ArchitectureModalProps) {
  const [activeTab, setActiveTab] = useState<'theory' | 'diagram'>('theory');
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(2);
  const { metric } = useMetric();

  useEffect(() => {
    if (project) {
      const top = PROJECT_TOPOLOGIES[project.id] || PROJECT_TOPOLOGIES['01'];
      setSelectedStepIndex(top.primaryIndex);
    }
  }, [project?.id]);

  if (!project) return null;

  const displayStatus = project.status.replace(/production/gi, 'Prod');

  const topology = PROJECT_TOPOLOGIES[project.id] || PROJECT_TOPOLOGIES['01'];

  const tradeOffPointers = Array.isArray(project.architecture.tradeOff)
    ? project.architecture.tradeOff
    : project.architecture.tradeOff.split(/(?<=\.)\s+/).filter(Boolean);

  const failurePointers = Array.isArray(project.architecture.failureModes)
    ? project.architecture.failureModes
    : project.architecture.failureModes.split(/(?<=\.)\s+/).filter(Boolean);

  const steps = project.architecture.steps;
  const currentSelectedStep: ArchitectureStep = steps[selectedStepIndex] || steps[0];
  const activeNode = topology.nodes.find((n) => n.index === selectedStepIndex);
  const activeBadgePrefix = activeNode?.badge?.includes(' · ')
    ? activeNode.badge.split(' · ')[0]
    : null;
  const currentStepLabel =
    activeBadgePrefix ||
    (currentSelectedStep?.id
      ? currentSelectedStep.id.length === 1
        ? `0${currentSelectedStep.id}`
        : currentSelectedStep.id
      : `0${selectedStepIndex + 1}`);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-top">
            <div className="modal-header-titles">
              <div className="modal-title-row">
                <h2 className="modal-title">{project.title}</h2>
                <span className="modal-badge mono">{displayStatus}</span>
              </div>
              <div className="modal-subtitle mono">{project.domain}</div>
            </div>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
              &times;
            </button>
          </div>

          <div className="modal-tabs-nav" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'theory'}
              className={`modal-tab-trigger ${activeTab === 'theory' ? 'active' : ''}`}
              onClick={() => setActiveTab('theory')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span>Architecture Spec &amp; Trade-offs</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'diagram'}
              className={`modal-tab-trigger ${activeTab === 'diagram' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('diagram');
                setSelectedStepIndex(topology.primaryIndex);
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <span>Data Flow Diagram ({steps.length} Nodes)</span>
            </button>
          </div>
        </div>

        <div className="modal-body">
          {activeTab === 'theory' ? (
            <div className="tab-pane-theory">
              <div className="qa-unboxed">
                <div className="qa-entry">
                  <div className="qa-lead">
                    <span className="qa-chip q-chip mono">Q</span>
                    <span className="qa-question-title mono">PROBLEM &amp; OPERATIONAL BOTTLENECK</span>
                  </div>
                  <p className="qa-description">{project.problem}</p>
                </div>


                <div className="qa-entry">
                  <div className="qa-lead">
                    <span className="qa-chip a-chip mono">A</span>
                    <span className="qa-question-title mono">ENGINEERED ARCHITECTURAL APPROACH</span>
                  </div>
                  <p className="qa-description">{project.approach}</p>
                </div>
              </div>

              <div className="section-divider" />

              <div className="modal-grid-two">
                <div className="tradeoff-card">
                  <div className="tradeoff-header">
                    <span className="icon-wrap">&Delta;</span>
                    <span className="tradeoff-title mono">KEY TECHNICAL TRADE-OFFS</span>
                  </div>
                  <ul className="tradeoff-pointers">
                    {tradeOffPointers.map((point, i) => (
                      <li key={i} className="pointer-item">
                        <span className="pointer-icon mono" aria-hidden="true">&bull;</span>
                        <span className="pointer-text">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="tradeoff-card failure-card">
                  <div className="tradeoff-header">
                    <span className="icon-wrap">&Xi;</span>
                    <span className="tradeoff-title mono">FAILURE MODES &amp; RESILIENCE</span>
                  </div>
                  <ul className="tradeoff-pointers">
                    {failurePointers.map((point, i) => (
                      <li key={i} className="pointer-item failure-pointer">
                        <span className="pointer-icon mono" aria-hidden="true">&bull;</span>
                        <span className="pointer-text">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="section-divider" />
            </div>
          ) : (
            <div className="tab-pane-diagram">
              <div className="diagram-intro-card">
                <div className="intro-badge mono">ARCHITECTURE EXECUTION TOPOLOGY</div>
                <p className="intro-summary">{project.architecture.summary}</p>
              </div>

              <div className="dfd-diagram-container">
                <div className="dfd-canvas-wrapper">
                  <svg
                    className="dfd-svg-canvas"
                    viewBox="0 0 860 410"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <marker
                        id="dfd-arrow"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto"
                      >
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#64748b" />
                      </marker>
                    </defs>

                    {topology.edges.map((edge, eIdx) => {
                      if (edge.type === 'line') {
                        return (
                          <g key={`edge-${eIdx}`} className="dfd-edge-group">
                            <line
                              x1={edge.x1}
                              y1={edge.y1}
                              x2={edge.x2}
                              y2={edge.y2}
                              stroke="#64748b"
                              strokeWidth="1.6"
                              strokeDasharray={edge.dashed ? '4 3' : undefined}
                              markerEnd="url(#dfd-arrow)"
                            />
                            {edge.label && edge.labelX && edge.labelY && (
                              <text
                                x={edge.labelX}
                                y={edge.labelY}
                                textAnchor="middle"
                                className="dfd-edge-text mono"
                              >
                                {edge.label === '₹1 drop' ? metric.pennyDrop : edge.label}
                              </text>
                            )}
                          </g>
                        );
                      }

                      return (
                        <g key={`edge-${eIdx}`} className="dfd-edge-group">
                          <path
                            d={edge.pathD}
                            stroke="#64748b"
                            strokeWidth="1.6"
                            strokeDasharray={edge.dashed ? '4 3' : undefined}
                            fill="none"
                            markerEnd="url(#dfd-arrow)"
                          />
                          {edge.label && edge.labelX && edge.labelY && (
                            <text
                              x={edge.labelX}
                              y={edge.labelY}
                              textAnchor="middle"
                              className="dfd-edge-text mono"
                            >
                              {edge.label === '₹1 drop' ? metric.pennyDrop : edge.label}
                            </text>
                          )}
                        </g>
                      );
                    })}

                    {topology.nodes.map((nodeConfig) => {
                      const step = steps[nodeConfig.index];
                      if (!step) return null;
                      const isSelected = selectedStepIndex === nodeConfig.index;

                      if (nodeConfig.shape === 'rect') {
                        return (
                          <g
                            key={`node-${nodeConfig.index}`}
                            className={`dfd-node-group ${isSelected ? 'active' : ''}`}
                            onClick={() => setSelectedStepIndex(nodeConfig.index)}
                          >
                            <rect
                              x={nodeConfig.x}
                              y={nodeConfig.y}
                              width={nodeConfig.width}
                              height={nodeConfig.height}
                              rx="8"
                              className="dfd-shape rect-node"
                            />
                            <foreignObject
                              x={nodeConfig.x}
                              y={nodeConfig.y}
                              width={nodeConfig.width}
                              height={nodeConfig.height}
                            >
                              <div className="dfd-node-label-box">
                                <span className="dfd-step-num mono">
                                  {nodeConfig.badge || `0${nodeConfig.index + 1}`}
                                </span>
                                <span className="dfd-node-name">{step.name}</span>
                              </div>
                            </foreignObject>
                          </g>
                        );
                      }

                      if (nodeConfig.shape === 'primary-circle') {
                        const size = (nodeConfig.r || 66) * 2;
                        const left = (nodeConfig.cx || 0) - (nodeConfig.r || 66);
                        const top = (nodeConfig.cy || 0) - (nodeConfig.r || 66);

                        return (
                          <g
                            key={`node-${nodeConfig.index}`}
                            className={`dfd-node-group primary ${isSelected ? 'active' : ''}`}
                            onClick={() => setSelectedStepIndex(nodeConfig.index)}
                          >
                            <circle
                              cx={nodeConfig.cx}
                              cy={nodeConfig.cy}
                              r={nodeConfig.r}
                              className="dfd-shape primary-circle-node"
                            />
                            <foreignObject x={left} y={top} width={size} height={size}>
                              <div className="dfd-node-label-circle primary">
                                <span className="dfd-primary-badge mono">
                                  {nodeConfig.badge || 'PRIMARY PROCESS'}
                                </span>
                                <span className="dfd-node-name primary">{step.name}</span>
                              </div>
                            </foreignObject>
                          </g>
                        );
                      }

                      const size = (nodeConfig.r || 48) * 2;
                      const left = (nodeConfig.cx || 0) - (nodeConfig.r || 48);
                      const top = (nodeConfig.cy || 0) - (nodeConfig.r || 48);

                      return (
                        <g
                          key={`node-${nodeConfig.index}`}
                          className={`dfd-node-group ${isSelected ? 'active' : ''}`}
                          onClick={() => setSelectedStepIndex(nodeConfig.index)}
                        >
                          <circle
                            cx={nodeConfig.cx}
                            cy={nodeConfig.cy}
                            r={nodeConfig.r}
                            className="dfd-shape circle-node"
                          />
                          <foreignObject x={left} y={top} width={size} height={size}>
                            <div className="dfd-node-label-circle">
                              <span className="dfd-step-num mono">
                                {nodeConfig.badge || `0${nodeConfig.index + 1}`}
                              </span>
                              <span className="dfd-node-name">{step.name}</span>
                            </div>
                          </foreignObject>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="dfd-inspector-card">
                  <div className="dfd-inspector-head">
                    <div className="dfd-inspector-tag mono">
                      {STEP_ICONS[currentSelectedStep.type]}
                      <span>
                        STEP {currentStepLabel} // {currentSelectedStep.type.toUpperCase()} · {currentSelectedStep.role}
                      </span>
                    </div>
                    <span className="dfd-click-hint mono">Click any node above to inspect</span>
                  </div>

                  <h3 className="dfd-inspector-title">{currentSelectedStep.name}</h3>

                  {currentSelectedStep.detail && (
                    <p className="dfd-inspector-desc">{currentSelectedStep.detail}</p>
                  )}

                  {currentSelectedStep.dataFlow && (
                    <div className="dfd-inspector-payload mono">
                      <span className="payload-label">OUTBOUND DATAFLOW:</span>
                      <span className="payload-val">{currentSelectedStep.dataFlow} &rarr;</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="section-divider" />
            </div>
          )}

          <div className="modal-bottom-zone">
            <div className="modal-footer-stack">
              <span className="stack-label mono">DEPLOYED TECHNOLOGIES:</span>
              <div className="stack-list mono">
                {project.stack.map((t) => (
                  <span key={t} className="stack-item">{t}</span>
                ))}
              </div>
            </div>

            <div className="modal-footer-actions">
              {project.codeUrl && (
                <a
                  href={project.codeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="modal-repo-btn mono"
                >
                  View GitHub Repository &rarr;
                </a>
              )}
              <button className="modal-done-btn" onClick={onClose}>
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
