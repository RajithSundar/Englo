# Englo Studio

> Plain-English algorithmic reasoning and interactive distributed systems architecture assessment platform built for the **Razorpay Buildathon 2026**.

[![Live App](https://img.shields.io/badge/Live_App-Cloud_Run-4285F4?logo=googlecloud&logoColor=white)](https://englo-studio-95017413334.us-central1.run.app)
[![Docker](https://img.shields.io/badge/Docker-Node_22_Alpine-2496ED?logo=docker&logoColor=white)](Dockerfile)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## Live Deployment & Telemetry

* **Production Web App**: [https://englo-studio-95017413334.us-central1.run.app](https://englo-studio-95017413334.us-central1.run.app)
* **System Health Endpoint**: [https://englo-studio-95017413334.us-central1.run.app/api/health](https://englo-studio-95017413334.us-central1.run.app/api/health)
* **Hosting Platform**: Google Cloud Run (`us-central1`), automated serverless container revision with TLS/HTTPS.
* **AI Engine**: Google Cloud Vertex AI (`gemini-2.5-flash`).

---

## Why Englo?

Traditional coding interviews test whether a candidate remembers language syntax, pointer mechanics, or language-specific boilerplate. In an era where generative AI writes syntax instantly, engineering interviews should evaluate what actually matters at scale: **algorithmic invariants, edge conditions, and distributed systems architecture**.

Instead of writing 150 lines of fragile code, candidates specify their solution in structured English:
1. **Algorithmic Invariant Extractor**: Parses prose or bulleted logic into formal invariant assertions (e.g. balance conservation $\Delta Debit + \Delta Credit = 0$, global lock order to eliminate circular deadlocks, and idempotency guarantees).
2. **Dual-Engine Validation**: Evaluates logic conceptually with Google Cloud Vertex AI (Gemini 2.5 Flash) while enforcing deterministic invariant rules to eliminate LLM hallucinations.
3. **Interactive Topology Canvas**: A drag-and-drop system design workspace where candidates construct multi-tier architectures (clients, edge proxies, compute workers, Redis caches, and distributed SQL ledgers) and stress-test them with real-time **Chaos Surges (50k RPS)**.

---

## System Architecture

```
                                  +-----------------------+
                                  |    Merchant Client    |
                                  |  (React 19 + Vite 6)  |
                                  +-----------+-----------+
                                              |
                                              v
                              +---------------+---------------+
                              |    Express 4.21 Production    |
                              |  (Container on Cloud Run)     |
                              +-------+---------------+-------+
                                      |               |
             +------------------------+               +-----------------------+
             |                                                                |
             v                                                                v
+------------+------------+                                      +------------+------------+
|   Dual Evaluation Core  |                                      |   Razorpay Fintech Hub  |
|                         |                                      |                         |
| * Vertex AI Gemini 2.5  |                                      | * Orders API v1         |
| * Deterministic AST     |                                      | * HMAC-SHA256 Auth      |
| * 42-Vector Test Suite  |                                      | * RazorpayX Payouts     |
+-------------------------+                                      +-------------------------+
```

---

## Razorpay Financial Benchmarks

The studio includes two flagship challenges inspired by Razorpay's financial core:

### 1. `algo-6`: Atomic Double-Entry Ledger Transfer Engine
* **Objective**: Model concurrent account-to-account balance transfers without race conditions.
* **Key Invariants**:
  * **Balance Conservation**: Total system balance must remain strictly invariant across transfers.
  * **Deadlock Elimination**: Distributed locks acquired in deterministic global order ($\min(A,B)$, then $\max(A,B)$).
  * **Idempotent Journaling**: Duplicate webhook retries with identical idempotency keys return cached receipts without re-debiting.
  * **Integer Cents Precision**: All calculations handled in minor currency units (paise) to eradicate IEEE-754 floating-point errors.

### 2. `sys-6`: High-Throughput Payment Gateway & Idempotency Engine
* **Objective**: Architect an end-to-end payment gateway handling 10,000+ req/s with five-nines availability.
* **Key Invariants**:
  * **Distributed Mutex**: In-memory Redis cluster acquires atomic idempotency locks (`SET NX EX`) on `Idempotency-Key`.
  * **Circuit Breakers**: Traffic automatically diverts to secondary banking aggregators if bank latency exceeds 5 seconds.
  * **Reliable Webhooks**: Asynchronous worker queues dispatch merchant notifications with exponential backoff and Dead-Letter Queues (DLQs).

---

## Quickstart: Run Locally

### Option A: Using Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/RajithSundar/Englo.git
cd Englo

# 2. Build the production container
docker build -t englo-studio .

# 3. Run the container
docker run -p 8080:8080 -e PORT=8080 englo-studio
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

---

### Option B: Using Node.js

```bash
# 1. Clone the repository
git clone https://github.com/RajithSundar/Englo.git
cd Englo

# 2. Install dependencies
npm install

# 3. Build client and server bundles
npm run build

# 4. Start the production server
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

For local development with Hot Module Replacement (HMR):
```bash
npm run dev
```

---

## What Broke at 2 AM, and How We Got Out

Building an AI-assisted evaluation engine for financial systems revealed real engineering hurdles:

### 1. The Generative LLM Hallucination Trap
* **The Problem**: Initially, we passed English descriptions directly into a raw LLM prompt. Under subtle edge cases (e.g. self-transfers where Account $A = B$, or zero-rupee authorization probes), the model suffered from non-deterministic drift and occasionally gave passing grades to mathematically flawed solutions.
* **How We Got Out**: We decoupled the evaluation architecture. We implemented a deterministic AST invariant parser that strictly verifies balance conservation ($\Delta Debit == \Delta Credit$) and integer type assertions first. If mathematical invariants fail, the request is rejected immediately before the LLM can hallucinate. Google Cloud Vertex AI (Gemini 2.5 Flash) is only utilized for semantic synthesis of unstructured prose.

### 2. Concurrent Webhook Retries & Idempotency Race Conditions
* **The Problem**: During synthetic chaos tests, clients re-submitted transactions before the initial database write finished, creating duplicate journal entries.
* **How We Got Out**: We introduced an atomic check-and-set idempotency ledger that locks on `req.headers['idempotency-key']`. Secondary incoming requests with an in-flight key are queued or return the cached receipt, eliminating double-debit vulnerabilities.

### 3. Google Cloud Build IAM Storage Permissions
* **The Problem**: Automating the deployment of our Docker container via Google Cloud Build resulted in HTTP 403 errors when the Compute Engine default service account was blocked from fetching the source zip from `run-sources-*` buckets due to updated GCP least-privilege policies.
* **How We Got Out**: We audited the Cloud IAM policy bindings and programmatically granted `roles/storage.admin`, `roles/artifactregistry.writer`, and `roles/logging.logWriter` to the build service account, enabling zero-touch continuous deployment to Google Cloud Run.

---

## Security & Verification Standards

* **Razorpay HMAC-SHA256 Authentication**: Payment orders generated via the Orders API are cryptographically verified using server-side HMAC-SHA256 signatures with constant-time equality comparisons (`crypto.timingSafeEqual`) to prevent timing attacks.
* **Unprivileged Container Runtime**: The production Docker container executes under a non-root `node` user with a stripped minimal Alpine Linux image.
* **Zero Credential Leaks**: All secrets, service account keys, and environment files are managed strictly through runtime environment injection and excluded via `.gitignore`.

---

## Tech Stack

* **Frontend**: React 19, TypeScript 5.8, Tailwind CSS v4, Motion 12, `@xyflow/react` v12, Lucide Icons.
* **Backend**: Node.js, Express 4.21, esbuild, Google Cloud Vertex AI SDK (`@google-cloud/vertexai`), Razorpay SDK.
* **Infrastructure**: Google Cloud Run, Cloud Build, Docker (Node 22 Alpine).

---

## License

This project is licensed under the [MIT License](LICENSE).
