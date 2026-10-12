# AutoQ - Next-Gen Test Automation & Orchestration Platform

An interactive UX prototype and architectural specification built for engineering leadership and stakeholder review, implementing a from-scratch test automation module integrated with Kyxo and DevTools.

---

## 🌟 Key Prototype Features & Screens

1. **Dashboard (`screen-dashboard`)**
   - High-level KPIs: Pass rates, parallel sharded execution duration savings, AI self-healed test tally, Kyxo requirement traceability coverage.
   - Recent orchestrated runs table (GitHub Actions CI/CD, DevTools Chat, Manual UI runs).
   - Automated 4-way failure classification distribution.

2. **Test Library & Suites (`screen-library`)**
   - Hierarchical test cases linked to Kyxo requirements (`REQ-885`, `REQ-890`, etc.) and parent Epics/Modules (`KYX-EPIC-01`).
   - Filter by **Module & Epic** (Checkout & Payments, Identity & Auth, Storefront, Orders) with interactive module scope banner and 1-click **"Run Entire Module"** button.
   - Multi-select batch runner across Azure Kata sandboxes.
   - Filter by suite (Smoke, Regression, Payments) and engine (Playwright, Cypress, Selenium).

3. **Test Case Detail (`screen-detail`)**
   - End-to-end traceability chain: *Epic / Module → Requirement → Test Case (Centre) → Automation Script → Git Repo Commit*.
   - Tabbed view: Real TypeScript Playwright code, manual human steps, and injected KeyVault secrets.
   - Historical run performance & artifact lake tags (Traces, Screenshots, Video, HAR).

4. **AI Authoring Studio (`screen-authoring`)**
   - Split-view DevTools chat panel: Conversational natural language authoring.
   - Natural language module testing (*"Test the entire Checkout & Payments module"*).
   - Live code editor with interactive quick prompt chips (*"Write password reset test"*, *"Generate coupon boundary cases"*, *"✨ Create requirement for Apple Pay"*).
   - In-studio *"Run in Azure Sandbox"* button: spins up ephemeral Kata container and prints real-time Playwright execution logs.
   - Direct Git commit integration.

5. **Run Builder & Orchestrator (`screen-run-builder`)**
   - **Scope Selection Modes:** Toggle between *"By Suite Tags"* and *"By Feature / Module / Epic (Whole System)"*.
   - Module Grid Cards: Checkout & Payments (42 tests), Identity & Auth (34 tests), Storefront (58 tests), Orders (26 tests).
   - Dynamic Underlying Requirements Preview: Automatically resolves all linked upstream requirements.
   - CLI & CI/CD Ingress preview: `autoq run --module "Checkout & Payments" --shards 4 --env staging`.
   - Interactive slider for Azure Sandbox worker shards (1 to 16 Kata containers on AKS).
   - Dynamic execution time estimator (e.g. 400s serial down to ~1m 40s parallel).
   - Target environment selector (Staging, Dev, Canary) with Azure KeyVault injection.

6. **Execution & Sandboxes Cluster (`screen-results`)**
   - Live sharded execution visualizer: Dynamic pod cards with per-pod test streams.
   - Displays Module / Epic subtitle and orchestrator log resolution: Module → Requirements → Automated Tests → Shards.
   - Real-time unified log stream console.
   - Interactive failure inspection link leading directly into AI Triage.

7. **AI Failure Triage & Self-Healing (`screen-triage`)**
   - Automated root cause classification (Outdated Test vs Real Product Bug vs Environment Issue).
   - Visual Playwright trace snapshot mockup highlighting renamed DOM elements.
   - Unified Git Diff viewer with proposed code patch.
   - Human-in-the-loop approval: *"Approve & Push Git PR"* button.

8. **System Architecture Blueprint (`screen-architecture`)**
   - 4-Tier Interactive System Topology: UI Layer, Core Services, Pluggable Engine Adapters, Elastic Azure Execution Layer.
   - All 12 Architectural Decisions with detailed justifications, emphasizing Hierarchical Traceability (Epic → Requirement → Test Case → Git Code).

---

## 🚀 How to Run Locally

You can simply open `index.html` in any web browser, or serve it with Python / Node:

```powershell
# Using Python
python -m http.server 3000

# Using Node npx
npx serve .
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
