export type ArchitectureStep = {
  id: string;
  name: string;
  role: string;
  type: 'client' | 'gateway' | 'queue' | 'worker' | 'storage' | 'recovery';
  detail?: string;
  dataFlow?: string;
};

export type ArchitectureDetail = {
  summary: string;
  steps: ArchitectureStep[];
  tradeOff: string | string[];
  failureModes: string | string[];
};

export type Project = {
  id: string;
  status: string;
  title: string;
  domain: string;
  tagline: string;
  taglineInr?: string;
  taglineUsd?: string;
  problem: string;
  approach: string;
  outcomeInr?: string;
  outcomeUsd?: string;
  figures: {
    label: string;
    valueInr: string;
    valueUsd: string;
  }[];
  stack: string[];
  codeUrl?: string;
  architecture: ArchitectureDetail;
};

export const projects: Project[] = [
  {
    id: '01',
    status: 'Featured Architecture · Distributed Systems',
    title: 'Kintsugi: Transaction recovery engine',
    domain: 'distributed systems · Temporal · Spring Boot 3.3 · Java 21',
    tagline:
      'Temporal-powered durable workflow engine recovering failed subscription payments with intelligent per-failure-reason retries.',
    taglineInr:
      'Temporal-powered durable workflow engine recovering failed subscription payments with intelligent per-failure-reason retries.',
    taglineUsd:
      'Temporal-powered durable workflow engine recovering failed subscription payments with intelligent per-failure-reason retries.',
    problem:
      'In fintech, 20–40% of subscription cancellations are involuntary churn from failed payments. UPI timeouts can succeed minutes later, while insufficient funds may take days. Traditional cron-based retry systems lose state on server restart, lack failure-reason intelligence, and cannot wait days without holding threads and memory.',
    approach:
      'Architected Kintsugi using Java 21, Spring Boot 3.3, and Temporal durable workflows. Failed payment webhooks are HMAC-SHA256 verified and deduplicated before initiating an isolated durable stateful workflow per transaction. Uses non-blocking Workflow.sleep() to wait without thread starvation, surviving server crashes and applying adaptive retry policies by failure type.',
    outcomeInr: 'Recovers revenue lost to involuntary subscription churn with zero-thread durable workflows and failure-aware adaptive retries.',
    outcomeUsd: 'Recovers revenue lost to involuntary subscription churn with zero-thread durable workflows and failure-aware adaptive retries.',
    figures: [
      { label: 'security', valueInr: 'HMAC-SHA256', valueUsd: 'HMAC-SHA256' },
      { label: 'execution', valueInr: 'Durable Workflows', valueUsd: 'Durable Workflows' },
      { label: 'engine', valueInr: 'Temporal + Docker', valueUsd: 'Temporal + Docker' },
    ],
    stack: ['Java', 'Spring Boot', 'Temporal', 'PostgreSQL', 'Docker Compose', 'Flyway'],
    codeUrl: 'https://github.com/Hauxsho/kintsugi',
    architecture: {
      summary:
        'Ingests Razorpay payment.failed webhooks via HMAC-SHA256 verified endpoints, executes deduplication checks in PostgreSQL, and launches an isolated Temporal durable workflow per transaction. Decoupled retry strategies calculate adaptive delays (fast retries for UPI timeouts, progressive backoff for insufficient funds, immediate termination for expired cards) executed through independently retryable activities, so a transient failure in one payment gateway call doesn\'t require re-running the entire workflow.',
      steps: [
        {
          id: '1',
          name: 'Webhook Ingress',
          role: 'Razorpay Error Mapping',
          type: 'client',
          detail: 'RazorpayWebhookControllerImpl receives payment.failed events, parses JSON payloads, and maps Razorpay error codes to internal failure types before delegation.',
          dataFlow: 'Raw Webhook Payload & HMAC Signature',
        },
        {
          id: '2',
          name: 'HMAC Validation',
          role: 'Cryptographic Gatekeeper',
          type: 'gateway',
          detail: 'RazorpayWebhookService verifies HMAC-SHA256 signatures against the webhook secret, rejecting forged or malicious requests before business logic.',
          dataFlow: 'HMAC-Verified Event Handoff',
        },
        {
          id: '3',
          name: 'Temporal Workflow',
          role: 'Durable Stateful Brain',
          type: 'queue',
          detail: 'PaymentRecoveryWorkflowImpl orchestrates the lifecycle with Workflow.sleep(). Survives server restarts and crashes by replaying event history, holding zero threads during long waits.',
          dataFlow: 'Activity Invocation & Dunning Schedule',
        },
        {
          id: '4',
          name: 'Retry Strategy',
          role: 'Business Intelligence Layer',
          type: 'worker',
          detail: 'RetryStrategy centralises dunning rules: 5 attempts (5s delay) for INSUFFICIENT_FUNDS, 3 attempts (2s delay) for UPI_TIMEOUT, and immediate LOST for CARD_EXPIRED.',
          dataFlow: 'Calculated Delay & Attempt Rules',
        },
        {
          id: '5',
          name: 'Payment Activities',
          role: 'External Execution Layer',
          type: 'worker',
          detail: 'PaymentActivityImpl performs external interactions: updating attempt counts, executing payment retries, and recording final status (RECOVERED or LOST).',
          dataFlow: 'Terminal State DB Mutation',
        },
        {
          id: '6',
          name: 'PostgreSQL Store',
          role: 'Persistent Source of Truth',
          type: 'storage',
          detail: 'Persists Subscription and FailedPayment entities with Flyway migrations, @PrePersist/@PreUpdate timestamps, and deduplication keys.',
        },
      ],
      tradeOff: [
        'Chose Temporal durable execution over Redis BullMQ / DB Polling because it persists workflow state across process crashes.',
        'Workflow.sleep() holds no JVM threads or memory during multi-day dunning intervals, surviving server restarts seamlessly.',
        'Decoupled retry logic from workflow orchestration, so retry policies (how long to wait, how many attempts, which failure types to abandon) can be tuned per failure type without touching the core workflow state machine.',
      ],
      failureModes: [
        'Survives server crashes and redeployments by replaying deterministic event histories from PostgreSQL.',
        'Deduplication logic verifies each payment\'s unique ID before DB writes, preventing duplicate workflows and orphan rows.',
        'Failure-aware classifier halts immediately on CARD_EXPIRED (0 retries), preventing wasteful gateway calls while retrying transient timeouts.',
      ],
    },
  },
  {
    id: '02',
    status: 'Prod · Protium Finance',
    title: 'Enterprise loan disbursement platform',
    domain: 'fintech core · distributed workflows · PostgreSQL',
    tagline:
      'Automated disbursement orchestration engine processing ₹50 Cr+/month with strict ACID idempotency.',
    taglineInr:
      'Automated disbursement orchestration engine processing ₹50 Cr+/month with strict ACID idempotency.',
    taglineUsd:
      'Automated disbursement orchestration engine processing $6M+/month with strict ACID idempotency.',
    problem:
      'Disbursing capital across multiple lending products required coordinating credit checks, collateral clearance, bank verification, and ledger accounting without risk of double-crediting or lost state.',
    approach:
      'Engineered an enterprise-grade automated disbursement engine handling end-to-end loan lifecycle workflows using Java, Spring Boot, PostgreSQL, and AWS, with resilient transaction boundaries and audit logging.',
    outcomeInr: 'Handles ₹50 Cr+/month in disbursements with a 10x throughput increase.',
    outcomeUsd: 'Handles $6M+/month in disbursements with a 10x throughput increase.',
    figures: [
      { label: 'throughput', valueInr: '10x increase', valueUsd: '10x increase' },
      { label: 'monthly volume', valueInr: '₹50 Cr+/mo', valueUsd: '$6M+/mo' },
      { label: 'lifecycle', valueInr: '100% Automated', valueUsd: '100% Automated' },
    ],
    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'AWS EC2/S3', 'Microservices', 'OpenSearch'],
    architecture: {
      summary:
        'Multi-stage loan orchestration pipeline coordinating compliance gates, bank account penny-drop verifications, core banking ledger commits, and automated payment gateway execution.',
      steps: [
        {
          id: '1',
          name: 'Origination Gateway',
          role: 'Loan Ingestion & Auth',
          type: 'gateway',
          detail: 'Authenticates loan sanction events, validates caller identity tokens, and enforces unique idempotency keys.',
          dataFlow: 'Validated Disbursal Instruction',
        },
        {
          id: '2',
          name: 'State Machine Engine',
          role: 'Disbursement Lifecycle',
          type: 'worker',
          detail: 'Coordinates credit, collateral clearance, and account verification checkpoints through deterministic state transitions.',
          dataFlow: 'Micro-Deposit Penny Drop Request',
        },
        {
          id: '3',
          name: 'Penny Drop / Bank API',
          role: 'Account Verification',
          type: 'client',
          detail: 'Automates ₹1 micro-deposit verification against the banking network to confirm account ownership and active status.',
          dataFlow: 'Account Verification Confirmation',
        },
        {
          id: '4',
          name: 'PostgreSQL (ACID)',
          role: 'Optimistic Locked Ledger',
          type: 'storage',
          detail: 'Executes atomic balance deduction with optimistic locking, preventing concurrent double-crediting or race conditions.',
          dataFlow: 'Direct Host-to-Host Payment Order',
        },
        {
          id: '4B',
          name: 'Provider Abstraction Layer',
          role: 'Payment Partner Routing',
          type: 'gateway',
          detail: 'Routes disbursement instructions to the appropriate banking/payment provider through a common interface, isolating partner-specific integration details from core orchestration logic.',
          dataFlow: 'Partner-Agnostic Payment Instruction',
        },
        {
          id: '5',
          name: 'Banking Node / NEFT',
          role: 'Fund Transfer Clearing',
          type: 'gateway',
          detail: 'Transmits authenticated payment orders directly to core banking partners via secure host-to-host NEFT/RTGS gateways.',
          dataFlow: 'Structured Audit Log Stream',
        },
        {
          id: '5B',
          name: 'Independent Status Verification',
          role: 'Settlement Verification',
          type: 'worker',
          detail: 'Cross-checks every asynchronous settlement notification against the source system before advancing the ledger, guarding against spoofed or duplicate confirmations.',
          dataFlow: 'Verified Settlement State Commit',
        },
        {
          id: '6',
          name: 'Kibana / OpenSearch',
          role: 'Real-Time Audit Trail',
          type: 'recovery',
          detail: 'Streams end-to-end execution logs with correlated trace IDs, offering sub-second observability across disbursal queues.',
        },
      ],
      tradeOff: [
        'Utilized optimistic locking and distributed state validation over 2-phase commits (2PC) to preserve sub-second response times.',
        'Avoided distributed database locks across banking partner latency spikes and network jitter.',
        'Enforced immutable append-only ledger entries for zero-drift financial audit compliance.',
        'Adopted a pluggable payment-provider abstraction so new banking partners or payment rails can be integrated without changing core disbursement logic, isolating partner-specific protocol differences behind a common interface.',
      ],
      failureModes: [
        'Banking API timeouts trigger automated idempotency-key status polling rather than blind retries, eliminating double-disbursements.',
        'Circuit breakers trip on sustained clearing house errors, gracefully deferring transactions to durable retry queues.',
        'Penny-drop verification failures immediately halt disbursement pipeline before core ledger commit.',
        'Never trusts a payment confirmation at face value — every asynchronous settlement notification triggers an independent status verification against the source system before the ledger is updated, preventing spoofed or replayed confirmations from corrupting financial state.',
      ],
    },
  },
  {
    id: '03',
    status: 'Prod · Protium Finance',
    title: 'CKYC compliance automation system',
    domain: 'compliance · Spring Batch · AWS SQS · S3',
    tagline:
      'Distributed batch processing engine validating 3 Lakh+ Central KYC records/hour with automated failure isolation.',
    taglineInr:
      'Distributed batch processing engine validating 3 Lakh+ Central KYC records/hour with automated failure isolation.',
    taglineUsd:
      'Distributed batch processing engine validating 300K+ Central KYC records/hour with automated failure isolation.',
    problem:
      'Central KYC verification sits in the critical path of every loan disbursement, with zero tolerance for silent failure. Beyond throughput, individual records carry strict data-quality requirements — malformed identity fields, address mismatches, or invalid formatting can cause an entire submission batch to be rejected by the registry, and ambiguous identity matches require manual resolution that stalls disbursement queues.',
    approach:
      'Engineered a distributed batch engine using Spring Batch, AWS SQS, and S3. A rules-based validation layer screens records for data-quality and compliance issues before they enter the batch pipeline, so malformed data is caught early rather than causing bulk rejection. Address and identity fields are reconciled against master reference data using fuzzy/similarity matching to handle spelling variations and legacy formatting. For registry matches flagged as ambiguous, an image-similarity comparison step assists in automated resolution, escalating only low-confidence cases for manual review. Before transmission, batches are cryptographically signed to meet regulatory integrity requirements and transmitted via a secure automated file-transfer channel.',
    outcomeInr: 'Processes 3 Lakh+ CKYC cases/hour, directly driving revenue generation within year 1.',
    outcomeUsd: 'Processes 300K+ CKYC cases/hour, directly driving revenue generation within year 1.',
    figures: [
      { label: 'throughput', valueInr: '3 Lakh+ cases/hr', valueUsd: '300K+ cases/hr' },
      { label: 'automation', valueInr: 'Automated DLQ', valueUsd: 'Automated DLQ' },
    ],
    stack: ['Java', 'Spring Batch', 'AWS SQS', 'AWS S3', 'PostgreSQL', 'Docker'],
    architecture: {
      summary:
        'Loan lifecycle triggers push verification events to SQS. Clustered Spring Batch workers consume messages in partitioned chunks, validate against the central KYC registry, write audit logs to S3, and isolate corrupted records to an automated DLQ.',
      steps: [
        {
          id: '1',
          name: 'Loan Trigger',
          role: 'Event Publisher',
          type: 'client',
          detail: 'Loan origination events fire asynchronous compliance verification triggers when a borrower submits identity proofs.',
          dataFlow: 'Async Verification Request (JSON)',
        },
        {
          id: '2',
          name: 'AWS SQS',
          role: 'Chunk Ingestion Queue',
          type: 'queue',
          detail: 'Buffers incoming verification tasks and partitions them into chunked queues, absorbing traffic spikes seamlessly.',
          dataFlow: 'Partitioned Batch Chunk Stream',
        },
        {
          id: '3',
          name: 'Spring Batch Pool',
          role: 'Parallel Worker Threads',
          type: 'worker',
          detail: 'Clustered Spring Batch workers consume chunks concurrently with thread-safe item readers and process orchestration.',
          dataFlow: 'Worker Record Stream',
        },
        {
          id: '3B',
          name: 'Rules Engine & Fuzzy Match',
          role: 'Pre-Submission Screening',
          type: 'worker',
          detail: 'Screens records against compliance rules and reconciles address/identity fields against reference master data using similarity matching before submission.',
          dataFlow: 'Clean Pre-Screened Query',
        },
        {
          id: '4',
          name: 'Central KYC API',
          role: 'Government Registry',
          type: 'gateway',
          detail: 'Authoritative government repository validating ID credentials, document veracity, and citizen compliance records.',
          dataFlow: 'Verified or Ambiguous Match Response',
        },
        {
          id: '4B',
          name: 'Match Confidence Check',
          role: 'Ambiguous Match Resolution',
          type: 'worker',
          detail: 'Automated image-similarity comparison assists resolution of ambiguous identity matches; low-confidence cases escalate to manual review.',
          dataFlow: 'Confidence-Scored Match Output',
        },
        {
          id: '5',
          name: 'PostgreSQL & S3',
          role: 'Idempotent DB + Audit Trail',
          type: 'storage',
          detail: 'Commits verified records to PostgreSQL with optimistic locking; archives immutable compliance audit trails to AWS S3.',
          dataFlow: 'Quarantine Payload on Registry Timeout/Error',
        },
        {
          id: '6',
          name: 'Dead Letter Queue',
          role: 'Failure Isolation & Retries',
          type: 'recovery',
          detail: 'Traps corrupted records and transient timeouts for isolated re-processing without blocking batch throughput.',
        },
      ],
      tradeOff: [
        'Chose Spring Batch with SQS chunk partitioning over Kafka streaming for discrete transactional boundaries and rollback safety.',
        'Chunk-oriented rollback checkpoints guarantee strict audit compliance without cascading whole-batch rollbacks.',
        'Thread-safe partitioned worker pools prevent database connection saturation during peak 300K/hr verification bursts.',
        'Chose fuzzy/similarity-based matching for address reconciliation over exact-match validation, trading a small amount of matching ambiguity for dramatically higher straight-through processing rates against a large, inconsistently formatted reference dataset.',
      ],
      failureModes: [
        'Malformed registry responses intercepted before DB commit and routed to an automated Dead Letter Queue (DLQ).',
        'Poisoned payloads quarantined instantly, preserving 300K/hr batch throughput without halting workers.',
        'Automated exponential backoff with jitter handles transient Central KYC government registry outages.',
        'Ambiguous registry matches are never auto-resolved past a confidence threshold — low-confidence matches are automatically routed to manual review rather than silently accepted, preventing incorrect identity linkage.',
      ],
    },
  },
  {
    id: '04',
    status: 'Prod · Protium Finance',
    title: 'Collateral valuation & workflow platform',
    domain: 'event-driven architecture · dual-portal · vendor network',
    tagline:
      'Event-driven dual-portal platform slashing collateral valuation turnaround from 7 days to 24–48 hours.',
    problem:
      'Physical collateral inspections across 450+ agencies and 150+ branches relied on manual coordination, creating a 7-day turnaround bottleneck for credit approvals.',
    approach:
      'Architected a dual-portal platform with automated workflow orchestration and asynchronous event-driven pipelines built on AWS SQS/SNS and PostgreSQL, replacing manual branch-vendor coordination.',
    outcomeInr: 'Cut turnaround time from 7 days down to 24–48 hours across 450+ vendors.',
    outcomeUsd: 'Cut turnaround time from 7 days down to 24–48 hours across 450+ vendors.',
    figures: [
      { label: 'turnaround', valueInr: '7d → 24–48h', valueUsd: '7d → 24–48h' },
      { label: 'vendor network', valueInr: '450+ Vendors', valueUsd: '450+ Vendors' },
      { label: 'branch reach', valueInr: '150+ Branches', valueUsd: '150+ Branches' },
    ],
    stack: ['Java', 'Spring Boot', 'AWS SQS/SNS', 'PostgreSQL', 'Docker', 'Event-Driven'],
    architecture: {
      summary:
        'Branch staff trigger valuation tasks. A geospatial and workload-aware dispatcher routes assignments to vendor portals via AWS SNS/SQS events with automated SLA escalation.',
      steps: [
        {
          id: '1',
          name: 'Branch Portal',
          role: 'Valuation Task Initiator',
          type: 'client',
          detail: 'Branch loan officers initiate valuation requests with geo-coordinates, property documents, and applicant details.',
          dataFlow: 'Valuation Initiation Event Payload',
        },
        {
          id: '2',
          name: 'Workload Dispatcher',
          role: 'Vendor Match Algorithm',
          type: 'worker',
          detail: 'Calculates optimal inspection agency routing based on geospatial proximity, active capacity, and historical turnaround time.',
          dataFlow: 'Targeted Vendor Event Message',
        },
        {
          id: '3',
          name: 'AWS SNS/SQS',
          role: 'Asynchronous Event Fanout',
          type: 'queue',
          detail: 'Fans out assigned valuation tasks asynchronously, buffering requests to ensure branch systems remain 100% responsive.',
          dataFlow: 'Vendor Portal Task Assignment Push',
        },
        {
          id: '4',
          name: 'Vendor Portal',
          role: 'Mobile/Web Survey Ingestion',
          type: 'client',
          detail: 'Field surveyors conduct on-site inspections, capturing geo-tagged photographs and structural condition reports.',
          dataFlow: 'Signed Inspection Asset Bundle & Hash',
        },
        {
          id: '5',
          name: 'Document Store (S3)',
          role: 'Geo-tagged Media & Valuation PDF',
          type: 'storage',
          detail: 'Validates SHA-256 asset checksums and stores geo-tagged inspection photos and appraisal PDFs in encrypted S3 buckets.',
          dataFlow: 'Verified Inspection Payload',
        },
        {
          id: '5B',
          name: 'PostgreSQL Store',
          role: 'Valuation Record Persistence',
          type: 'storage',
          detail: 'Persists structured valuation reports, property appraisal figures, surveyor metadata, and completed case states into PostgreSQL under ACID transactions.',
          dataFlow: 'SLA Window Breach Warning Trigger',
        },
        {
          id: '6',
          name: 'SLA Escalation Engine',
          role: 'Automated Breach Alerting',
          type: 'recovery',
          detail: 'Tracks real-time survey milestones and triggers automated escalation or reassignment before the 48-hour SLA deadline.',
        },
      ],
      tradeOff: [
        'Decoupled branch and vendor systems with asynchronous AWS SNS/SQS event fanout instead of synchronous REST calls.',
        'Branch staff workflows remain 100% operational even during external vendor portal downtime.',
        'Dynamic workload-aware dispatcher balances tasks across 450+ agencies without central database bottlenecks.',
      ],
      failureModes: [
        'Enforces SHA-256 checksums and GPS metadata validation on survey uploads to prevent fraudulent property inspections.',
        'Automated SLA monitoring escalates stalled inspection tasks and re-routes to backup vendors before breach.',
        'Dead-letter queues capture unparseable mobile survey payloads for manual review without dropping inspection state.',
      ],
    },
  },
  {
    id: '05',
    status: 'Prod · Protium Finance',
    title: 'Dynamic document generation engine',
    domain: 'fintech automation · PDF templating · AWS S3',
    tagline:
      'High-throughput document generation engine rendering 100K+ compliant loan contracts monthly under 800ms.',
    taglineInr:
      'High-throughput document generation engine rendering 1 Lakh+ compliant loan contracts monthly under 800ms.',
    taglineUsd:
      'High-throughput document generation engine rendering 100K+ compliant loan contracts monthly under 800ms.',
    problem:
      'Generating multi-page loan agreements and sanction letters across 150+ branches was slowed by manual drafting, compliance version mismatches, and turnaround delays.',
    approach:
      'Engineered a high-throughput dynamic document generation engine utilizing Java, Spring Boot, asynchronous message-queue-based job dispatch, template-driven PDF rendering, content-verified attachment normalization, and asynchronous AWS S3 archival with digital signature integration.',
    outcomeInr: 'Generates 1 Lakh+ legally compliant loan contracts & sanction letters monthly with sub-second rendering.',
    outcomeUsd: 'Generates 100K+ legally compliant loan contracts & sanction letters monthly with sub-second rendering.',
    figures: [
      { label: 'volume', valueInr: '1 Lakh+ docs/mo', valueUsd: '100K+ docs/mo' },
      { label: 'rendering speed', valueInr: '< 800ms / doc', valueUsd: '< 800ms / doc' },
      { label: 'automation', valueInr: '100% Automated', valueUsd: '100% Automated' },
    ],
    stack: ['Java', 'Spring Boot', 'AWS SQS', 'AWS S3', 'PostgreSQL', 'PDFBox', 'Docker'],
    architecture: {
      summary:
        'Loan origination pipelines trigger document requests with dynamic customer terms. Clustered worker nodes inject dynamic variables into certified legal templates, render encrypted PDFs, compute SHA-256 integrity hashes, and archive files directly to AWS S3 with presigned URL access.',
      steps: [
        {
          id: '1',
          name: 'Origination API',
          role: 'Contract Generation Trigger',
          type: 'client',
          detail: 'Loan approval workflow fires generation request containing applicant profile, loan terms, and repayment schedule.',
          dataFlow: 'Contract Parameters Payload (JSON)',
        },
        {
          id: '1B',
          name: 'Async Dispatch',
          role: 'Message Queue Ingestion',
          type: 'queue',
          detail: 'Decouples document requests from rendering; jobs are queued and picked up by background worker processes, keeping ingestion fast under load.',
          dataFlow: 'Queued Document Generation Jobs',
        },
        {
          id: '2',
          name: 'Template Resolver',
          role: 'Dynamic Clause & Terms Injector',
          type: 'worker',
          detail: 'Selects the exact regulatory legal template version and injects customer variables into XML/HTML template trees.',
          dataFlow: 'Compiled Dynamic Document DOM',
        },
        {
          id: '2B',
          name: 'Format Verification & Fitting',
          role: 'Attachment Normalization',
          type: 'worker',
          detail: 'Verifies each attachment\'s actual content type before processing and normalizes images to standard page dimensions before merging into the final document.',
          dataFlow: 'Verified & Fitted Asset Stream',
        },
        {
          id: '3',
          name: 'PDF Engine (PDFBox)',
          role: 'Sub-second Document Renderer',
          type: 'worker',
          detail: 'Renders high-resolution printable PDF agreements in under 800ms with embedded compliance fonts and page numbering.',
          dataFlow: 'Raw Encrypted PDF Binary Stream',
        },
        {
          id: '4',
          name: 'SHA-256 & Hash Check',
          role: 'Tamper-Proof Digital Verification',
          type: 'gateway',
          detail: 'Generates cryptographic SHA-256 checksum and binds digital signature metadata to guarantee document integrity.',
          dataFlow: 'Encrypted Stream via S3 Presigned URL',
        },
        {
          id: '5',
          name: 'AWS S3 Document Vault',
          role: 'Encrypted Object Archival',
          type: 'storage',
          detail: 'Persists PDF in multi-region encrypted S3 storage and issues secure time-limited presigned URLs for customer download.',
          dataFlow: 'Disbursal Stage Callback Notification',
        },
        {
          id: '6',
          name: 'Disbursal Callback',
          role: 'Downstream Loan Disbursal Trigger',
          type: 'recovery',
          detail: 'Notifies downstream core lending engine that legally compliant contracts are generated and archived, unlocking fund release.',
        },
      ],
      tradeOff: [
        'Adopted asynchronous PDF generation with S3 pre-signed URLs over synchronous binary streaming over HTTP.',
        'Eliminated memory exhaustion and thread pool starvation during month-end contract generation spikes.',
        'Stateless clustered worker nodes scale horizontally across AWS EC2 instances during peak load.',
        'Decoupled document requests from rendering via an asynchronous message queue, so ingestion returns immediately while heavy PDF compilation runs on background workers — preventing request threads from blocking under bulk document-generation load.',
      ],
      failureModes: [
        'Corrupted dynamic parameters trigger automated fallback to certified contingency templates without blocking disbursals.',
        'Field-level validation mismatches logged to OpenSearch with full audit context for instant compliance tracing.',
        'Tamper-proof digital signatures verified via SHA-256 hashes before triggering downstream loan disbursement callbacks.',
        'Verifies each attachment\'s actual file content before processing rather than trusting its declared type or extension, rejecting corrupted or disguised files before they enter the rendering pipeline.',
      ],
    },
  },
];
