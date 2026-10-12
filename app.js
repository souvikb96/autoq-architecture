/**
 * AutoQ Test Automation Platform - Interactive UX Prototype Logic
 * Fully interactive prototype passing variables (Engine, Shards, Environment, Tags)
 * seamlessly across all views and powering the AI Copilot.
 */

// State Management
const state = {
  currentScreen: 'dashboard',
  selectedTests: new Set(),
  activeDetailTab: 'script',
  activeFailureId: 1,
  runInProgress: false,
  runTimer: null,
  podLogInterval: null,
  completedRuns: 1042,

  // Global Dynamic Variables (Pass value across the whole UI)
  currentEngine: 'playwright', // 'playwright' | 'cypress' | 'selenium'
  shardCount: 4,               // 1 to 16
  targetEnv: 'staging',        // 'staging' | 'dev' | 'prod'
  currentReq: 'REQ-890',
  currentReqTitle: 'Checkout Voucher Discount & 3DS Gateway',
  currentTags: ['@smoke', '@regression', '@e2e'],
  currentTestName: 'Verify 3DS Payment Authorization flow',
  selectedScopeTestsCount: 42,

  // Architecture Showcase State
  activeArchTab: 'flow',
  activeFlowExample: 'pr',
  isFlowSimulating: false,
  flowSimTimer: null,
  flowCurrentStep: 1,
  activeDecisionsCategory: 'all',

  // Feature / Module / Epic Testing Data Model
  runScopeMode: 'module',      // 'tags' | 'module'
  selectedModuleId: 'payments',
  filteredLibraryModule: 'all',
  modules: [
    {
      id: 'payments',
      name: 'Checkout & Payments',
      epicKey: 'KYX-EPIC-01',
      icon: '🛒',
      description: 'Voucher engine, cart checkout, 3DS gateway & Apple Pay',
      requirements: ['REQ-890', 'REQ-896', 'REQ-892'],
      testCount: 42,
      passRate: '98%'
    },
    {
      id: 'auth',
      name: 'Identity & Authentication',
      epicKey: 'KYX-EPIC-02',
      icon: '🔐',
      description: 'Okta SSO, corporate OAuth2, password reset & MFA security',
      requirements: ['REQ-885'],
      testCount: 34,
      passRate: '100%'
    },
    {
      id: 'catalog',
      name: 'Storefront & Catalog',
      epicKey: 'KYX-EPIC-03',
      icon: '🏬',
      description: 'Product listing, tiered currency exchange, search & facet filtering',
      requirements: ['REQ-870', 'REQ-872'],
      testCount: 58,
      passRate: '95%'
    },
    {
      id: 'orders',
      name: 'Orders & Invoicing',
      epicKey: 'KYX-EPIC-04',
      icon: '🧾',
      description: 'Automated ERP invoice PDF generation, webhook sync & order tracking',
      requirements: ['REQ-895'],
      testCount: 26,
      passRate: '96%'
    }
  ],

  // Upstream & In-App Requirements Store
  requirements: [
    {
      id: 'REQ-885',
      title: 'SSO & OAuth2 Corporate Authentication',
      domain: 'Auth',
      priority: 'P0 - Blocker',
      story: 'As a corporate employee, I want to authenticate via corporate Okta SSO so that I can access internal tools securely without re-entering passwords.',
      criteria: 'Given employee has active Okta session, When user navigates to portal, Then user is logged in automatically.'
    },
    {
      id: 'REQ-890',
      title: 'Checkout Voucher Discount & 3DS Gateway',
      domain: 'Payments',
      priority: 'P0 - Blocker',
      story: 'As an online customer, I want to apply promotional voucher codes and authenticate via 3D Secure bank challenge.',
      criteria: 'Given valid coupon AUTUMN20, When applied at checkout, Then subtotal discounts by 20% and 3DS authorization succeeds.'
    },
    {
      id: 'REQ-892',
      title: 'Multi-Currency Dynamic Pricing Rules',
      domain: 'Pricing',
      priority: 'P1 - High',
      story: 'As an international shopper, I want to view prices and pay in my local currency.',
      criteria: 'Given user IP in UK, When browsing catalog, Then currency renders in GBP with live exchange rate.'
    },
    {
      id: 'REQ-895',
      title: 'Automated PDF Invoice & Webhook Dispatch',
      domain: 'Orders',
      priority: 'P1 - High',
      story: 'As an enterprise buyer, I want automated PDF invoices dispatched to my billing email.',
      criteria: 'Given completed purchase, When order status is PAID, Then invoice PDF webhook triggers to ERP within 5s.'
    }
  ]
};

// Mock Test Library Data with Module & Epic Hierarchy
const testLibrary = [
  {
    id: 'TC-101',
    name: 'User Login with Valid Corporate Credentials',
    moduleId: 'auth',
    moduleName: 'Identity & Auth',
    epicKey: 'KYX-EPIC-02',
    requirement: { id: 'REQ-885', title: 'SSO & OAuth2 Authentication' },
    engine: 'Playwright',
    scriptPath: 'tests/e2e/auth-login.spec.ts',
    suite: 'smoke',
    tags: ['@smoke', '@auth', '@p0'],
    lastStatus: 'passed',
    duration: '1.2s'
  },
  {
    id: 'TC-102',
    name: 'Password Masking & Brute Force Lockout Rate Limit',
    moduleId: 'auth',
    moduleName: 'Identity & Auth',
    epicKey: 'KYX-EPIC-02',
    requirement: { id: 'REQ-885', title: 'SSO & OAuth2 Authentication' },
    engine: 'Playwright',
    scriptPath: 'tests/e2e/auth-security.spec.ts',
    suite: 'regression',
    tags: ['@regression', '@security'],
    lastStatus: 'passed',
    duration: '0.8s'
  },
  {
    id: 'TC-104',
    name: 'Secure Checkout with Promo Code & 3D Secure',
    moduleId: 'payments',
    moduleName: 'Checkout & Payments',
    epicKey: 'KYX-EPIC-01',
    requirement: { id: 'REQ-890', title: 'Checkout Voucher Discount & 3DS' },
    engine: 'Playwright',
    scriptPath: 'tests/e2e/checkout-promo.spec.ts',
    suite: 'smoke',
    tags: ['@smoke', '@e2e-checkout', '@p0'],
    lastStatus: 'passed',
    duration: '1.8s'
  },
  {
    id: 'TC-105',
    name: 'Checkout Button Click and Cart Summary Re-render',
    moduleId: 'payments',
    moduleName: 'Checkout & Payments',
    epicKey: 'KYX-EPIC-01',
    requirement: { id: 'REQ-890', title: 'Checkout Voucher Discount & 3DS' },
    engine: 'Playwright',
    scriptPath: 'tests/e2e/checkout.spec.ts',
    suite: 'regression',
    tags: ['@regression', '@e2e-checkout'],
    lastStatus: 'failed',
    duration: '5.2s'
  },
  {
    id: 'TC-110',
    name: 'Apply Tiered Promo Voucher AUTUMN20 Calculation',
    moduleId: 'payments',
    moduleName: 'Checkout & Payments',
    epicKey: 'KYX-EPIC-01',
    requirement: { id: 'REQ-892', title: 'Tiered Pricing Engine' },
    engine: 'Playwright',
    scriptPath: 'tests/e2e/promo-rules.spec.ts',
    suite: 'regression',
    tags: ['@regression', '@pricing'],
    lastStatus: 'passed',
    duration: '1.1s'
  },
  {
    id: 'TC-120',
    name: 'Generate Order Confirmation PDF Invoice & Webhook',
    moduleId: 'orders',
    moduleName: 'Orders & Invoicing',
    epicKey: 'KYX-EPIC-04',
    requirement: { id: 'REQ-895', title: 'Invoice & ERP Synchronization' },
    engine: 'Cypress',
    scriptPath: 'cypress/e2e/invoice-pdf.cy.ts',
    suite: 'regression',
    tags: ['@regression', '@invoicing'],
    lastStatus: 'passed',
    duration: '2.4s'
  }
];

// ==========================================================================
// ARCHITECTURE DATA MODELS: 7-STEP FLOW SCENARIOS, 4-TIER BLUEPRINT SPECS & DECISIONS
// ==========================================================================

// Real-World Execution Flow Scenarios (GitHub PR #408, DevTools AI Chat, Nightly Cron)
const flowScenarios = {
  pr: {
    id: 'pr',
    badge: 'GitHub Pull Request Event',
    badgeClass: 'badge-trigger-gh font-mono',
    title: 'Scenario: PR #408 on feature/checkout-promo -> Automated Smoke & Regression',
    duration: 'Total Duration: 1m 38s (4 Shards)',
    desc: 'Developer pushes commit <span class="code-pill font-mono">e8f4a12</span> modifying checkout promo voucher handling. AutoQ intercepts the webhook, dynamically discovers 42 tests across 3 requirements in Module <strong>Checkout & Payments</strong>, and provisions 4 parallel Kata Sandboxes on AKS.',
    steps: {
      1: {
        num: 'STEP 1 OF 7',
        title: 'Ingress Trigger: GitHub Actions Webhook Interception',
        sub: 'Webhook / API',
        nodeTiming: '120ms',
        latency: '< 150ms',
        desc: 'The application developer creates PR #408 on GitHub. A GitHub Actions workflow webhook emits an authenticated JSON payload with HMAC SHA-256 signature to the AutoQ Unified Orchestrator API endpoint.',
        components: ['GitHub Webhooks Gateway', 'AutoQ Unified Ingress Controller', 'HMAC-SHA256 Verifier', 'Azure API Management (APIM)'],
        guarantee: '⚡ <strong>Idempotency:</strong> Duplicate webhooks with the same commit SHA and delivery ID are deduplicated via Redis cache, guaranteeing zero duplicate sandbox boots.',
        codeType: 'application/json',
        code: `{
  "event": "pull_request.opened",
  "repository": "company/web-storefront",
  "pr_number": 408,
  "commit_sha": "e8f4a12",
  "branch": "feature/checkout-promo",
  "target_env": "staging",
  "author": "souvik.b@company.internal",
  "autoq_trigger": {
    "scope_mode": "module",
    "target_module": "payments",
    "requested_shards": 4
  }
}`
      },
      2: {
        num: 'STEP 2 OF 7',
        title: 'Scope Resolution: Dynamic Module & Requirement Mapping',
        sub: 'Module & Reqs',
        nodeTiming: '85ms',
        latency: '< 100ms',
        desc: 'The Orchestrator queries the Kyxo STLC schema. It discovers Module "Checkout & Payments" contains 3 requirements (REQ-890, REQ-896, REQ-892) mapping to 42 test cases across @smoke and @regression tags.',
        components: ['AutoQ STLC Resolver', 'PostgreSQL Metadata Store', 'Kyxo API Connector', 'Test Case Indexer'],
        guarantee: '🔄 <strong>Zero Tag Drift:</strong> Tests are selected by their living requirement hierarchy, eliminating broken static tag lists inside git branches.',
        codeType: 'application/json',
        code: `{
  "resolved_module": "payments",
  "epic_key": "KYX-EPIC-01",
  "linked_requirements": ["REQ-890", "REQ-896", "REQ-892"],
  "total_tests_discovered": 42,
  "breakdown": {
    "smoke_p0": 12,
    "regression_p1": 24,
    "boundary_p2": 6
  },
  "target_engine": "playwright",
  "allocated_shards": 4
}`
      },
      3: {
        num: 'STEP 3 OF 7',
        title: 'Elastic Sharding: Workload Distribution Algorithm',
        sub: '4 Parallel Slices',
        nodeTiming: '40ms',
        latency: '< 50ms',
        desc: 'AutoQ shards the 42 tests across 4 execution slices using runtime-weighted bin-packing (based on historical p95 execution duration) to achieve optimal parallel finish times.',
        components: ['Bin-Packing Shard Planner', 'Redis Distributed Queue', 'Historical Duration Matrix', 'Workload Slicer'],
        guarantee: '⚖️ <strong>Balanced Wall Clock:</strong> Shards finish within ±5 seconds of each other, avoiding the "long-tail bottleneck" common in naive modulo sharding.',
        codeType: 'application/json',
        code: `{
  "shard_allocation": [
    { "shard_id": 1, "tests": 11, "est_runtime": "1m 32s", "focus": "REQ-890 Checkout Voucher" },
    { "shard_id": 2, "tests": 10, "est_runtime": "1m 35s", "focus": "REQ-896 Apple Pay Biometric" },
    { "shard_id": 3, "tests": 11, "est_runtime": "1m 28s", "focus": "REQ-892 Multi-Currency" },
    { "shard_id": 4, "tests": 10, "est_runtime": "1m 34s", "focus": "Checkout 3DS Boundary" }
  ]
}`
      },
      4: {
        num: 'STEP 4 OF 7',
        title: 'Kata Sandboxes: Hardware MicroVM Provisioning',
        sub: 'AKS Warm Pods',
        nodeTiming: '1.8s',
        latency: '< 2.5s',
        desc: 'AutoQ claims 4 pre-warmed pods from the Azure AKS Kata Containers pool. Each pod executes inside a dedicated lightweight QEMU hypervisor guest kernel with strict hardware boundaries.',
        components: ['Azure AKS Cluster (East US)', 'Kata Containers (QEMU Runtime)', 'Pre-warmed Pod Pool', 'Kubernetes CRI containerd'],
        guarantee: '🛡️ <strong>Total VM Isolation:</strong> No shared kernel with host node. Crash, memory leak, or rogue browser process cannot penetrate neighboring test containers.',
        codeType: 'yaml',
        code: `apiVersion: v1
kind: Pod
metadata:
  name: autoq-shard-kata-01
  labels:
    tier: test-sandbox
    engine: playwright
spec:
  runtimeClassName: kata-qemu
  containers:
  - name: runner
    image: mcr.microsoft.com/autoq/playwright-runner:1.48
    resources:
      limits: { cpu: "2000m", memory: "4Gi" }
      requests: { cpu: "1000m", memory: "2Gi" }`
      },
      5: {
        num: 'STEP 5 OF 7',
        title: 'Secrets Injection: Zero-Trust Runtime Memory Ingress',
        sub: 'Azure KeyVault',
        nodeTiming: '310ms',
        latency: '< 500ms',
        desc: 'The orchestrator accesses Azure KeyVault via Managed Identity and injects environment credentials (STAGING_APP_KEY, TEST_USER_PASSWORD) directly into container process memory.',
        components: ['Azure KeyVault', 'Azure Managed Identity (OIDC)', 'Secret Decryption Broker', 'In-Memory Env Injector'],
        guarantee: '🔒 <strong>Zero Disk Exposure:</strong> Secrets never touch disk or Git. Process terminates with memory flush, rendering credential harvesting impossible.',
        codeType: 'bash',
        code: `# Runtime In-Memory Environment Injection (No secrets on disk)
export APP_BASE_URL="https://staging.internal.app"
export VOUCHER_SERVICE_KEY="$(vault.getSecret 'STAGING_VOUCHER_KEY')"
export TEST_USER_PASS="$(vault.getSecret 'STAGING_TEST_PASSWORD')"
export CI_EXECUTION_ID="run-1043-shard-1"

# Verify shallow git checkout
git clone --depth 1 --branch feature/checkout-promo https://github.com/company/web-storefront.git`
      },
      6: {
        num: 'STEP 6 OF 7',
        title: 'Engine Execution: High-Speed Headless Browser Testing',
        sub: 'Playwright TS',
        nodeTiming: '~1m 30s',
        latency: 'Wall clock ~90s',
        desc: 'The pluggable Playwright adapter launches headless Chromium via Chrome DevTools Protocol (CDP). Runs deterministic TypeScript tests with auto-waiting, capturing network HAR and zip traces.',
        components: ['Playwright Adapter (CDP)', 'Headless Chromium 130', 'AutoQ Assertion Interceptor', 'Live Telemetry Streamer'],
        guarantee: '💲 <strong>$0 Token Fee on Regression:</strong> Tests run as plain compiled code. AI was only used during authoring; 100% of execution is deterministic code.',
        codeType: 'typescript',
        code: `// tests/e2e/checkout-promo.spec.ts (Executed in Kata Sandbox)
import { test, expect } from '@playwright/test';

test.describe('Checkout Voucher Discount (REQ-890)', () => {
  test('TC-104: Apply 20% discount coupon and verify subtotal', async ({ page }) => {
    await page.goto(process.env.APP_BASE_URL + '/checkout');
    await page.getByPlaceholder('Promo Code').fill('AUTUMN20');
    await page.getByRole('button', { name: 'Apply' }).click();
    
    // Auto-waiting role assertion
    await expect(page.getByTestId('discount-badge')).toContainText('20% OFF');
    await expect(page.getByTestId('cart-subtotal')).toHaveText('$79.99');
  });
});`
      },
      7: {
        num: 'STEP 7 OF 7',
        title: 'Artifact Lake & AI Triage: Automated Failure Classification',
        sub: 'Traces & Diff',
        nodeTiming: '1.2s',
        latency: '< 2.0s',
        desc: 'Output is normalized to standard AutoQ JSON. Videos and trace.zip upload to Azure Blob Storage. For failures, the AI triage pipeline compares DOM diffs to classify Product Bug vs DOM Change.',
        components: ['Azure Blob Storage (.webm/traces)', 'AI Failure Triager (Gemini/Claude)', 'Normalized JSON Reporter', 'GitHub PR Status Check API'],
        guarantee: '🎯 <strong>Human-in-the-Loop PR:</strong> Outdated selectors generate an auto-repaired Git PR diff. Developers click Approve to merge without broken builds.',
        codeType: 'application/json',
        code: `{
  "run_summary": {
    "total_tests": 42,
    "passed": 41,
    "failed": 1,
    "flaky": 0,
    "wall_clock": "1m 38s",
    "artifacts_lake": "https://storage.blob.core.windows.net/autoq-runs/1043/"
  },
  "ai_triage_verdict": {
    "failed_test": "TC-105",
    "classification": "OUTDATED_TEST_DOM_CHANGED",
    "confidence": "99.4%",
    "action_taken": "Generated Git PR #892 with self-healed locator for human review"
  }
}`
      }
    }
  },

  chat: {
    id: 'chat',
    badge: 'DevTools AI Copilot Prompt',
    badgeClass: 'badge-accent font-mono',
    title: 'Scenario: DevTools AI Chat Trigger: Prompt-to-Execution Suite for Apple Pay & Biometrics',
    duration: 'Total Duration: 24s (2 Shards)',
    desc: 'QA engineer prompts in DevTools Chat: <em>"Create new requirement for Apple Pay one-click checkout and generate test suite in Playwright"</em>. AutoQ compiles criteria into Kyxo, writes deterministic TypeScript code, and executes in ephemeral Kata sandbox.',
    steps: {
      1: {
        num: 'STEP 1 OF 7',
        title: 'Ingress Trigger: DevTools Chat Natural Language Prompt',
        sub: 'WebSocket Ingress',
        nodeTiming: '45ms',
        latency: '< 80ms',
        desc: 'User types prompt into DevTools AI Studio. WebSocket frame is streamed to the AutoQ conversational agent with active session context (active module, target environment, chosen engine).',
        components: ['DevTools AI Chatbot', 'WebSocket Session Multiplexer', 'Context Ribbon Injector', 'Prompt Normalizer'],
        guarantee: '⚡ <strong>Stateful Context:</strong> Chat automatically inherits active environment (Staging), active engine (Playwright), and current test tags.',
        codeType: 'application/json',
        code: `{
  "channel": "devtools_chat_ws",
  "session_id": "ses-8491-autoq",
  "user_prompt": "Create new requirement for Apple Pay one-click checkout and generate test suite in Playwright",
  "active_context": {
    "module": "payments",
    "engine": "playwright",
    "env": "staging",
    "default_shards": 2
  }
}`
      },
      2: {
        num: 'STEP 2 OF 7',
        title: 'Requirement Generation & Kyxo STLC Registration',
        sub: 'Kyxo STLC Sync',
        nodeTiming: '180ms',
        latency: '< 300ms',
        desc: 'AI synthesizes prompt into formal requirement REQ-896 (One-Click Apple Pay & Biometric Checkout) with user story and Gherkin acceptance criteria, creating an unbroken STLC link.',
        components: ['LLM Requirement Synthesizer', 'Kyxo API Bi-directional Sync', 'PostgreSQL STLC Database', 'Jira Issue Creator'],
        guarantee: '📋 <strong>Structured Governance:</strong> Ad-hoc chat prompt instantly transforms into an enterprise-grade Kyxo requirement with Given/When/Then acceptance criteria.',
        codeType: 'application/json',
        code: `{
  "created_requirement": {
    "id": "REQ-896",
    "title": "One-Click Apple Pay & Biometric Checkout",
    "domain": "Payments",
    "priority": "P0 - Blocker",
    "epic": "KYX-EPIC-01",
    "criteria": "Given user on iOS Safari, When tapping Apple Pay button, Then biometric sheet opens and returns token within 2s."
  }
}`
      },
      3: {
        num: 'STEP 3 OF 7',
        title: 'Deterministic Code Synthesis: Multi-Scenario Generation',
        sub: 'Playwright Code',
        nodeTiming: '320ms',
        latency: '< 500ms',
        desc: 'AI writes production-grade TypeScript test suite covering Happy Path (TC-301), Fallback on Android/Chrome (TC-302), and Sheet Dismissal (TC-303). Employs accessible getByRole locators.',
        components: ['AST Code Generator', 'Playwright Best Practices Validator', 'Linter & Syntax Checker', 'Studio Code Canvas'],
        guarantee: '✍️ <strong>Code Written Once:</strong> Stored directly as a TypeScript file. Subsequent regression runs execute without any LLM token costs or hallucinations.',
        codeType: 'typescript',
        code: `// Generated Suite: tests/e2e/apple-pay-checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Apple Pay Biometric Authorization (REQ-896)', () => {
  test('TC-301: Happy Path Apple Pay FaceID Authorization', async ({ page }) => {
    await page.goto(process.env.APP_BASE_URL + '/checkout');
    const applePayBtn = page.getByRole('button', { name: /Buy with Apple Pay/i });
    await expect(applePayBtn).toBeVisible();
    await applePayBtn.click();
    await expect(page.getByTestId('order-confirmation-badge')).toBeVisible();
  });
});`
      },
      4: {
        num: 'STEP 4 OF 7',
        title: 'Kata Sandbox Provisioning: Interactive Test Run',
        sub: '2 Kata Pods',
        nodeTiming: '1.2s',
        latency: '< 2.0s',
        desc: 'Orchestrator provisions 2 Kata Sandboxes on AKS to run an immediate verification pass of the newly generated test suite.',
        components: ['Azure AKS Kata Pool', 'MicroVM Manager', 'Ephemeral Runner Pods', 'Orchestration Broker'],
        guarantee: '🔒 <strong>Safe Sandbox Verification:</strong> Test is executed in a dedicated hardware microVM before any code is committed to Git repository.',
        codeType: 'bash',
        code: `[AutoQ Orchestrator] Attached pre-warmed pod: azure-aks-playwright-runner-02 (0.7s)
[Kata-Sandbox] Guest Linux kernel 6.8 booting QEMU microVM... OK
[Kata-Sandbox] CPU: 2 Cores | RAM: 4096MB | Network: Isolated Bridge`
      },
      5: {
        num: 'STEP 5 OF 7',
        title: 'Staging Secrets & Target Environment Injection',
        sub: 'Staging KeyVault',
        nodeTiming: '210ms',
        latency: '< 350ms',
        desc: 'In-memory injection of Staging environment Apple Pay test merchant credentials and bearer tokens directly from Azure KeyVault.',
        components: ['Azure KeyVault', 'OIDC Managed Identity', 'Env Injector', 'Merchant ID Broker'],
        guarantee: '🛡️ <strong>Zero Stored Keys:</strong> Merchant identifiers and test card credentials are never present in prompt text or chat history.',
        codeType: 'bash',
        code: `export APPLE_PAY_MERCHANT_ID="merchant.company.staging"
export STRIPE_TEST_KEY="$(keyvault.get 'STAGING_STRIPE_SECRET')"
export APP_BASE_URL="https://staging.internal.app"`
      },
      6: {
        num: 'STEP 6 OF 7',
        title: 'Sandboxed Verification Run: 3 Tests Executed',
        sub: 'Headless Browser',
        nodeTiming: '18s',
        latency: 'Wall clock 18s',
        desc: 'Headless Chromium container executes TC-301, TC-302, and TC-303. Console output streams in real-time to the DevTools Studio terminal.',
        components: ['Headless Chromium Runner', 'CDP Streamer', 'DevTools Terminal Log', 'Test Reporter'],
        guarantee: '✅ <strong>100% Pass Rate:</strong> Real test execution verifies that locators, waits, and assertions match staging DOM before developer review.',
        codeType: 'bash',
        code: `✓ TC-301: Happy Path Apple Pay FaceID Authorization (1.4s)
✓ TC-302: Fallback to Standard Card Form on Android/Chrome (1.1s)
✓ TC-303: User Dismisses Apple Pay Sheet (0.9s)

3 passed (3.4s execution, 18s total pod lifecycle)`
      },
      7: {
        num: 'STEP 7 OF 7',
        title: 'Git Commit & STLC Synchronization',
        sub: 'Git Sync & Toast',
        nodeTiming: '290ms',
        latency: '< 400ms',
        desc: 'User clicks "Commit to Git". AutoQ commits script to branch feature/req-896-automation, attaches test cases to Kyxo, and updates Test Library.',
        components: ['Git Push Gateway', 'Kyxo STLC Linker', 'Test Library Store', 'Toast Notification System'],
        guarantee: '🐙 <strong>Version Controlled:</strong> Test code is saved directly in Git repository with automated peer review workflow.',
        codeType: 'application/json',
        code: `{
  "git_commit": {
    "branch": "feature/req-896-automation",
    "commit_sha": "a4f89d1",
    "files": ["tests/e2e/apple-pay-checkout.spec.ts"],
    "linked_kyxo_req": "REQ-896"
  },
  "status": "READY_FOR_PR_MERGE"
}`
      }
    }
  },

  cron: {
    id: 'cron',
    badge: 'Azure Event Grid Cron (02:00 UTC)',
    badgeClass: 'badge-warning font-mono',
    title: 'Scenario: Nightly Scheduled Regression: Full Platform Matrix across 4 Modules',
    duration: 'Total Duration: 2m 45s (8 Shards)',
    desc: 'Nightly cron trigger fires at 02:00 UTC. AutoQ schedules all 184 tests across 4 modules (Checkout, Auth, Catalog, Orders) across 8 AKS Kata sandboxes, compiling cross-browser matrices and flakiness trends.',
    steps: {
      1: {
        num: 'STEP 1 OF 7',
        title: 'Ingress Trigger: Scheduled Event Grid Cron Dispatch',
        sub: 'Cron Event',
        nodeTiming: '25ms',
        latency: '< 50ms',
        desc: 'Azure Event Grid emits a scheduled cron trigger at 02:00 UTC. The AutoQ orchestrator validates schedule authorization and creates a new Nightly Regression Run ID.',
        components: ['Azure Event Grid', 'AutoQ Cron Ingress Service', 'Schedule Rule Evaluator', 'Run Registry'],
        guarantee: '⏰ <strong>Automated Zero-Touch:</strong> Executes automatically without developer or QA team intervention.',
        codeType: 'application/json',
        code: `{
  "trigger_type": "scheduled_cron",
  "schedule_rule": "0 2 * * * (02:00 UTC Daily)",
  "job_name": "nightly-full-regression-matrix",
  "target_env": "staging",
  "modules": ["payments", "auth", "catalog", "orders"],
  "requested_shards": 8
}`
      },
      2: {
        num: 'STEP 2 OF 7',
        title: 'Full System Scope Resolution: 184 Test Cases Aggregated',
        sub: 'All 4 Modules',
        nodeTiming: '110ms',
        latency: '< 150ms',
        desc: 'STLC mapper aggregates all active requirements across the 4 core business modules: Payments (42 tests), Auth (34 tests), Catalog (58 tests), Orders (26 tests) = 184 total tests.',
        components: ['STLC Module Aggregator', 'Kyxo Living Database', 'Flakiness History Analyzer', 'Cross-Browser Matrix Planner'],
        guarantee: '📊 <strong>100% Platform Coverage:</strong> Every active requirement across the entire product ecosystem is verified in the nightly regression safety net.',
        codeType: 'application/json',
        code: `{
  "total_modules": 4,
  "total_requirements": 14,
  "total_tests": 184,
  "test_breakdown": {
    "Checkout & Payments": 42,
    "Identity & Authentication": 34,
    "Storefront & Catalog": 58,
    "Orders & Invoicing": 26
  }
}`
      },
      3: {
        num: 'STEP 3 OF 7',
        title: '8-Shard Workload Bin-Packing with History Weighting',
        sub: '8 Parallel Shards',
        nodeTiming: '55ms',
        latency: '< 80ms',
        desc: 'Orchestrator divides the 184 tests into 8 balanced shard queues based on rolling 7-day average execution runtime, optimizing cluster CPU saturation.',
        components: ['Bin-Packing Schedulers', 'Redis Multi-Queue', 'P95 Execution Cache', 'Shard Load Balancer'],
        guarantee: '⚡ <strong>Sub-3-Minute Execution:</strong> 184 tests complete in under 2m 45s wall clock time by parallelizing across 8 sandboxes.',
        codeType: 'application/json',
        code: `{
  "sharding_algorithm": "p95_bin_packing",
  "total_shards": 8,
  "average_shard_duration": "2m 38s",
  "max_shard_variance": "±6s",
  "allocated_vcpus": 16,
  "allocated_memory_gb": 32
}`
      },
      4: {
        num: 'STEP 4 OF 7',
        title: 'Elastic Pod Scale-Out: 8 Kata MicroVMs Boot in Parallel',
        sub: 'AKS Auto-Scaler',
        nodeTiming: '2.4s',
        latency: '< 3.5s',
        desc: 'Kubernetes horizontal autoscaler provisions 8 Kata Container microVMs in parallel across AKS cluster nodes. Pre-warmed pools ensure start latency under 2.5s.',
        components: ['Azure AKS Horizontal Pod Autoscaler', 'Kata Containers (QEMU)', 'Pre-warmed Pod Pool', 'Azure Node Pools'],
        guarantee: '🛡️ <strong>Isolated Browser Sandbox:</strong> Each shard has dedicated kernel memory, preventing inter-test memory fragmentation.',
        codeType: 'bash',
        code: `[K8s Cluster Autoscaler] Scaling autoq-kata-pool from 2 to 8 replicas...
[Pod 1..8] Successfully scheduled across 4 worker nodes (Standard_D8s_v5)
[Pod 1..8] MicroVM guest kernels booted in 1.9s average.`
      },
      5: {
        num: 'STEP 5 OF 7',
        title: 'Decoupled Environment Credentials Injected via KeyVault',
        sub: 'Zero-Trust Secrets',
        nodeTiming: '380ms',
        latency: '< 500ms',
        desc: 'Azure KeyVault Managed Identity passes encrypted runtime secrets for all 4 subsystems (Payment gateways, ERP credentials, SSO test tenants).',
        components: ['Azure KeyVault', 'Managed Identity Broker', 'Subsystem Secret Injector', 'Compliance Auditor'],
        guarantee: '🔒 <strong>Compliance Logged:</strong> Every secret read is tied to Nightly Run ID for SOC2 and ISO-27001 auditability.',
        codeType: 'bash',
        code: `[KeyVault] Successfully authorized via AKS Workload Identity
[KeyVault] Retrieved: STAGING_PAYMENT_SECRET, OKTA_SERVICE_TOKEN, ERP_API_KEY
[Memory] Credentials loaded directly into Node.js process environment.`
      },
      6: {
        num: 'STEP 6 OF 7',
        title: 'Matrix Execution: Multi-Browser Shard Runs',
        sub: 'Chrome+Firefox+WebKit',
        nodeTiming: '2m 28s',
        latency: 'Wall clock ~2.5m',
        desc: '8 shards execute in parallel across Chromium, Firefox, and WebKit browsers. Live heartbeats and test results stream back to the AutoQ orchestrator.',
        components: ['Playwright Runner Engine', 'Chromium/Firefox/WebKit', 'Heartbeat WebSocket', 'Telemetry Sink'],
        guarantee: '🌐 <strong>Cross-Browser Parity:</strong> Detects engine-specific rendering differences and layout shifts across all major browser engines.',
        codeType: 'bash',
        code: `[Shard 1] 23 tests on Chromium -> 23 PASSED (2m 12s)
[Shard 2] 23 tests on Firefox  -> 23 PASSED (2m 24s)
[Shard 3] 23 tests on WebKit   -> 23 PASSED (2m 28s)
[Shard 4..8] Executing regression suites... ALL COMPLETED`
      },
      7: {
        num: 'STEP 7 OF 7',
        title: 'Lake Archival, Flakiness Indexing & Slack Notification',
        sub: 'Lake & Flake Score',
        nodeTiming: '1.8s',
        latency: '< 2.5s',
        desc: 'All execution traces and video recordings store in Azure Blob Storage (30-day lifecycle). Flakiness scoring model updates. Executive Slack summary dispatched to #qa-engineering.',
        components: ['Azure Blob Storage Lake', 'Flakiness Scoring ML Model', 'Slack Webhook Bot', 'Executive Dashboard'],
        guarantee: '📈 <strong>Proactive Quality Insights:</strong> Tests with jitter or variable latency are automatically tagged with flakiness scores before they break developer PRs.',
        codeType: 'application/json',
        code: `{
  "nightly_summary": {
    "total_tests": 184,
    "passed": 183,
    "failed": 1,
    "pass_rate": "99.4%",
    "flakiness_score": "0.4% (Excellent)",
    "slack_notified": "#qa-engineering",
    "report_url": "https://autoq.internal.app/runs/1044"
  }
}`
      }
    }
  }
};

// 4-Tier Interactive Blueprint Component Specifications
const componentSpecs = {
  'studio': {
    icon: '✨',
    title: 'DevTools AI Studio',
    tier: 'TIER 1 · CLIENTS & INGRESS',
    desc: 'Interactive chat copilot and prompt compiler. Allows testers and developers to generate resilient test code, define requirements, inspect live DOM elements, and simulate sandbox execution directly within the workspace.',
    ingress: 'WebSocket / HTTPS',
    egress: 'AI Code Generator (Tier 2)',
    sla: '< 150ms prompt roundtrip',
    resilience: 'Session Persistence via LocalStorage',
    responsibilities: [
      'Translates natural language prompts into Gherkin acceptance criteria and TypeScript code.',
      'Auto-detects context: active engine (Playwright/Cypress/Selenium), current requirement, and tags.',
      'Provides interactive sandbox testing and Git branch commit capabilities.'
    ],
    codeType: 'javascript',
    code: `// DevTools AI Studio WebSocket Client
const socket = new WebSocket('wss://autoq.internal.app/ws/studio');
socket.send(JSON.stringify({
  action: 'compile_prompt',
  prompt: 'Generate 3 boundary test cases for coupon discount in Playwright',
  context: { engine: 'playwright', reqId: 'REQ-890' }
}));`
  },
  'screens': {
    icon: '📊',
    title: 'Structured QA Screens',
    tier: 'TIER 1 · CLIENTS & INGRESS',
    desc: 'Single-Page Application providing structured views: Test Library, Suite Filters, Run Builder, Live Pod Telemetry, and AI Self-Healing Diff Studio for deterministic QA governance.',
    ingress: 'SPA / REST API',
    egress: 'Test Library & STLC Linker (Tier 2)',
    sla: '< 80ms UI interaction latency',
    resilience: 'Client-side reactive cache',
    responsibilities: [
      'Presents comprehensive catalog of test suites with multi-tag filtering (@smoke, @regression, @e2e).',
      'Provides Run Builder for configuring shard count, target environments, and module scopes.',
      'Renders live shard pods with real-time log streaming and AI failure triage.'
    ],
    codeType: 'json',
    code: `{
  "screens_available": ["library", "run-builder", "results", "authoring", "architecture", "detail"],
  "telemetry_stream": "Server-Sent Events (SSE)",
  "state_sync": "Reactive Store"
}`
  },
  'github': {
    icon: '🐙',
    title: 'CI/CD Webhooks Gateway',
    tier: 'TIER 1 · CLIENTS & INGRESS',
    desc: 'High-throughput event ingress endpoint for GitHub Actions, GitLab CI, and Jenkins. Validates HMAC signatures and intercepts pull request events to trigger automated testing pipelines.',
    ingress: 'HTTPS POST / Webhook',
    egress: 'Unified Orchestrator (Tier 2)',
    sla: '< 120ms response ACK',
    resilience: 'Idempotency Key Deduplication (Redis)',
    responsibilities: [
      'Authenticates incoming webhooks with secret HMAC-SHA256 signatures.',
      'Deduplicates repeated webhook delivery attempts using commit SHA and delivery UUID.',
      'Reports commit status checks back to GitHub PRs (Pending -> Running -> Passed/Failed).'
    ],
    codeType: 'bash',
    code: `# GitHub Actions Workflow Step (.github/workflows/e2e.yml)
- name: Trigger AutoQ Test Automation
  run: |
    curl -X POST https://autoq.internal.app/api/v1/triggers/ci \\
      -H "X-AutoQ-Signature: sha256=\${{ secrets.AUTOQ_HMAC_SECRET }}" \\
      -d '{"event":"pull_request","commit":"'\${{ github.sha }}'","pr":'\${{ github.event.number }}'}'`
  },
  'cron': {
    icon: '⏰',
    title: 'Cron Scheduler Ingress',
    tier: 'TIER 1 · CLIENTS & INGRESS',
    desc: 'Automated recurring trigger service powered by Azure Event Grid. Initiates nightly platform regression suites, hourly smoke checks, and cross-browser matrices without human intervention.',
    ingress: 'Azure Event Grid / CloudEvents',
    egress: 'Unified Orchestrator (Tier 2)',
    sla: '< 50ms trigger dispatch',
    resilience: 'At-least-once delivery with exponential retry',
    responsibilities: [
      'Executes cron expressions (e.g. 0 2 * * * for nightly full regression).',
      'Monitors system health and off-peak execution windows to optimize cloud costs.',
      'Dispatches notifications to Slack and Microsoft Teams upon completion.'
    ],
    codeType: 'json',
    code: `{
  "schedule": "0 2 * * *",
  "timezone": "UTC",
  "scope": "all_modules",
  "engine": "playwright",
  "shards": 8,
  "browsers": ["chromium", "firefox", "webkit"]
}`
  },
  'library-svc': {
    icon: '📁',
    title: 'Test Library & STLC Linker',
    tier: 'TIER 2 · CORE PLATFORM SERVICES',
    desc: 'Central source of truth for test metadata and traceability. Enforces the unbroken hierarchy: Business Epic / Module -> Kyxo Requirement -> Test Case -> Git Code Path.',
    ingress: 'REST API / gRPC',
    egress: 'PostgreSQL & Kyxo Jira Connector',
    sla: '< 60ms query latency',
    resilience: 'Multi-AZ PostgreSQL Replica',
    responsibilities: [
      'Maintains bi-directional links between business requirements and automation test cases.',
      'Detects coverage gaps where user stories lack corresponding smoke or regression tests.',
      'Stores pass/fail history, flaky scores, and average execution durations per test.'
    ],
    codeType: 'sql',
    code: `-- Living Traceability Chain Query
SELECT ep.epic_key, req.req_id, tc.test_id, tc.script_path, tc.pass_rate
FROM modules_epics ep
JOIN requirements req ON req.module_id = ep.id
JOIN test_cases tc ON tc.requirement_id = req.id
WHERE ep.id = 'payments';`
  },
  'ai-svc': {
    icon: '🤖',
    title: 'AI Code Generator & Triager',
    tier: 'TIER 2 · CORE PLATFORM SERVICES',
    desc: 'Specialized LLM service employing Gemini 1.5 Pro and Claude 3.5 Sonnet. Generates clean deterministic code once during authoring, and conducts 4-way root cause analysis on failed execution traces.',
    ingress: 'gRPC / JSON RPC',
    egress: 'LLM APIs & Azure Blob Lake',
    sla: '< 1.5s failure analysis',
    resilience: 'Multi-model fallback (Gemini -> Claude)',
    responsibilities: [
      'Generates resilient Playwright, Cypress, and Selenium code adhering to best practices.',
      'Classifies failures into 4 buckets: Real Bug, DOM Changed (Outdated), Flaky Selector, Env Error.',
      'Auto-generates Git pull request diffs for self-healing renamed DOM selectors.'
    ],
    codeType: 'json',
    code: `{
  "triage_input": {
    "failed_test": "TC-105",
    "dom_snapshot": "<html>...<button role='button'>Complete Purchase</button>...</html>",
    "old_selector": "[data-testid='checkout-btn']",
    "error_message": "Timeout 5000ms waiting for [data-testid='checkout-btn']"
  },
  "triage_output": {
    "verdict": "OUTDATED_TEST_DOM_CHANGED",
    "confidence": 0.994,
    "recommended_replacement": "getByRole('button', { name: 'Complete Purchase' })"
  }
}`
  },
  'orch-svc': {
    icon: '⚡',
    title: 'Unified Elastic Orchestrator',
    tier: 'TIER 2 · CORE PLATFORM SERVICES',
    desc: 'The brain of the execution pipeline. Dynamically calculates shard slices, queues jobs in Redis, assigns pods from AKS warm pools, and balances workloads across available CPU resources.',
    ingress: 'Internal Queue / Event Bus',
    egress: 'Kubernetes API & Azure AKS Kata Pool',
    sla: '< 100ms shard calculation',
    resilience: 'Clustered Redis with Raft consensus',
    responsibilities: [
      'Calculates dynamic sharding allocations using historical test duration bin-packing.',
      'Manages warm pod pools on AKS to ensure pod acquisition latency under 2 seconds.',
      'Coordinates heartbeats and aggregates parallel shard outputs into unified run results.'
    ],
    codeType: 'javascript',
    code: `// Workload Bin-Packing Algorithm
function calculateShards(tests, shardCount) {
  const shards = Array.from({ length: shardCount }, () => ({ tests: [], totalDuration: 0 }));
  tests.sort((a, b) => b.historicalDuration - a.historicalDuration);
  tests.forEach(test => {
    shards.sort((a, b) => a.totalDuration - b.totalDuration);
    shards[0].tests.push(test);
    shards[0].totalDuration += test.historicalDuration;
  });
  return shards;
}`
  },
  'results-svc': {
    icon: '📈',
    title: 'Results Normalizer & Artifact Lake',
    tier: 'TIER 2 · CORE PLATFORM SERVICES',
    desc: 'Normalizes disparate output reports (Playwright JSON, Cypress Mocha, Selenium JUnit) into the standardized AutoQ common schema, computes flakiness scores, and archives artifacts.',
    ingress: 'gRPC Output Stream',
    egress: 'Azure Blob Storage & PostgreSQL',
    sla: '< 200ms result ingestion',
    resilience: 'Buffered persistent write queue',
    responsibilities: [
      'Normalizes test results from Playwright, Cypress, and Selenium into uniform JSON schema.',
      'Calculates rolling flakiness index based on flip-flop pass/fail patterns over 30 days.',
      'Enforces 30-day lifecycle expiration policy on heavy video and trace artifacts in Blob Storage.'
    ],
    codeType: 'json',
    code: `{
  "schema_version": "autoq-v2.1",
  "run_id": "run-1043",
  "engine": "playwright",
  "metrics": { "total": 42, "passed": 41, "failed": 1, "flaky": 0, "pass_rate": "97.6%" },
  "artifacts": {
    "trace_zip": "https://storage.blob.core.windows.net/autoq/1043/trace.zip",
    "video_webm": "https://storage.blob.core.windows.net/autoq/1043/run.webm"
  }
}`
  },
  'playwright': {
    icon: '🎭',
    title: 'Playwright Engine Adapter (Default)',
    tier: 'TIER 3 · PLUGGABLE AUTOMATION ENGINE ADAPTERS',
    desc: 'Primary automation runner adapter. Connects directly to Chromium, Firefox, and WebKit using the low-level Chrome DevTools Protocol (CDP). Features native auto-waiting, network mocking, and multi-tab testing.',
    ingress: 'Script File & Config JSON',
    egress: 'Normalized JSON & Trace ZIP',
    sla: 'High-speed native CDP protocol',
    resilience: 'Auto-retries on transient network disconnects',
    responsibilities: [
      'Runs deterministic TypeScript test suites with built-in accessibility role locators.',
      'Captures comprehensive execution traces containing DOM snapshots, console logs, and network timelines.',
      'Provides multi-tab, multi-origin iframe, and cross-browser execution capabilities.'
    ],
    codeType: 'typescript',
    code: `// Standard AutoQ Playwright Adapter Contract
export async function executeAdapterSuite(config: AdapterConfig): Promise<AdapterResult> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ recordVideo: { dir: './artifacts' } });
  await context.tracing.start({ screenshots: true, snapshots: true });
  // Execute test files...
  await context.tracing.stop({ path: './artifacts/trace.zip' });
  return { status: 'passed', duration: 1240 };
}`
  },
  'cypress': {
    icon: '🌲',
    title: 'Cypress Engine Adapter',
    tier: 'TIER 3 · PLUGGABLE AUTOMATION ENGINE ADAPTERS',
    desc: 'Pluggable adapter for component and end-to-end JavaScript suites. Injects webpack bundles into browser runtime, executing assertions inside the same run loop as application frontend code.',
    ingress: 'Cypress Config & Spec Files',
    egress: 'Normalized Mocha JSON & Video',
    sla: 'In-browser synchronous DOM access',
    resilience: 'Built-in DOM retry assertions',
    responsibilities: [
      'Executes existing Cypress 13.x JavaScript and TypeScript test suites.',
      'Wraps Cypress spec output into AutoQ normalized execution results format.',
      'Enables teams with legacy Cypress suites to leverage AutoQ Kata sandboxes without rewriting.'
    ],
    codeType: 'javascript',
    code: `// Cypress Runner Adapter
module.exports = async function runCypress(options) {
  const cypress = require('cypress');
  const results = await cypress.run({
    config: { baseUrl: process.env.APP_BASE_URL },
    reporter: 'mocha-json'
  });
  return normalizeCypressResults(results);
};`
  },
  'selenium': {
    icon: '🌐',
    title: 'Selenium Grid Adapter',
    tier: 'TIER 3 · PLUGGABLE AUTOMATION ENGINE ADAPTERS',
    desc: 'Pluggable adapter for legacy Selenium WebDriver suites (Java, Python, C#, Node.js). Bridges W3C WebDriver JSON Wire Protocol commands to local ChromeDriver/GeckoDriver on port 9515.',
    ingress: 'WebDriver JSON Wire Protocol',
    egress: 'JUnit XML / Normalized JSON',
    sla: 'W3C WebDriver HTTP command loop',
    resilience: 'Driver process monitoring and auto-restart',
    responsibilities: [
      'Executes legacy enterprise Selenium suites within ephemeral Kata sandboxes.',
      'Exposes local W3C WebDriver port 9515 inside the microVM runner.',
      'Translates JUnit XML outputs into standardized AutoQ run schemas.'
    ],
    codeType: 'javascript',
    code: `const { Builder } = require('selenium-webdriver');
const driver = await new Builder()
  .forBrowser('chrome')
  .usingServer('http://localhost:9515')
  .build();`
  },
  'mobile': {
    icon: '📱',
    title: 'Appium Mobile Adapter (Extensible)',
    tier: 'TIER 3 · PLUGGABLE AUTOMATION ENGINE ADAPTERS',
    desc: 'Extensible adapter slot for native iOS and Android mobile testing. Connects to cloud device farms (AWS Device Farm / BrowserStack) using Appium 2.x W3C mobile actions protocol.',
    ingress: 'Appium Spec & Mobile Capabilities',
    egress: 'Mobile Video & Normalized Log',
    sla: 'Cloud device farm session bridge',
    resilience: 'Session keep-alive & device reconnect',
    responsibilities: [
      'Demonstrates pluggable architecture: allows plugging mobile runners without orchestrator changes.',
      'Translates mobile gestures (tap, swipe, biometric prompt) to device automation drivers.',
      'Consolidates mobile app test results into the same central Test Library as web apps.'
    ],
    codeType: 'json',
    code: `{
  "adapter": "appium-mobile",
  "capabilities": {
    "platformName": "iOS",
    "automationName": "XCUITest",
    "deviceName": "iPhone 15 Pro",
    "app": "https://storage.blob.core.windows.net/builds/app.ipa"
  }
}`
  },
  'aks': {
    icon: '🛡️',
    title: 'Azure AKS Kata Sandboxes',
    tier: 'TIER 4 · ELASTIC CLOUD EXECUTION & ISOLATION LAYER',
    desc: 'Hardware-isolated execution runtime. Each shard boots inside its own dedicated lightweight QEMU/Cloud-Hypervisor microVM pod with a separate Linux kernel, destroyed immediately upon test completion.',
    ingress: 'containerd Lifecycle API (gRPC)',
    egress: 'Ephemeral Output Stream',
    sla: '< 2.0s microVM boot time',
    resilience: 'Hardware hypervisor boundary isolation',
    responsibilities: [
      'Guarantees zero shared Linux kernel between test shards or host Kubernetes node.',
      'Prevents cross-tenant state pollution (cookies, cache, localStorage, background processes).',
      'Provides ephemeral lifecycle: Sandbox pod is permanently terminated after test execution.'
    ],
    codeType: 'yaml',
    code: `apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: kata-qemu
handler: kata-qemu
overhead:
  podFixed:
    memory: "250Mi"
    cpu: "250m"`
  },
  'keyvault': {
    icon: '🔑',
    title: 'Azure KeyVault Secret Injection',
    tier: 'TIER 4 · ELASTIC CLOUD EXECUTION & ISOLATION LAYER',
    desc: 'Zero-trust secret management. Fetches environment passwords, payment gateway keys, and API tokens at runtime via Azure Managed Identity (OIDC), injecting them strictly into sandbox process memory.',
    ingress: 'Azure Managed Identity (OIDC)',
    egress: 'In-Memory Process Environment',
    sla: '< 300ms secret retrieval',
    resilience: 'Azure KeyVault 99.99% Availability SLA',
    responsibilities: [
      'Eliminates hardcoded passwords, tokens, and credentials from Git repositories.',
      'Injects secrets directly into container memory without writing them to disk.',
      'Maintains complete audit trails in Azure Monitor for every secret access request.'
    ],
    codeType: 'bash',
    code: `# KeyVault Managed Identity Injection
az keyvault secret show \\
  --vault-name "autoq-production-vault" \\
  --name "STAGING-CHECKOUT-API-KEY" \\
  --query value -o tsv`
  },
  'blob': {
    icon: '🗄️',
    title: 'Azure Blob Artifact Lake',
    tier: 'TIER 4 · ELASTIC CLOUD EXECUTION & ISOLATION LAYER',
    desc: 'Unified storage repository for execution artifacts: .webm video recordings, full Playwright trace.zip bundles, failure screenshots, and HAR network traffic files with 30-day lifecycle auto-tiering.',
    ingress: 'Azure Blob Storage REST API',
    egress: 'Secure SAS URLs for Browser Viewing',
    sla: '< 400ms artifact upload',
    resilience: 'Geo-Redundant Storage (GRS) with 30-day lifecycle',
    responsibilities: [
      'Stores large video recordings, trace archives, and screenshots generated during runs.',
      'Generates time-limited Secure Access Signature (SAS) tokens for safe browser viewing.',
      'Enforces automated lifecycle policy: moves files to Cool tier after 7 days, deletes after 30 days.'
    ],
    codeType: 'json',
    code: `{
  "blob_lifecycle_policy": {
    "tier_to_cool": "7 days",
    "delete_after": "30 days",
    "container": "autoq-artifacts",
    "access_tier": "Hot"
  }
}`
  },
  'git': {
    icon: '🐙',
    title: 'Application Git Repository',
    tier: 'TIER 4 · ELASTIC CLOUD EXECUTION & ISOLATION LAYER',
    desc: 'The single source of truth for all automation code. Test files live alongside application code in branch main, allowing standard code reviews, branch protection rules, and auto-created self-healing PRs.',
    ingress: 'Git SSH / HTTPS Protocol',
    egress: 'Branch main & Feature Branches',
    sla: '< 500ms shallow clone',
    resilience: 'Distributed Git Version Control',
    responsibilities: [
      'Keeps test code in plain TypeScript/JavaScript alongside feature code in the repository.',
      'Enforces peer review through standard Pull Request workflows before tests enter main.',
      'Receives auto-generated self-healing PR branches from the AI triage engine for human approval.'
    ],
    codeType: 'bash',
    code: `# Git Integration Architecture
git checkout -b feature/req-890-voucher-tests
git commit -m "feat(tests): add automated Playwright suite for REQ-890"
git push origin feature/req-890-voucher-tests`
  }
};

// The 12 Architectural Decisions (Categorized Enterprise Architecture Specification)
const architecturalDecisions = [
  {
    id: 1,
    category: 'stlc',
    categoryLabel: 'STLC & Modality',
    title: 'Chat Plus Structured Screens, Not Chat Alone',
    desc: 'Chat is fastest for authoring and natural triage; browsing hundreds of test suites and viewing run histories requires structured tables, filters, and matrices. Gives users both modal efficiencies.'
  },
  {
    id: 2,
    category: 'stlc',
    categoryLabel: 'STLC & Traceability',
    title: 'Hierarchical Traceability: Test Case is the Centre',
    desc: 'AutoQ establishes an unbroken 4-level hierarchy: Epic / Module → Kyxo Requirement → Test Case → Git Code. Pure Playwright or Cypress lack business awareness; AutoQ enables execution at any scope: single test, whole requirement, or entire Module/Epic without hardcoding static tags in Git.'
  },
  {
    id: 3,
    category: 'adapters',
    categoryLabel: 'Pluggable Adapters',
    title: 'Engines Sit Behind Pluggable Adapters',
    desc: 'Standardized inputs (script + config) and standardized outputs (JSON report + traces). Playwright is the primary engine, but Cypress and Selenium work without altering orchestrator logic.'
  },
  {
    id: 4,
    category: 'ai',
    categoryLabel: 'AI & Determinism',
    title: 'AI Writes Real Code Once; Runs Are Plain Code',
    desc: 'Regression tests must be deterministic and fast. Stored TypeScript files cost $0 in token fees per execution run, prevent hallucinations, and eliminate vendor lock-in.'
  },
  {
    id: 5,
    category: 'stlc',
    categoryLabel: 'Version Control',
    title: 'Scripts Live in Git Repository',
    desc: 'Version controlled alongside application code. Enables pull request reviews, branch isolation, and seamless triggering directly from GitHub Actions CI/CD workflows.'
  },
  {
    id: 6,
    category: 'ai',
    categoryLabel: 'AI Governance',
    title: 'Human-in-the-Loop Approval for Self-Healing',
    desc: 'Automated self-healing presents an inspected git diff for developer or QA sign-off. Eliminates "false passes" where a broken application bug is accidentally masked by altered selectors.'
  },
  {
    id: 7,
    category: 'cloud',
    categoryLabel: 'Cloud & Sandboxes',
    title: 'Run in Azure Sandboxes (Kata Containers on AKS)',
    desc: 'Lightweight microVM isolation per shard destroyed after every run. Guarantees clean browser state, zero cross-tenant contamination, and leverages existing Azure cluster infrastructure.'
  },
  {
    id: 8,
    category: 'adapters',
    categoryLabel: 'Unified Ingress',
    title: 'One Unified Orchestrator for All Triggers',
    desc: 'Whether initiated via UI button, DevTools Chat, Cron scheduler, or GitHub Actions webhook, every execution records to the unified schema and historical run database.'
  },
  {
    id: 9,
    category: 'cloud',
    categoryLabel: 'Cloud & Artifacts',
    title: 'Common Result Schema & Artifact Lake',
    desc: 'Normalizes output from diverse runners into standard pass/fail metrics, traces, and HAR recordings stored in Azure Blob Storage with automated 30-day lifecycle retention.'
  },
  {
    id: 10,
    category: 'cloud',
    categoryLabel: 'Cloud & KeyVault',
    title: 'Environments & Secrets Decoupled from Scripts',
    desc: 'Zero hardcoded credentials. Tests accept parameterized base URLs while secrets are dynamically fetched from Azure KeyVault and injected into sandboxes at runtime.'
  },
  {
    id: 11,
    category: 'ai',
    categoryLabel: 'AI & Triage',
    title: 'Automated 4-Way Failure Classification',
    desc: 'Every failure is triaged as either Product Bug, Outdated Test (DOM changed), Environment Flake (502 network), or Flaky Selector, auto-routing next steps without manual guesswork.'
  },
  {
    id: 12,
    category: 'stlc',
    categoryLabel: 'STLC Workflow',
    title: 'Three Entry Points for Creating Automation',
    desc: 'From an existing manual Test Case, directly within DevTools Chat after feature completion, or inline during code development to fill requirement coverage gaps.'
  }
];

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  renderTestLibrary();
  renderArchitecturalDecisions();
  initChatStudio();
  initSearchKeyboard();
  initArchitectureShowcase();

  // Populate dynamic requirements
  renderRequirementDropdowns();

  // Initialize Global Dynamic Values
  setGlobalEngine(state.currentEngine, false);
  setGlobalShardCount(state.shardCount);
  setGlobalEnvironment(state.targetEnv, false);
  renderPodShards();

  // Initialize Feature / Module / Epic Scope
  renderModuleGridPicker();
  selectRunModule(state.selectedModuleId, false);
});

// Helper labels
function getEngineLabel(engine) {
  const map = {
    'playwright': 'Playwright v1.48',
    'cypress': 'Cypress 13.x',
    'selenium': 'Selenium 4.x'
  };
  return map[engine.toLowerCase()] || 'Playwright v1.48';
}

function getEngineSimpleName(engine) {
  const map = {
    'playwright': 'Playwright',
    'cypress': 'Cypress',
    'selenium': 'Selenium'
  };
  return map[(engine || '').toLowerCase()] || 'Playwright';
}

function getEnvLabel(env) {
  const map = {
    'staging': 'Staging-EastUS',
    'dev': 'Dev-Preview-04',
    'prod': 'Production Canary'
  };
  return map[env.toLowerCase()] || 'Staging-EastUS';
}

function getEnvHost(env) {
  const map = {
    'staging': 'staging.internal.app',
    'dev': 'dev-04.internal.app',
    'prod': 'app.production.com'
  };
  return map[env.toLowerCase()] || 'staging.internal.app';
}

// ==========================================================================
// 1. DYNAMIC REQUIREMENTS STORE & DROPDOWNS
// ==========================================================================
function getNextRequirementId() {
  let maxNum = 895;
  state.requirements.forEach(r => {
    const num = parseInt(r.id.replace(/\D/g, ''), 10);
    if (!isNaN(num) && num > maxNum) maxNum = num;
  });
  return `REQ-${maxNum + 1}`;
}

function renderRequirementDropdowns() {
  const selectors = ['studio-req-selector', 'modal-new-req-select'];
  selectors.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const currentVal = el.value || state.currentReq;
    el.innerHTML = state.requirements.map(r => `
      <option value="${r.id}">[${r.id}] ${r.title}</option>
    `).join('');
    if (state.requirements.some(r => r.id === currentVal)) {
      el.value = currentVal;
    } else {
      el.value = state.currentReq;
    }
  });
}

function openNewRequirementModal() {
  const modal = document.getElementById('new-requirement-modal');
  if (modal) {
    modal.style.display = 'flex';
    const nextId = getNextRequirementId();
    const idInput = document.getElementById('modal-req-id');
    if (idInput) idInput.value = nextId;
  }
}

function closeNewRequirementModal() {
  const modal = document.getElementById('new-requirement-modal');
  if (modal) modal.style.display = 'none';
}

function aiDraftRequirementCriteria() {
  const title = document.getElementById('modal-req-title')?.value || 'New Feature';
  const storyEl = document.getElementById('modal-req-story');
  const criteriaEl = document.getElementById('modal-req-criteria');

  if (title.toLowerCase().includes('apple') || title.toLowerCase().includes('pay') || title.toLowerCase().includes('biometric')) {
    if (storyEl) storyEl.value = 'As an iOS Safari shopper, I want to authenticate checkout using Apple Pay biometric FaceID, so that I can complete purchases without typing billing details.';
    if (criteriaEl) criteriaEl.value = `Scenario: Apple Pay Sheet Authorization
Given user is in checkout on an Apple Pay enabled browser
When user clicks "Buy with Apple Pay" button
Then native payment sheet shows order subtotal and shipping
And upon FaceID biometric approval, order confirmation token is returned

Scenario: Card Fallback on Non-Apple Device
Given user is on Chrome Desktop or Android
When user visits checkout
Then Apple Pay button is hidden and Standard Card form is displayed`;
  } else if (title.toLowerCase().includes('export') || title.toLowerCase().includes('csv') || title.toLowerCase().includes('pdf') || title.toLowerCase().includes('report')) {
    if (storyEl) storyEl.value = 'As a business operations analyst, I want to export transaction audit logs to CSV and signed PDF, so that our finance team can verify monthly payouts.';
    if (criteriaEl) criteriaEl.value = `Scenario: Export Filtered Transactions
Given user has selected date range "Last 30 Days"
When user clicks "Export CSV"
Then a UTF-8 CSV downloads within 3 seconds containing columns [ID, Timestamp, User, Amount, Status]

Scenario: Large Dataset Background Job
Given dataset exceeds 10,000 records
When export is triggered
Then user receives notification banner with secure download link`;
  } else {
    if (storyEl) storyEl.value = `As an authorized platform user, I want to execute ${title}, so that our team satisfies business requirements with high reliability.`;
    if (criteriaEl) criteriaEl.value = `Scenario: Valid Happy Path
Given user has requisite permissions and environment is healthy
When user submits request for "${title}"
Then system processes successfully and returns 200 OK
And audit log captures timestamp and actor ID

Scenario: Input Validation & Boundary
Given user provides malformed or empty parameters
When request is submitted
Then system returns 400 Bad Request with field validation errors`;
  }

  showToast(`✨ AI drafted User Story & Gherkin Acceptance Criteria for "${title}"!`, 'info');
}

function confirmCreateNewRequirement() {
  const title = document.getElementById('modal-req-title')?.value || 'New Business Requirement';
  const id = document.getElementById('modal-req-id')?.value || getNextRequirementId();
  const domain = document.getElementById('modal-req-domain')?.value || 'Payments';
  const priority = document.getElementById('modal-req-priority')?.value || 'P0 - Critical';
  const story = document.getElementById('modal-req-story')?.value || '';
  const criteria = document.getElementById('modal-req-criteria')?.value || '';
  const syncKyxo = document.getElementById('modal-req-sync-kyxo')?.checked;
  const autoGenTests = document.getElementById('modal-req-auto-generate-tests')?.checked;

  const newReq = { id, title, domain, priority, story, criteria };
  state.requirements.push(newReq);

  state.currentReq = id;
  state.currentReqTitle = title;
  state.currentTestName = `${title} Verification`;

  renderRequirementDropdowns();
  closeNewRequirementModal();
  closeNewTestCaseModal(); // if opened from inside testcase modal

  navigateToScreen('authoring');

  // Sync Studio Ribbon
  const studioReq = document.getElementById('studio-req-selector');
  if (studioReq) studioReq.value = id;

  updateStudioFileTab();

  if (autoGenTests) {
    renderMultiScenarioSuite(newReq);
  } else {
    renderStudioCodeTemplate();
  }

  // Automatically link to parent Module / Epic & update test count
  const targetModule = state.modules.find(m => 
    m.name.toLowerCase().includes(domain.toLowerCase()) || 
    m.id.toLowerCase() === domain.toLowerCase() ||
    (domain === 'Payments' && m.id === 'payments') ||
    (domain === 'Auth' && m.id === 'auth') ||
    (domain === 'Catalog' && m.id === 'catalog') ||
    (domain === 'Orders' && m.id === 'orders')
  );

  if (targetModule) {
    if (!targetModule.requirements.includes(id)) targetModule.requirements.push(id);
    if (autoGenTests) targetModule.testCount += 3;
    renderModuleGridPicker();
    selectRunModule(state.selectedModuleId, false);
  }

  // If auto-generating tests, register them in testLibrary table
  if (autoGenTests) {
    const nextNum = parseInt(id.replace(/\D/g, ''), 10) || 896;
    testLibrary.push(
      {
        id: `TC-${nextNum + 10}`,
        name: `${title} - Happy Path Biometric Authorization`,
        moduleId: targetModule ? targetModule.id : 'payments',
        moduleName: targetModule ? targetModule.name : 'Checkout & Payments',
        epicKey: targetModule ? targetModule.epicKey : 'KYX-EPIC-01',
        requirement: { id, title },
        engine: getEngineSimpleName(state.currentEngine),
        scriptPath: `tests/e2e/${id.toLowerCase()}-happy.spec.ts`,
        suite: 'smoke',
        tags: ['@smoke', '@e2e', `@${id.toLowerCase()}`],
        lastStatus: 'passed',
        duration: '1.4s'
      },
      {
        id: `TC-${nextNum + 11}`,
        name: `${title} - Fallback & Edge Scenarios`,
        moduleId: targetModule ? targetModule.id : 'payments',
        moduleName: targetModule ? targetModule.name : 'Checkout & Payments',
        epicKey: targetModule ? targetModule.epicKey : 'KYX-EPIC-01',
        requirement: { id, title },
        engine: getEngineSimpleName(state.currentEngine),
        scriptPath: `tests/e2e/${id.toLowerCase()}-fallback.spec.ts`,
        suite: 'regression',
        tags: ['@regression', `@${id.toLowerCase()}`],
        lastStatus: 'passed',
        duration: '1.2s'
      }
    );
    renderTestLibrary();
  }

  // Update Context badge
  const ctxBadge = document.querySelector('.chat-header .badge');
  if (ctxBadge) {
    ctxBadge.textContent = `Context: ${getEnvLabel(state.targetEnv)} | ${id}`;
  }

  showToast(`🎯 Created ${id}: ${title} linked to Module ${targetModule ? targetModule.name : domain}!`, 'success');
}

// Generate full test suite for a new requirement
function renderMultiScenarioSuite(req) {
  const editor = document.getElementById('studio-code-editor');
  if (!editor) return;

  const eng = state.currentEngine;
  let code = '';

  if (eng === 'cypress') {
    code = `// Linked Kyxo Requirement: ${req.id} - ${req.title}
// Domain: ${req.domain} | Priority: ${req.priority}
// Automation Engine: Cypress 13.x

describe('${req.title} (${req.id})', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('APP_BASE_URL') || '/checkout');
  });

  // Scenario 1: Happy Path (P0 Smoke)
  it('TC-301: Happy Path Authorization [@smoke @e2e @${req.id.toLowerCase()}]', () => {
    cy.get('[data-testid="apple-pay-btn"]').should('be.visible').click();
    cy.get('[data-testid="payment-sheet"]').should('contain', 'Total');
    cy.window().then((win) => {
      win.postMessage({ type: 'APPLE_PAY_SUCCESS' }, '*');
    });
    cy.url().should('include', '/order-confirmed');
  });

  // Scenario 2: Device Fallback (P1 Regression)
  it('TC-302: Fallback on Non-Apple Device [@regression @${req.id.toLowerCase()}]', () => {
    cy.viewport('macbook-15');
    cy.get('[data-testid="standard-cc-form"]').should('be.visible');
  });

  // Scenario 3: Cancelled Authorization (P1 Regression)
  it('TC-303: User Cancels Sheet Returns to Cart [@regression @${req.id.toLowerCase()}]', () => {
    cy.get('[data-testid="apple-pay-btn"]').click();
    cy.get('[data-testid="cancel-sheet-btn"]').click();
    cy.get('[data-testid="cart-subtotal"]').should('be.visible');
  });
});`;
  } else if (eng === 'selenium') {
    code = `const { Builder, By, until } = require('selenium-webdriver');

// Linked Kyxo Requirement: ${req.id} - ${req.title}
// Automation Engine: Selenium 4.x Grid

describe('${req.title} (${req.id})', function() {
  this.timeout(40000);

  it('TC-301: Happy Path Biometric Authorization [@smoke @${req.id.toLowerCase()}]', async function() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
      await driver.get(process.env.APP_BASE_URL + '/checkout');
      await driver.findElement(By.css('[data-testid="apple-pay-btn"]')).click();
      await driver.wait(until.elementLocated(By.css('.order-confirmed')), 8000);
    } finally {
      await driver.quit();
    }
  });

  it('TC-302: Fallback Form Display [@regression]', async function() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
      await driver.get(process.env.APP_BASE_URL + '/checkout');
      const ccForm = await driver.findElement(By.css('.cc-form'));
      await ccForm.isDisplayed();
    } finally {
      await driver.quit();
    }
  });
});`;
  } else {
    // Playwright
    code = `import { test, expect } from '@playwright/test';

// Linked Kyxo Requirement: ${req.id} - ${req.title}
// Domain: ${req.domain} | Priority: ${req.priority}
// Automation Engine: Playwright v1.48

test.describe('${req.title} (${req.id})', () => {
  // Scenario 1: Primary Happy Path (P0 Smoke)
  test('TC-301: Apple Pay Biometric FaceID Authorization', {
    tag: ['@smoke', '@e2e', '@${req.id.toLowerCase()}', '@p0']
  }, async ({ page }) => {
    await page.goto(process.env.APP_BASE_URL + '/checkout');
    const applePayBtn = page.getByRole('button', { name: /Buy with Apple Pay/i });
    await expect(applePayBtn).toBeVisible();
    await applePayBtn.click();

    // Verify native payment prompt & confirmation token
    await expect(page.getByTestId('order-confirmation-badge')).toBeVisible({ timeout: 7000 });
    await expect(page).toHaveURL(/.*checkout\\/success/);
  });

  // Scenario 2: Fallback on unsupported platform (Regression)
  test('TC-302: Fallback to Standard Credit Card Form', {
    tag: ['@regression', '@${req.id.toLowerCase()}']
  }, async ({ page }) => {
    await page.goto(process.env.APP_BASE_URL + '/checkout');
    await expect(page.getByTestId('card-number-input')).toBeVisible();
  });

  // Scenario 3: Sheet Dismissal / Cancel recovery (Regression)
  test('TC-303: User Dismisses Payment Sheet Cleanly', {
    tag: ['@regression', '@${req.id.toLowerCase()}']
  }, async ({ page }) => {
    await page.goto(process.env.APP_BASE_URL + '/checkout');
    await page.getByRole('button', { name: /Buy with Apple Pay/i }).click();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('cart-subtotal')).toBeVisible();
  });
});`;
  }

  editor.value = code;
}

// ==========================================================================
// 2. GLOBAL ENGINE SYNCHRONIZATION (Pass value across whole UI)
// ==========================================================================
function setGlobalEngine(engine, notify = true) {
  const eng = engine.toLowerCase();
  state.currentEngine = eng;
  const engSimple = getEngineSimpleName(eng);

  // Sync Dropdowns in all locations
  const topSelect = document.getElementById('topbar-engine-select');
  if (topSelect) topSelect.value = eng;

  const studioSelect = document.getElementById('studio-engine-selector');
  if (studioSelect) studioSelect.value = eng;

  const builderSelect = document.getElementById('builder-engine-select');
  if (builderSelect) builderSelect.value = eng;

  const modalSelect = document.getElementById('modal-new-engine-select');
  if (modalSelect) {
    if (eng === 'playwright') modalSelect.value = 'Playwright';
    else if (eng === 'cypress') modalSelect.value = 'Cypress';
    else if (eng === 'selenium') modalSelect.value = 'Selenium';
  }

  // Update Run Builder Summary
  const summaryEngine = document.getElementById('summary-engine-val');
  if (summaryEngine) {
    summaryEngine.textContent = `${getEngineLabel(eng)} (Adapter)`;
  }

  // Update Topbar Indicator Dot
  const dot = document.getElementById('topbar-engine-dot');
  if (dot) {
    dot.className = `engine-dot ${eng}`;
  }

  // Update AI Studio File Tab & Console Mention
  updateStudioFileTab();

  const studioPodName = document.getElementById('studio-pod-name');
  if (studioPodName) {
    studioPodName.textContent = `azure-aks-${eng}-runner-04`;
  }

  const studioOutput = document.getElementById('studio-console-output');
  if (studioOutput) {
    studioOutput.textContent = `> Ready for ${getEngineLabel(eng)} execution. Press "Run in Azure Sandbox" to spin up ephemeral Kata container.`;
  }

  // Update AI Studio Chat Welcome Text and Input Hint
  const welcomeText = document.getElementById('chat-welcome-text');
  if (welcomeText) {
    welcomeText.textContent = `Hello Souvik! I can generate new ${getEngineLabel(eng)} tests from requirements, record user interactions, or optimize existing selectors.`;
  }

  const inputHint = document.getElementById('chat-input-hint');
  if (inputHint) {
    inputHint.textContent = `AI writes real code once. Tests run as native ${engSimple} code without token costs.`;
  }

  // Re-render code template in the active engine
  renderStudioCodeTemplate();

  // Update Pod cards on execution screen
  renderPodShards();

  if (notify) {
    showToast(`Switched Automation Engine to ${getEngineLabel(eng)} across all views!`, 'info');
  }
}

// Update file tab name in AI studio
function updateStudioFileTab() {
  const tabEl = document.querySelector('.studio-top-controls .file-tab span:first-child');
  if (!tabEl) return;

  const slug = state.currentTestName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24);
  if (state.currentEngine === 'cypress') {
    tabEl.textContent = `cypress/e2e/${slug}.cy.ts`;
  } else if (state.currentEngine === 'selenium') {
    tabEl.textContent = `tests/selenium/${slug}.spec.js`;
  } else {
    tabEl.textContent = `tests/e2e/${slug}.spec.ts`;
  }
}

// ==========================================================================
// 3. GLOBAL SHARD COUNT SYNCHRONIZATION (Pass value across whole UI)
// ==========================================================================
function setGlobalShardCount(val) {
  const count = Math.max(1, Math.min(16, parseInt(val, 10) || 4));
  state.shardCount = count;

  // Sync Slider and Modal Inputs
  const slider = document.getElementById('shard-count-slider');
  if (slider && parseInt(slider.value, 10) !== count) slider.value = count;

  const modalInput = document.getElementById('modal-shard-count');
  if (modalInput && parseInt(modalInput.value, 10) !== count) modalInput.value = count;

  const displayEl = document.getElementById('shard-count-display');
  if (displayEl) displayEl.textContent = `${count} Shards`;

  // Update Sidebar Footer
  const activePodsEl = document.getElementById('sbx-active-pods');
  if (activePodsEl) activePodsEl.textContent = `${count} / 16`;

  const fillBar = document.querySelector('.cluster-progress-fill');
  if (fillBar) fillBar.style.width = `${(count / 16) * 100}%`;

  // Update Execution Screen Status Badge
  const statusBadge = document.getElementById('live-run-status-badge');
  if (statusBadge && !statusBadge.textContent.includes('Stopped')) {
    statusBadge.textContent = `Running · ${count} Shards`;
  }

  // Update Run Builder Estimates & Shard Boxes
  updateShardEstimates(count);

  // Dynamically re-render Pod Cards in Execution Screen
  renderPodShards();
}

// Recalculate shard duration and update visual boxes in Run Builder
function updateShardEstimates(val) {
  const statEl = document.getElementById('shard-stat-calc');
  const container = document.getElementById('shard-cards-container');

  const totalTests = state.selectedScopeTestsCount || 42;
  const serialSec = totalTests * 9.5; // ~9.5s per test serial
  const shardedSec = Math.round(serialSec / val) + 12; // 12s sandbox boot overhead
  const mins = Math.floor(shardedSec / 60);
  const secs = Math.round(shardedSec % 60);

  if (statEl) {
    statEl.innerHTML = `Estimated execution time: <strong>~${mins}m ${secs}s</strong> (reduced from ${Math.round(serialSec / 60)}m serial)`;
  }

  // Update visual shard boxes in Run Builder
  if (container) {
    container.innerHTML = '';
    const testsPerShard = Math.ceil(totalTests / val);
    const numToShow = Math.min(val, 8);

    for (let i = 1; i <= numToShow; i++) {
      const box = document.createElement('div');
      box.className = 'shard-box';
      const startT = (i - 1) * testsPerShard + 1;
      const endT = Math.min(i * testsPerShard, totalTests);
      box.innerHTML = `
        <div class="shard-box-head">Shard ${i} (Pod-0${i})</div>
        <div class="shard-box-body">Tests ${startT}–${endT} (${getEngineLabel(state.currentEngine)})</div>
      `;
      container.appendChild(box);
    }
  }
}

// Scope Tags in Run Builder changed
function onScopeTagsChange() {
  const checkboxes = document.querySelectorAll('#builder-tag-group input[type="checkbox"]');
  let total = 0;
  checkboxes.forEach(cb => {
    if (cb.checked) {
      total += parseInt(cb.value, 10) || 0;
    }
  });

  state.selectedScopeTestsCount = total > 0 ? total : 10;

  const countEl = document.getElementById('summary-tests-count');
  if (countEl) {
    countEl.textContent = `${state.selectedScopeTestsCount} Tests`;
  }

  updateShardEstimates(state.shardCount);
  showToast(`Updated Scope: ${state.selectedScopeTestsCount} tests selected`, 'info');
}

// ==========================================================================
// FEATURE / MODULE / EPIC TESTING SYSTEM
// ==========================================================================

// Get all requirements belonging to a module (dynamic resolution)
function getRequirementsForModule(moduleId) {
  const mod = state.modules.find(m => m.id === moduleId);
  if (!mod) return [];
  return state.requirements.filter(r => {
    if (mod.requirements && mod.requirements.includes(r.id)) return true;
    if (mod.id === 'payments' && (r.domain === 'Payments' || r.domain === 'Pricing')) return true;
    if (mod.id === 'auth' && r.domain === 'Auth') return true;
    if (mod.id === 'catalog' && r.domain === 'Catalog') return true;
    if (mod.id === 'orders' && r.domain === 'Orders') return true;
    return false;
  });
}

// Switch between 'tags' and 'module' scope modes in Run Builder
function setRunScopeMode(mode) {
  state.runScopeMode = mode;

  const btnTags = document.getElementById('btn-scope-tags');
  const btnModule = document.getElementById('btn-scope-module');
  const sectionTags = document.getElementById('scope-tags-section');
  const sectionModule = document.getElementById('scope-module-section');

  if (btnTags && btnModule) {
    btnTags.classList.toggle('active', mode === 'tags');
    btnModule.classList.toggle('active', mode === 'module');
  }

  if (sectionTags && sectionModule) {
    sectionTags.style.display = mode === 'tags' ? 'block' : 'none';
    sectionModule.style.display = mode === 'module' ? 'block' : 'none';
  }

  if (mode === 'module') {
    selectRunModule(state.selectedModuleId, false);
  } else {
    onScopeTagsChange();
  }
}

// Render Module Grid Cards in Run Builder
function renderModuleGridPicker() {
  const container = document.getElementById('module-grid-picker');
  if (!container) return;

  container.innerHTML = state.modules.map(mod => {
    const isActive = mod.id === state.selectedModuleId;
    const reqs = getRequirementsForModule(mod.id);
    return `
      <div class="module-card ${isActive ? 'active' : ''}" id="mod-card-${mod.id}" onclick="selectRunModule('${mod.id}')">
        <div class="module-card-head">
          <div class="module-card-icon-title">
            <span class="module-icon">${mod.icon}</span>
            <div>
              <div class="module-title">${mod.name}</div>
            </div>
          </div>
          <span class="module-epic-badge">${mod.epicKey}</span>
        </div>
        <div class="module-desc">${mod.description}</div>
        <div class="module-card-stats">
          <span class="module-stat-tests">⚡ ${mod.testCount} Tests</span>
          <span class="module-stat-reqs">🎯 ${reqs.length} Reqs · ${mod.passRate} Pass</span>
        </div>
      </div>
    `;
  }).join('');
}

// Select a Module for Execution Scope
function selectRunModule(moduleId, notify = true) {
  state.selectedModuleId = moduleId;
  const mod = state.modules.find(m => m.id === moduleId) || state.modules[0];
  const reqs = getRequirementsForModule(mod.id);

  // Update active state in cards
  document.querySelectorAll('.module-card').forEach(card => card.classList.remove('active'));
  const activeCard = document.getElementById(`mod-card-${mod.id}`);
  if (activeCard) activeCard.classList.add('active');

  // Update scope test count & summary card
  state.selectedScopeTestsCount = mod.testCount;
  const summaryCount = document.getElementById('summary-tests-count');
  if (summaryCount) {
    summaryCount.innerHTML = `<strong>${mod.testCount} Tests</strong> <span class="text-xs text-secondary">(Module: ${mod.name})</span>`;
  }

  // Update Module Requirements Preview box
  const previewTitle = document.getElementById('module-reqs-header-title');
  const countBadge = document.getElementById('module-reqs-count-badge');
  const chipsContainer = document.getElementById('module-reqs-chips');

  if (previewTitle) previewTitle.textContent = `Requirements Covered in "${mod.name}" (${mod.epicKey})`;
  if (countBadge) countBadge.textContent = `${reqs.length} Requirements`;

  if (chipsContainer) {
    chipsContainer.innerHTML = reqs.map(r => `
      <div class="req-chip" title="${escapeHtml(r.story || '')}">
        <span class="req-chip-id">${r.id}</span>
        <span>${escapeHtml(r.title)}</span>
      </div>
    `).join('');
  }

  // Update CLI Command ingress preview
  const cliCode = document.getElementById('module-cli-code');
  if (cliCode) {
    cliCode.textContent = `autoq run --module "${mod.name}" --epic "${mod.epicKey}" --shards ${state.shardCount} --env ${state.targetEnv}`;
  }

  updateShardEstimates(state.shardCount);

  if (notify) {
    showToast(`Scope set to Module: ${mod.name} (${mod.testCount} tests across ${reqs.length} requirements)`, 'info');
  }
}

// Library Module Filter & Interactive Scope Banner
function onLibraryModuleFilterChange(moduleId) {
  state.filteredLibraryModule = moduleId;
  const bannerContainer = document.getElementById('library-module-banner-container');

  if (moduleId === 'all') {
    if (bannerContainer) bannerContainer.innerHTML = '';
  } else {
    const mod = state.modules.find(m => m.id === moduleId);
    if (mod && bannerContainer) {
      const reqs = getRequirementsForModule(mod.id);
      bannerContainer.innerHTML = `
        <div class="module-banner-lib">
          <div class="module-banner-info">
            <span style="font-size: 1.6rem;">${mod.icon}</span>
            <div>
              <div class="module-banner-title">Active Module Scope: ${mod.name} <span class="badge badge-subtle font-mono">${mod.epicKey}</span></div>
              <div class="module-banner-meta">${reqs.length} Linked Upstream Requirements · ${mod.testCount} Automated Tests · ${mod.passRate} Pass Rate · AutoQ Dynamic Mapping</div>
            </div>
          </div>
          <div class="module-banner-actions">
            <button class="btn btn-sm btn-primary" onclick="runModuleFromLibrary('${mod.id}')">⚡ Run Entire Module in Sandboxes</button>
            <button class="btn btn-sm btn-outline" onclick="openNewRequirementModal()">🎯 + Add Requirement</button>
          </div>
        </div>
      `;
    }
  }

  renderTestLibrary();
}

// 1-Click execute entire module from library banner
function runModuleFromLibrary(moduleId) {
  const mod = state.modules.find(m => m.id === moduleId) || state.modules[0];
  state.runScopeMode = 'module';
  selectRunModule(mod.id, false);

  // Sync builder mode toggle
  setRunScopeMode('module');

  showToast(`Initiating execution for Module: ${mod.name} (${mod.testCount} tests across all requirements)...`, 'info');
  setTimeout(() => {
    navigateToScreen('results');
    startSimulatedLiveRun();
  }, 400);
}

// ==========================================================================
// 4. GLOBAL ENVIRONMENT SYNCHRONIZATION
// ==========================================================================
function setGlobalEnvironment(env, notify = true) {
  state.targetEnv = env.toLowerCase();

  const builderEnv = document.getElementById('builder-target-env');
  if (builderEnv) builderEnv.value = state.targetEnv;

  const modalEnv = document.getElementById('modal-env-picker');
  if (modalEnv) modalEnv.value = state.targetEnv;

  // Update AI Studio Context Badge
  const ctxBadge = document.querySelector('.chat-header .badge');
  if (ctxBadge) {
    ctxBadge.textContent = `Context: ${getEnvLabel(state.targetEnv)} | ${state.currentReq}`;
  }

  // Update Execution Screen Subtitle
  const subTitle = document.getElementById('live-run-subtitle');
  if (subTitle) {
    subTitle.textContent = `Run #${state.completedRuns} · ${getEnvLabel(state.targetEnv)} · Orchestrated via Azure Sandboxes`;
  }

  // Update Triage Browser URL bar
  const urlBar = document.querySelector('.browser-address-bar');
  if (urlBar) {
    urlBar.textContent = `https://${getEnvHost(state.targetEnv)}/cart`;
  }

  if (notify) {
    showToast(`Target Environment set to ${getEnvLabel(state.targetEnv)}`, 'info');
  }
}

// ==========================================================================
// 5. DYNAMIC POD SHARDS RENDERING ON EXECUTION SCREEN
// ==========================================================================
function renderPodShards() {
  const grid = document.getElementById('pod-shards-grid');
  if (!grid) return;

  const podNames = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi'];
  const count = state.shardCount;
  const testsPerShard = Math.ceil((state.selectedScopeTestsCount || 42) / count);

  grid.innerHTML = '';

  for (let i = 1; i <= count; i++) {
    const podCard = document.createElement('div');
    const isFailed = i === 2; // Shard 2 has the failure demo
    const isCompleted = i === 1;
    const podName = podNames[i - 1] || `pod-${i}`;

    podCard.className = `pod-card ${!isCompleted ? 'active-pod' : ''}`;

    let statusBadge = '';
    if (isCompleted) {
      statusBadge = '<span class="badge badge-success">Completed</span>';
    } else if (isFailed) {
      statusBadge = '<span class="badge badge-warning">1 Failure</span>';
    } else {
      statusBadge = '<span class="badge badge-accent">Running</span>';
    }

    let streamLines = '';
    if (state.currentEngine === 'cypress') {
      streamLines = `
        <div class="stream-line text-success">✓ cy.visit('/') (0.8s)</div>
        <div class="stream-line ${isFailed ? 'text-danger clickable-stream' : 'text-success'}" ${isFailed ? 'onclick="navigateToScreen(\'triage\')"' : ''}>
          ${isFailed ? '✗ cy.get("#checkout-btn") timeout [Inspect]' : '✓ cy.get("#add-to-cart").click()'}
        </div>
        <div class="stream-line text-accent">▶ cy.url().should("include", "/cart")</div>
      `;
    } else if (state.currentEngine === 'selenium') {
      streamLines = `
        <div class="stream-line text-success">✓ driver.get(BASE_URL) (1.2s)</div>
        <div class="stream-line ${isFailed ? 'text-danger clickable-stream' : 'text-success'}" ${isFailed ? 'onclick="navigateToScreen(\'triage\')"' : ''}>
          ${isFailed ? '✗ NoSuchElementException: .checkout-btn [Inspect]' : '✓ driver.findElement(By.id("cart")).click()'}
        </div>
        <div class="stream-line text-accent">▶ driver.wait(until.urlContains)</div>
      `;
    } else {
      streamLines = `
        <div class="stream-line text-success">✓ TC-${100 + i}: Setup & Auth token (1.2s)</div>
        <div class="stream-line ${isFailed ? 'text-danger clickable-stream' : 'text-success'}" ${isFailed ? 'onclick="navigateToScreen(\'triage\')"' : ''}>
          ${isFailed ? '✗ TC-105: Checkout locator timeout [Inspect]' : `✓ TC-${104 + i}: Step validation (1.4s)`}
        </div>
        <div class="stream-line text-accent">▶ TC-${110 + i}: Running step verification...</div>
      `;
    }

    podCard.innerHTML = `
      <div class="pod-header">
        <div class="pod-title">
          <span class="status-dot ${isCompleted ? 'online' : 'running-pulse'}"></span>
          <strong>Shard ${i}</strong> · Pod-sbx-${podName}
        </div>
        ${statusBadge}
      </div>
      <div class="pod-details">
        <div>Tests: <strong>${testsPerShard}/${testsPerShard}</strong></div>
        <div>Engine: <strong>${state.currentEngine.toUpperCase()}</strong></div>
      </div>
      <div class="pod-test-stream">
        ${streamLines}
      </div>
    `;

    grid.appendChild(podCard);
  }
}

// Navigation Handling
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetScreen = item.getAttribute('data-screen');
      navigateToScreen(targetScreen);
    });
  });

  // Quick Run Modal Trigger
  const btnQuickRun = document.getElementById('btn-quick-run-modal');
  if (btnQuickRun) {
    btnQuickRun.addEventListener('click', openQuickRunModal);
  }

  // Dashboard Refresh
  const btnRefresh = document.getElementById('btn-refresh-dashboard');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      showToast('Dashboard metrics synced with Azure cluster', 'success');
    });
  }

  const btnExport = document.getElementById('btn-export-qa-report');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      showToast('Exported Executive Automation Summary for Leadership (PDF ready)', 'info');
    });
  }
}

function navigateToScreen(screenId) {
  state.currentScreen = screenId;

  // Toggle screens
  document.querySelectorAll('.screen-view').forEach(screen => {
    screen.classList.remove('active');
  });

  const activeScreen = document.getElementById(`screen-${screenId}`);
  if (activeScreen) {
    activeScreen.classList.add('active');
  }

  // Update Sidebar active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-screen') === screenId) {
      item.classList.add('active');
    }
  });

  // Update Breadcrumb
  const breadcrumbText = {
    'dashboard': 'Dashboard',
    'library': 'Test Library & Suites',
    'detail': 'Test Case Detail',
    'authoring': 'AI Authoring Studio',
    'run-builder': 'Run Builder & Orchestrator',
    'results': 'Execution & Sandboxes',
    'triage': 'AI Failure Triage',
    'architecture': 'System Architecture Spec'
  }[screenId] || 'Dashboard';

  const bcEl = document.getElementById('bc-current-page');
  if (bcEl) bcEl.textContent = breadcrumbText;

  // Scroll to top
  const mainWrapper = document.querySelector('.content-body');
  if (mainWrapper) mainWrapper.scrollTop = 0;
}

// Render Test Library Table
function renderTestLibrary() {
  const tbody = document.getElementById('library-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  const displayList = testLibrary.filter(test => {
    if (state.filteredLibraryModule === 'all') return true;
    return test.moduleId === state.filteredLibraryModule;
  });

  displayList.forEach(test => {
    const tr = document.createElement('tr');
    tr.className = 'clickable-row';

    const isChecked = state.selectedTests.has(test.id);
    const statusClass = test.lastStatus === 'passed' ? 'status-pass' : 'status-fail';
    const statusLabel = test.lastStatus === 'passed' ? '✓ Passed' : '✗ Failed';

    tr.innerHTML = `
      <td onclick="event.stopPropagation()">
        <input type="checkbox" class="test-checkbox" data-id="${test.id}" ${isChecked ? 'checked' : ''} onchange="toggleTestSelection('${test.id}')" />
      </td>
      <td onclick="openTestCaseDetail('${test.id}')">
        <div><strong style="color: #fff;">${test.id}</strong>: ${test.name}</div>
        <div class="text-xs text-muted">Runtime: ${test.duration}</div>
      </td>
      <td onclick="openTestCaseDetail('${test.id}')">
        <span class="badge badge-accent">${test.moduleName || 'Checkout & Payments'}</span>
        <div class="text-xs text-muted font-mono mt-1">${test.epicKey || 'KYX-EPIC-01'}</div>
      </td>
      <td onclick="openTestCaseDetail('${test.id}')">
        <span class="badge badge-subtle">${test.requirement.id}</span>
        <div class="text-xs text-secondary mt-1">${test.requirement.title}</div>
      </td>
      <td onclick="openTestCaseDetail('${test.id}')">
        <div class="flex-align-center gap-2">
          <span class="badge badge-subtle">${test.engine}</span>
          <span class="code-pill">${test.scriptPath}</span>
        </div>
      </td>
      <td onclick="openTestCaseDetail('${test.id}')">
        ${test.tags.map(t => `<span class="badge badge-subtle">${t}</span>`).join(' ')}
      </td>
      <td onclick="openTestCaseDetail('${test.id}')">
        <span class="status-pill ${statusClass}">${statusLabel}</span>
      </td>
      <td onclick="event.stopPropagation()">
        <button class="btn btn-xs btn-outline" onclick="openTestCaseDetail('${test.id}')">Detail</button>
        <button class="btn btn-xs btn-primary ml-1" onclick="runSingleTestFromRow('${test.id}')">Run</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  updateSelectedCounter();
}

function toggleTestSelection(testId) {
  if (state.selectedTests.has(testId)) {
    state.selectedTests.delete(testId);
  } else {
    state.selectedTests.add(testId);
  }
  updateSelectedCounter();
}

function updateSelectedCounter() {
  const count = state.selectedTests.size;
  const counterEl = document.getElementById('selected-counter');
  const bulkBar = document.getElementById('bulk-actions');

  if (counterEl) {
    counterEl.textContent = `${count} test${count === 1 ? '' : 's'} selected`;
  }
  if (bulkBar) {
    bulkBar.style.display = count > 0 ? 'flex' : 'none';
  }
}

function openTestCaseDetail(testId) {
  const test = testLibrary.find(t => t.id === testId) || testLibrary[2];
  const titleEl = document.getElementById('detail-test-title');
  if (titleEl) {
    titleEl.textContent = `${test.id}: ${test.name}`;
  }
  navigateToScreen('detail');
}

function switchDetailTab(tabName) {
  state.activeDetailTab = tabName;
  document.querySelectorAll('.tab-pill').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');

  if (event && event.target) {
    event.target.classList.add('active');
  }

  const activePanel = document.getElementById(`detail-tab-${tabName}`);
  if (activePanel) {
    activePanel.style.display = 'block';
  }
}

// ==========================================================================
// 6. AI AUTHORING STUDIO & CHATBOT WITH REQUIREMENT EXPANSION
// ==========================================================================
function initChatStudio() {
  const sendBtn = document.getElementById('btn-send-chat');
  const inputEl = document.getElementById('chat-user-input');

  if (sendBtn && inputEl) {
    sendBtn.addEventListener('click', () => {
      const text = inputEl.value.trim();
      if (text) {
        processChatMessage(text);
        inputEl.value = '';
      }
    });

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
      }
    });
  }

  const btnRunStudio = document.getElementById('btn-run-studio-test');
  if (btnRunStudio) {
    btnRunStudio.addEventListener('click', simulateStudioSandboxExecution);
  }

  const btnCommit = document.getElementById('btn-commit-studio-code');
  if (btnCommit) {
    btnCommit.addEventListener('click', () => {
      showToast(`Committed ${getEngineLabel(state.currentEngine)} script to Git branch: feature/${state.currentReq.toLowerCase()}-automation`, 'success');
      const unsavedIndicator = document.querySelector('.file-status-indicator');
      if (unsavedIndicator) {
        unsavedIndicator.textContent = '✓ Synced with Git';
        unsavedIndicator.classList.remove('unsaved');
        unsavedIndicator.classList.add('text-success');
      }
    });
  }
}

function sendSamplePrompt(topicOrText) {
  const engName = getEngineSimpleName(state.currentEngine);
  let finalPrompt = '';

  if (topicOrText === 'apple-pay' || topicOrText.includes('apple-pay') || topicOrText.includes('create-req')) {
    finalPrompt = `Create a new requirement for Apple Pay one-click checkout and generate the test suite in ${engName}`;
  } else if (topicOrText === 'password' || topicOrText.includes('password') || topicOrText.includes('reset')) {
    finalPrompt = `Write a ${engName} test for resetting user password with email verification`;
  } else if (topicOrText === 'coupon' || topicOrText.includes('coupon') || topicOrText.includes('boundary')) {
    finalPrompt = `Generate 3 boundary test cases for coupon discount in ${engName}`;
  } else if (topicOrText === 'checkout' || topicOrText.includes('checkout')) {
    finalPrompt = `Create end-to-end checkout flow verification using ${engName}`;
  } else if (topicOrText === 'module' || topicOrText.includes('module')) {
    finalPrompt = `Test the entire Checkout & Payments module including all underlying requirements`;
  } else {
    finalPrompt = topicOrText.replace(/\b(Playwright|Cypress|Selenium)\b/gi, engName);
  }

  const inputEl = document.getElementById('chat-user-input');
  if (inputEl) {
    inputEl.value = finalPrompt;
    processChatMessage(finalPrompt);
    inputEl.value = '';
  }
}

// When Ribbon values change in Studio
function onStudioMetadataChange() {
  const reqSelect = document.getElementById('studio-req-selector');
  if (reqSelect) {
    state.currentReq = reqSelect.value;
    state.currentReqTitle = reqSelect.options[reqSelect.selectedIndex].text.replace(/\[.*?\]\s*/, '');
  }

  const engineSelect = document.getElementById('studio-engine-selector');
  if (engineSelect && engineSelect.value !== state.currentEngine) {
    setGlobalEngine(engineSelect.value);
    return;
  }

  const tags = [];
  if (document.getElementById('tag-smoke')?.checked) tags.push('@smoke');
  if (document.getElementById('tag-regression')?.checked) tags.push('@regression');
  if (document.getElementById('tag-e2e')?.checked) tags.push('@e2e');
  state.currentTags = tags;

  // Re-generate template matching metadata
  renderStudioCodeTemplate();

  // Update Context badge
  const ctxBadge = document.querySelector('.chat-header .badge');
  if (ctxBadge) {
    ctxBadge.textContent = `Context: ${getEnvLabel(state.targetEnv)} | ${state.currentReq}`;
  }

  showToast(`Updated Metadata: ${state.currentReq} · Tags: ${tags.join(', ')} · Engine: ${getEngineLabel(state.currentEngine)}`, 'info');
}

// Render dynamic code template based on active engine, requirement, and tags
function renderStudioCodeTemplate() {
  const editor = document.getElementById('studio-code-editor');
  if (!editor) return;

  const eng = state.currentEngine;
  const req = state.currentReq;
  const title = state.currentReqTitle;
  const tags = state.currentTags;
  const testName = state.currentTestName;

  let code = '';

  if (eng === 'cypress') {
    code = `// Linked Kyxo Requirement: ${req} - ${title}
// Engine: Cypress 13.x
describe('${testName} (${req})', () => {
  it('Execute verified scenario [${tags.join(' ')}]', () => {
    // 1. Visit target environment
    cy.visit(Cypress.env('APP_BASE_URL') || '/');

    // 2. Perform in-browser interactions
    cy.get('[data-testid="nav-shop"]').click();
    cy.get('[data-testid="add-to-cart"]').first().click();

    // 3. Verify cart badge
    cy.get('[data-testid="cart-count"]').should('contain', '1');
  });
});`;
  } else if (eng === 'selenium') {
    code = `const { Builder, By, until } = require('selenium-webdriver');

// Linked Kyxo Requirement: ${req} - ${title}
// Engine: Selenium 4.x Grid
describe('${testName} (${req})', function() {
  this.timeout(30000);

  it('Executes scenario with tags: ${tags.join(', ')}', async function() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
      await driver.get(process.env.APP_BASE_URL || 'http://localhost:3000');
      await driver.findElement(By.css('[data-testid="nav-shop"]')).click();
      await driver.findElement(By.css('[data-testid="add-to-cart"]')).click();
      await driver.wait(until.elementLocated(By.css('.cart-count')), 5000);
    } finally {
      await driver.quit();
    }
  });
});`;
  } else {
    // Playwright
    const tagListStr = tags.map(t => `'${t}'`).join(', ');
    code = `import { test, expect } from '@playwright/test';

// Linked Kyxo Requirement: ${req} - ${title}
// Engine: Playwright v1.48
test.describe('${testName} (${req})', () => {
  test('Execute verified scenario', {
    tag: [${tagListStr}, '@${req.toLowerCase()}']
  }, async ({ page }) => {
    // 1. Visit target environment
    await page.goto(process.env.APP_BASE_URL + '/');

    // 2. Perform actions with resilient role locators
    await page.getByRole('button', { name: 'Add to Cart' }).first().click();
    await page.getByTestId('cart-drawer-toggle').click();

    // 3. Assert cart drawer state
    await expect(page.getByTestId('cart-subtotal')).toBeVisible();
  });
});`;
  }

  editor.value = code;
}

// Chatbot Copilot: Reads active engine, requirement, tags & handles inline requirement creation
function processChatMessage(userMsg) {
  const container = document.getElementById('chat-messages-container');
  if (!container) return;

  // Add User Bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.innerHTML = `
    <div class="bubble-avatar">👤</div>
    <div class="bubble-content"><p>${escapeHtml(userMsg)}</p></div>
  `;
  container.appendChild(userBubble);
  container.scrollTop = container.scrollHeight;

  // Simulate AI Thinking & Response
  setTimeout(() => {
    const aiBubble = document.createElement('div');
    aiBubble.className = 'chat-bubble ai';

    const eng = state.currentEngine;
    const engineLabel = getEngineLabel(eng);

    // Scenario A: User wants to create a new requirement
    const isNewReqRequest = userMsg.toLowerCase().includes('requirement') || userMsg.toLowerCase().includes('apple pay') || userMsg.toLowerCase().includes('create req');

    if (isNewReqRequest) {
      let nextNum = 896;
      state.requirements.forEach(r => {
        const num = parseInt(r.id.replace(/\D/g, ''), 10);
        if (!isNaN(num) && num >= nextNum) nextNum = num + 1;
      });
      const newReqId = `REQ-${nextNum}`;
      const newReqTitle = 'One-Click Apple Pay & Biometric Checkout';

      const createdReq = {
        id: newReqId,
        title: newReqTitle,
        domain: 'Payments',
        priority: 'P0 - Blocker',
        story: 'As an iOS Safari shopper, I want to authenticate checkout using Apple Pay biometric FaceID, so that I can complete purchases without typing billing details.',
        criteria: 'Given user is on checkout in Apple Pay compatible browser, When user taps Apple Pay button, Then biometric sheet displays subtotal and returns confirmation token.'
      };

      if (!state.requirements.some(r => r.id === newReqId)) {
        state.requirements.push(createdReq);
      }

      state.currentReq = newReqId;
      state.currentReqTitle = newReqTitle;
      state.currentTestName = 'Apple Pay Biometric Authorization';

      renderRequirementDropdowns();
      updateStudioFileTab();

      // Update Context badge
      const ctxBadge = document.querySelector('.chat-header .badge');
      if (ctxBadge) {
        ctxBadge.textContent = `Context: ${getEnvLabel(state.targetEnv)} | ${newReqId}`;
      }

      aiBubble.innerHTML = `
        <div class="bubble-avatar">🤖</div>
        <div class="bubble-content">
          <div class="req-creation-card mb-2">
            <div class="flex-align-center justify-between">
              <span class="badge badge-accent">🎯 Created & Linked: <strong>${newReqId}</strong></span>
              <span class="badge badge-success">✓ Synced to Kyxo (Epic KYX)</span>
            </div>
            <div class="font-semibold text-sm text-white mt-1">${newReqTitle}</div>
            <div class="text-xs text-secondary mt-1"><strong>User Story:</strong> As an iOS Safari shopper, I want to authenticate checkout via Apple Pay FaceID without typing card details.</div>
            <div class="text-xs text-muted mt-1"><strong>Gherkin Criteria:</strong> Given Apple Pay compatible device, When user authorizes biometric prompt, Then token returns within 2s.</div>
          </div>
          <p>I have registered <strong>${newReqId}</strong> in Kyxo STLC and automatically authored 3 test scenarios in <strong>${engineLabel}</strong>:</p>
          <div class="text-xs text-secondary mt-1">✓ TC-301: Happy Path Biometric (Smoke P0) · ✓ TC-302: Fallback (Regression) · ✓ TC-303: Sheet Dismissal (Regression)</div>
        </div>
      `;
      container.appendChild(aiBubble);
      container.scrollTop = container.scrollHeight;

      // Populate multi-scenario code in editor
      renderMultiScenarioSuite(createdReq);
      showToast(`🎯 Created ${newReqId} and generated ${engineLabel} test suite!`, 'success');
      return;
    }

    // Scenario B: User wants to test an entire Feature / Module / Epic
    const isModuleRunRequest = userMsg.toLowerCase().includes('module') || 
                               userMsg.toLowerCase().includes('epic') || 
                               userMsg.toLowerCase().includes('run checkout') || 
                               userMsg.toLowerCase().includes('test checkout') ||
                               userMsg.toLowerCase().includes('test payments') ||
                               userMsg.toLowerCase().includes('test auth');

    if (isModuleRunRequest) {
      let targetModId = 'payments';
      const msgLow = userMsg.toLowerCase();
      if (msgLow.includes('auth') || msgLow.includes('identity')) targetModId = 'auth';
      else if (msgLow.includes('catalog') || msgLow.includes('storefront')) targetModId = 'catalog';
      else if (msgLow.includes('order') || msgLow.includes('invoice')) targetModId = 'orders';

      const mod = state.modules.find(m => m.id === targetModId) || state.modules[0];
      const reqs = getRequirementsForModule(mod.id);

      aiBubble.innerHTML = `
        <div class="bubble-avatar">🤖</div>
        <div class="bubble-content">
          <div class="req-creation-card mb-2" style="background: rgba(6, 182, 212, 0.12); border-color: rgba(6, 182, 212, 0.35);">
            <div class="flex-align-center justify-between">
              <span class="badge badge-accent">📦 Module Scope Resolved: <strong>${mod.name}</strong></span>
              <span class="badge badge-subtle font-mono">${mod.epicKey}</span>
            </div>
            <div class="text-xs text-secondary mt-1"><strong>AutoQ Traceability:</strong> Epic → Requirements (${reqs.length}) → Tests (${mod.testCount}) → Git Scripts</div>
            <div class="mt-2 text-xs">
              <strong>Covered Requirements in this Module:</strong>
              <div class="flex-align-center gap-1 mt-1" style="flex-wrap: wrap;">
                ${reqs.map(r => `<span class="badge badge-subtle font-mono">${r.id}: ${r.title.slice(0, 24)}...</span>`).join('')}
              </div>
            </div>
          </div>
          <p>I have configured the Run Orchestrator to execute all <strong>${mod.testCount} tests</strong> under <strong>${mod.name}</strong> across <strong>${state.shardCount} Azure Sandboxes</strong> in <strong>${getEnvLabel(state.targetEnv)}</strong> using <strong>${engineLabel}</strong>.</p>
          <div class="flex-align-center gap-2 mt-3">
            <button class="btn btn-xs btn-primary" onclick="runModuleFromLibrary('${mod.id}')">⚡ Execute ${mod.name} in Sandboxes Now</button>
            <button class="btn btn-xs btn-outline" onclick="navigateToScreen('run-builder')">Inspect Shards in Run Builder →</button>
          </div>
        </div>
      `;
      container.appendChild(aiBubble);
      container.scrollTop = container.scrollHeight;
      showToast(`📦 Resolved Module: ${mod.name} (${mod.testCount} tests across ${reqs.length} requirements)`, 'info');
      return;
    }

    // Scenario C: Standard prompt response
    const req = state.currentReq;
    const reqTitle = state.currentReqTitle;
    const tags = state.currentTags;

    let aiResponseText = `I analyzed your request. I generated an optimized <strong>${engineLabel}</strong> test linked to <strong>${req}: ${reqTitle}</strong> with tags <strong>[${tags.join(', ')}]</strong>:`;
    let newCode = '';

    const isPassword = userMsg.toLowerCase().includes('password') || userMsg.toLowerCase().includes('reset');
    const isCoupon = userMsg.toLowerCase().includes('coupon') || userMsg.toLowerCase().includes('boundary');

    if (eng === 'cypress') {
      if (isPassword) {
        newCode = `// Linked Kyxo Requirement: ${req} - ${reqTitle}
// Generated for Cypress 13.x
describe('Password Reset Flow (${req})', () => {
  it('Requests reset link with email [${tags.join(' ')}]', () => {
    cy.visit('/forgot-password');
    cy.get('input[type="email"]').type('qa-tester@company.internal');
    cy.contains('button', 'Send Reset Link').click();
    cy.get('[role="alert"]').should('be.visible').and('contain', 'Reset link sent to your inbox');
  });
});`;
      } else if (isCoupon) {
        newCode = `// Linked Kyxo Requirement: ${req} - ${reqTitle}
// Generated for Cypress 13.x
describe('Coupon Boundary Tests (${req})', () => {
  const codes = ['', 'TOOLONGENGINEERINGCOUPON300', 'EXPIRED2024'];
  codes.forEach((code) => {
    it(\`Rejects invalid voucher "\${code}" [${tags.join(' ')}]\`, () => {
      cy.visit('/checkout');
      if (code) cy.get('input[placeholder="Enter Promo Code"]').type(code);
      cy.contains('button', 'Apply').click();
      cy.get('[data-testid="coupon-error-banner"]').should('be.visible');
    });
  });
});`;
      } else {
        newCode = `// Linked Kyxo Requirement: ${req} - ${reqTitle}
// Generated for Cypress 13.x
describe('${state.currentTestName} (${req})', () => {
  it('Executes resilient flow [${tags.join(' ')}]', () => {
    cy.visit('/shop');
    cy.contains('button', /Complete Purchase|Proceed to Checkout/i).click();
    cy.url().should('include', '/checkout/success');
  });
});`;
      }
    } else if (eng === 'selenium') {
      newCode = `const { Builder, By, until } = require('selenium-webdriver');

// Linked Kyxo Requirement: ${req} - ${reqTitle}
// Generated for Selenium 4.x
describe('${state.currentTestName} (${req})', function() {
  this.timeout(30000);
  it('Executes scenario with tags: ${tags.join(', ')}', async function() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
      await driver.get(process.env.APP_BASE_URL + '/checkout');
      await driver.findElement(By.name('promo')).sendKeys('AUTUMN20');
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(until.elementLocated(By.css('.discount-badge')), 5000);
    } finally {
      await driver.quit();
    }
  });
});`;
    } else {
      // Playwright default
      const tagListStr = tags.map(t => `'${t}'`).join(', ');
      if (isPassword) {
        newCode = `import { test, expect } from '@playwright/test';

// Linked Kyxo Requirement: ${req} - ${reqTitle}
test.describe('Password Reset Flow (${req})', () => {
  test('TC-106: Request reset link with email and verify cooldown timer', {
    tag: [${tagListStr}, '@${req.toLowerCase()}']
  }, async ({ page }) => {
    await page.goto(process.env.APP_BASE_URL + '/forgot-password');
    await page.getByLabel('Work Email').fill('qa-tester@company.internal');
    await page.getByRole('button', { name: 'Send Reset Link' }).click();

    // Verify accessible toast notification
    const alert = page.getByRole('alert');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText('Reset link sent to your inbox');

    // Verify rate limit button cooldown
    await expect(page.getByRole('button', { name: 'Resend in 60s' })).toBeDisabled();
  });
});`;
      } else if (isCoupon) {
        newCode = `import { test, expect } from '@playwright/test';

// Linked Kyxo Requirement: ${req} - ${reqTitle}
test.describe('Coupon Boundary Tests (${req})', () => {
  const testCases = [
    { code: '', expected: 'Coupon code cannot be empty' },
    { code: 'TOOLONGENGINEERINGCOUPON300', expected: 'Exceeds 20 character limit' },
    { code: 'EXPIRED2024', expected: 'Voucher code expired on Dec 31' }
  ];

  for (const { code, expected } of testCases) {
    test(\`Verify invalid coupon rejection for: "\${code}"\`, {
      tag: [${tagListStr}, '@${req.toLowerCase()}']
    }, async ({ page }) => {
      await page.goto(process.env.APP_BASE_URL + '/checkout');
      await page.getByPlaceholder('Enter Promo Code').fill(code);
      await page.getByRole('button', { name: 'Apply' }).click();
      await expect(page.getByTestId('coupon-error-banner')).toHaveText(expected);
    });
  }
});`;
      } else {
        newCode = `import { test, expect } from '@playwright/test';

// Linked Kyxo Requirement: ${req} - ${reqTitle}
test.describe('${state.currentTestName} (${req})', () => {
  test('Execute checkout with auto-healing fallback locator', {
    tag: [${tagListStr}, '@${req.toLowerCase()}']
  }, async ({ page }) => {
    await page.goto(process.env.APP_BASE_URL + '/shop');
    const checkoutBtn = page.getByRole('button', { name: /Complete Purchase|Proceed to Checkout/i });
    await expect(checkoutBtn).toBeVisible({ timeout: 10000 });
    await checkoutBtn.click();
    await expect(page).toHaveURL(/.*checkout\\/success/);
  });
});`;
      }
    }

    aiBubble.innerHTML = `
      <div class="bubble-avatar">🤖</div>
      <div class="bubble-content">
        <p>${aiResponseText}</p>
        <p class="text-xs text-secondary mt-1">Updated code canvas in <strong>${engineLabel}</strong>. Ready to test in Azure Kata sandbox.</p>
      </div>
    `;
    container.appendChild(aiBubble);
    container.scrollTop = container.scrollHeight;

    // Update Code Editor
    const editorEl = document.getElementById('studio-code-editor');
    if (editorEl && newCode) {
      editorEl.value = newCode;
      const unsavedIndicator = document.querySelector('.file-status-indicator');
      if (unsavedIndicator) {
        unsavedIndicator.textContent = '● Unsaved Changes';
        unsavedIndicator.classList.add('unsaved');
      }
    }
  }, 500);
}

// Sandbox execution simulator in studio
function simulateStudioSandboxExecution() {
  const consoleOutput = document.getElementById('studio-console-output');
  const execBadge = document.getElementById('studio-exec-badge');

  if (!consoleOutput) return;

  const eng = state.currentEngine;
  const engineLabel = getEngineLabel(eng);

  execBadge.textContent = 'Spinning Sandbox Pod...';
  execBadge.className = 'badge badge-sm badge-warning';
  consoleOutput.textContent = `[Init] Requesting Azure AKS Kata container runner...\n[WarmPool] Attached pre-warmed pod: azure-aks-${eng}-runner-04 (0.8s)`;

  setTimeout(() => {
    consoleOutput.textContent += `\n[Secrets] Loaded Azure KeyVault credentials (${state.targetEnv.toUpperCase()}_ENV)`;
    if (eng === 'cypress') {
      consoleOutput.textContent += `\n[Cypress] Running tests via Electron headless container...`;
    } else if (eng === 'selenium') {
      consoleOutput.textContent += `\n[Selenium] Running tests via ChromeDriver headless on port 9515...`;
    } else {
      consoleOutput.textContent += `\n[Playwright] Running test via Node.js headless Chromium...`;
    }
    execBadge.textContent = `Running (${engineLabel})`;
    execBadge.className = 'badge badge-sm badge-accent';
  }, 1000);

  setTimeout(() => {
    consoleOutput.textContent += `\n✓ TC-106: Test scenario passed (1.3s)`;
    consoleOutput.textContent += `\n[Artifacts] Captured trace.zip & screenshot.png to Azure Blob`;
    consoleOutput.textContent += `\n[Cleanup] Kata Sandbox pod destroyed cleanly. Cost: $0.0003`;
    execBadge.textContent = '100% Passed';
    execBadge.className = 'badge badge-sm badge-success';
    showToast(`Sandbox test executed and passed in 1.3s via ${engineLabel}!`, 'success');
  }, 2200);
}

// Preset loader for run builder
function loadRunTemplate(type) {
  if (type === 'module-payments') {
    setRunScopeMode('module');
    selectRunModule('payments');
    showToast('Loaded Checkout & Payments Epic Preset (42 Tests · 3 Requirements)', 'info');
    return;
  }

  setRunScopeMode('tags');
  if (type === 'smoke') {
    setGlobalShardCount(2);
    const cbSmoke = document.getElementById('scope-tag-smoke');
    const cbReg = document.getElementById('scope-tag-regression');
    if (cbSmoke) cbSmoke.checked = true;
    if (cbReg) cbReg.checked = false;
    onScopeTagsChange();
    showToast('Loaded Smoke Suite Preset (2 Shards, @smoke only)', 'info');
  } else {
    setGlobalShardCount(8);
    const cbSmoke = document.getElementById('scope-tag-smoke');
    const cbReg = document.getElementById('scope-tag-regression');
    const cbE2e = document.getElementById('scope-tag-e2e');
    const cbAuth = document.getElementById('scope-tag-auth');
    if (cbSmoke) cbSmoke.checked = true;
    if (cbReg) cbReg.checked = true;
    if (cbE2e) cbE2e.checked = true;
    if (cbAuth) cbAuth.checked = true;
    onScopeTagsChange();
    showToast('Loaded Full Regression Preset (8 Shards, All Suites)', 'info');
  }
}

function launchLiveExecution() {
  navigateToScreen('results');
  startSimulatedLiveRun();
}

function startSimulatedLiveRun() {
  state.runInProgress = true;
  state.completedRuns++;

  const statusBadge = document.getElementById('live-run-status-badge');
  const subTitle = document.getElementById('live-run-subtitle');
  if (statusBadge) statusBadge.textContent = `Running · ${state.shardCount} Shards`;

  const logBox = document.getElementById('live-unified-logs');

  if (state.runScopeMode === 'module') {
    const mod = state.modules.find(m => m.id === state.selectedModuleId) || state.modules[0];
    const reqs = getRequirementsForModule(mod.id);
    const reqIds = reqs.map(r => r.id).join(', ');

    if (subTitle) {
      subTitle.textContent = `Run #${state.completedRuns} · Module: ${mod.name} (${mod.epicKey}) · ${getEnvLabel(state.targetEnv)} · ${reqs.length} Reqs [${reqIds}]`;
    }

    if (logBox) {
      logBox.textContent = `[${getCurrentTime()}] [Orchestrator] Unified Ingress: Triggered run for Feature/Module "${mod.name}" (${mod.epicKey}).
[${getCurrentTime()}] [Orchestrator] Dynamic Resolution: Found ${reqs.length} linked upstream Kyxo Requirements: ${reqIds}.
[${getCurrentTime()}] [Orchestrator] Aggregated ${state.selectedScopeTestsCount} test cases linked to module requirements.
[${getCurrentTime()}] [Orchestrator] Elastic Sharding: Provisioned ${state.shardCount} Kata Sandboxes on Azure AKS cluster.
[${getCurrentTime()}] [Shard-1] Git shallow clone @ main (e8f4a12) completed in 390ms.
[${getCurrentTime()}] [Shard-1] Injected Azure KeyVault secrets for ${state.targetEnv.toUpperCase()} environment.
[${getCurrentTime()}] [Shard-1] Executing ${getEngineLabel(state.currentEngine)} tests for ${reqs[0] ? reqs[0].id : 'REQ-890'}...
[${getCurrentTime()}] [Shard-2] Executing tests for ${reqs[1] ? reqs[1].id : 'REQ-896'}...
[${getCurrentTime()}] [Shard-2] [WARN] TC-105 locator timeout. Captured visual trace and DOM snapshot to Azure Blob.
[${getCurrentTime()}] [AI-Triage] Triage pipeline initiated for failure TC-105 in Module ${mod.name}.`;
    }
  } else {
    if (subTitle) {
      subTitle.textContent = `Run #${state.completedRuns} · Scope: ${state.selectedScopeTestsCount} Tests · ${getEnvLabel(state.targetEnv)} · Orchestrated via Azure Sandboxes`;
    }

    if (logBox) {
      logBox.textContent = `[${getCurrentTime()}] [Orchestrator] Provisioned ${state.shardCount} Kata Sandboxes on AKS cluster.
[${getCurrentTime()}] [Shard-1] Git clone shallow @ main (e8f4a12) completed in 420ms.
[${getCurrentTime()}] [Shard-2] Injected environment secrets from Azure KeyVault (${state.targetEnv.toUpperCase()}).
[${getCurrentTime()}] [Shard-1] ${getEngineLabel(state.currentEngine)} worker launched.
[${getCurrentTime()}] [Shard-2] Running TC-105: Checkout button validation...
[${getCurrentTime()}] [Shard-2] [WARN] Locator timed out after 5000ms.
[${getCurrentTime()}] [Shard-2] Captured visual trace, screenshot and DOM snapshot to Azure Blob.
[${getCurrentTime()}] [AI-Triage] Triage pipeline initiated for failure TC-105. Analyzing DOM diff...`;
    }
  }

  renderPodShards();
  showToast(`Launched Run #${state.completedRuns} across ${state.shardCount} Azure Sandboxes (${getEngineLabel(state.currentEngine)})!`, 'success');
}

function cancelLiveRun() {
  state.runInProgress = false;
  const statusBadge = document.getElementById('live-run-status-badge');
  if (statusBadge) {
    statusBadge.textContent = 'Stopped by User';
    statusBadge.className = 'status-pill status-fail';
  }
  showToast('Orchestrated run stopped. Destroyed sandbox pods.', 'warning');
}

function clearLiveLogs() {
  const logBox = document.getElementById('live-unified-logs');
  if (logBox) logBox.textContent = '> Live log stream cleared.';
}

// AI Failure Triage & Self-Healing
function selectFailureItem(id) {
  state.activeFailureId = id;
  document.querySelectorAll('.fail-pill').forEach((pill, idx) => {
    pill.classList.toggle('active', idx + 1 === id);
  });

  const callout = document.querySelector('.failure-callout');
  const diffViewer = document.querySelector('.diff-viewer .diff-body');

  if (id === 1) {
    // TC-105: DOM changed
    if (callout) {
      callout.innerHTML = `
        <div class="callout-title">Classification: <strong>Outdated Test (Renamed DOM Element)</strong></div>
        <p class="text-sm text-secondary mt-1">
          The frontend team updated the checkout button locator in commit <span class="code-pill">web-ui@9bf21a</span>. 
          The old selector <code class="code-inline">data-testid="checkout-btn"</code> was migrated to an Accessible Button <code class="code-inline">getByRole('button', { name: 'Complete Purchase' })</code>.
        </p>
      `;
    }
    if (diffViewer) {
      diffViewer.innerHTML = `
        <div class="diff-line line-context">     // Proceed to order confirmation</div>
        <div class="diff-line line-context">     await page.getByPlaceholder('Promo').fill('SAVE10');</div>
        <div class="diff-line line-del">-    await page.locator('[data-testid="checkout-btn"]').click();</div>
        <div class="diff-line line-add">+    await page.getByRole('button', { name: 'Complete Purchase' }).click();</div>
        <div class="diff-line line-context">     await expect(page).toHaveURL(/.*checkout\\/success/);</div>
      `;
    }
  } else {
    // TC-202: Real Bug
    if (callout) {
      callout.innerHTML = `
        <div class="callout-title" style="color: #f87171;">Classification: <strong>Real Product Bug (Backend 500)</strong></div>
        <p class="text-sm text-secondary mt-1">
          The checkout backend returned HTTP 500 Internal Server Error when calculating sales tax for ZIP code '94016'. 
          DOM element rendered <code class="code-inline">"Server Error: TAX_SVC_TIMEOUT"</code>.
        </p>
      `;
    }
    if (diffViewer) {
      diffViewer.innerHTML = `
        <div class="diff-line line-context">     // Real Bug Detected: Test code is correct!</div>
        <div class="diff-line line-context">     // AutoQ auto-drafted Jira Bug: JIRA-4091</div>
        <div class="diff-line line-del">     Backend Response: 500 Internal Server Error</div>
        <div class="diff-line line-add">     Attached: network-har.zip, trace.zip, server-logs.txt</div>
      `;
    }
  }
}

function approveAndCommitPatch() {
  showToast('Approved! Auto-created Git PR #892 and updated branch main with self-healed test', 'success');
  const btnApprove = document.getElementById('btn-submit-heal');
  if (btnApprove) {
    btnApprove.innerHTML = '<span>✓ Patch Merged into Git</span>';
    btnApprove.classList.remove('btn-primary');
    btnApprove.classList.add('btn-secondary');
    btnApprove.disabled = true;
  }
}

function rejectAndMarkBug() {
  showToast('Rejected patch. Raised defect in Kyxo / Jira linked to REQ-890', 'warning');
}

// ==========================================================================
// 8. ARCHITECTURE SHOWCASE CONTROLLER (FLOW STEPPER, BLUEPRINT MODALS & DECISIONS)
// ==========================================================================

function initArchitectureShowcase() {
  // Populate first flow step by default
  inspectFlowStep(1);
  renderArchitecturalDecisions('all');
  selectArchScopeLevel('epic');

  // Backdrop click listener for Component Detail Modal
  const compModal = document.getElementById('component-detail-modal');
  if (compModal) {
    compModal.addEventListener('click', (e) => {
      if (e.target === compModal) closeCompModal();
    });
  }
}

// Select Architecture Scope Level for Traceability Decomposition
function selectArchScopeLevel(level) {
  state.activeArchScope = level;
  document.querySelectorAll('.scope-picker-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(`btn-scope-${level}`);
  if (btn) btn.classList.add('active');

  const container = document.getElementById('scope-decomposition-tree');
  if (!container) return;

  if (level === 'req') {
    container.innerHTML = `
      <div class="decomp-visual-container">
        <!-- Trigger Strip -->
        <div class="decomp-header-strip">
          <div class="flex-align-center gap-2">
            <span style="font-size: 1.1rem;">🎯</span>
            <div>
              <span class="text-xs font-bold text-white">TRIGGER: Execute Single Requirement "REQ-896"</span>
              <div class="text-xs text-cyan">One-Click Apple Pay &amp; Biometric Checkout</div>
            </div>
          </div>
          <div class="flex-align-center gap-2">
            <span class="badge badge-accent font-mono" style="font-size: 0.65rem;">Scope: requirement</span>
            <span class="badge badge-subtle font-mono" style="font-size: 0.65rem;">Parent: KYX-EPIC-01</span>
            <span class="badge badge-success font-mono" style="font-size: 0.65rem;">Allocated: 1 AKS Pod</span>
          </div>
        </div>

        <div class="decomp-flow-steps">
          <!-- Step 1: Upstream Kyxo Requirement Specification -->
          <div class="decomp-step-box">
            <div class="decomp-step-top">
              <div class="flex-align-center gap-2">
                <span class="step-circle" style="background: var(--accent-purple);">1</span>
                <span class="text-xs font-bold text-white">UPSTREAM REQUIREMENT SPECIFICATION (Kyxo STLC)</span>
              </div>
              <span class="badge badge-subtle font-mono" style="font-size: 0.65rem;">ID: REQ-896 · P0 Blocker</span>
            </div>
            <div style="background: var(--bg-card-muted); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 8px 12px; margin-bottom: 6px;">
              <div class="text-xs text-muted" style="margin-bottom: 2px;">User Story:</div>
              <div class="text-xs text-white">"As an iOS Safari shopper, I want to authenticate checkout via Apple Pay FaceID without typing billing details."</div>
            </div>
            <div style="background: var(--bg-card-muted); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 8px 12px;">
              <div class="text-xs text-muted" style="margin-bottom: 2px;">Gherkin Acceptance Criteria:</div>
              <div class="text-xs font-mono text-cyan">Given Apple Pay compatible device, When user authorizes biometric prompt, Then confirmation token returns within 2s.</div>
            </div>
          </div>

          <!-- Step 2: Linked Test Cases -->
          <div class="decomp-step-box">
            <div class="decomp-step-top">
              <div class="flex-align-center gap-2">
                <span class="step-circle" style="background: var(--primary);">2</span>
                <span class="text-xs font-bold text-white">LINKED TEST CASES (Direct 1-to-Many STLC Mapping)</span>
              </div>
              <span class="badge badge-success font-mono" style="font-size: 0.65rem;">3 Tests Linked</span>
            </div>
            <div class="decomp-card-grid">
              <div class="decomp-card">
                <div class="flex-align-center justify-between">
                  <span class="font-mono text-xs font-bold text-cyan">TC-301</span>
                  <span class="badge badge-accent" style="font-size: 0.6rem;">Smoke P0</span>
                </div>
                <div class="text-xs text-white mt-1">Apple Pay FaceID Authorization</div>
                <div class="text-xs text-muted font-mono mt-1" style="font-size: 0.65rem;">tests/e2e/apple-pay-checkout.spec.ts:12</div>
              </div>
              <div class="decomp-card">
                <div class="flex-align-center justify-between">
                  <span class="font-mono text-xs font-bold text-cyan">TC-302</span>
                  <span class="badge badge-subtle" style="font-size: 0.6rem;">Regression</span>
                </div>
                <div class="text-xs text-white mt-1">Fallback to Standard Card on Android</div>
                <div class="text-xs text-muted font-mono mt-1" style="font-size: 0.65rem;">tests/e2e/apple-pay-checkout.spec.ts:28</div>
              </div>
              <div class="decomp-card">
                <div class="flex-align-center justify-between">
                  <span class="font-mono text-xs font-bold text-cyan">TC-303</span>
                  <span class="badge badge-subtle" style="font-size: 0.6rem;">Boundary</span>
                </div>
                <div class="text-xs text-white mt-1">Graceful Dismiss of Payment Sheet</div>
                <div class="text-xs text-muted font-mono mt-1" style="font-size: 0.65rem;">tests/e2e/apple-pay-checkout.spec.ts:44</div>
              </div>
            </div>
          </div>

          <!-- Step 3: Ephemeral Sandbox Pod -->
          <div class="decomp-step-box">
            <div class="decomp-step-top">
              <div class="flex-align-center gap-2">
                <span class="step-circle" style="background: var(--accent-cyan);">3</span>
                <span class="text-xs font-bold text-white">EPHEMERAL SANDBOX EXECUTION (AKS Kata MicroVM)</span>
              </div>
              <span class="status-pill status-pass" style="font-size: 0.62rem;">18s Wall Clock</span>
            </div>
            <div style="background: rgba(6, 182, 212, 0.05); border: 1px solid rgba(6, 182, 212, 0.25); border-radius: var(--radius-sm); padding: 8px 12px; display: flex; align-items: center; justify-content: space-between;">
              <div class="flex-align-center gap-2">
                <span>🛡️</span>
                <span class="text-xs text-white font-mono">Pod shard-1 (AKS Kata Container, QEMU Guest Kernel)</span>
              </div>
              <span class="text-xs text-cyan">3 Tests executed in parallel · 0 Cross-tenant leaks</span>
            </div>
          </div>
        </div>

        <!-- Result Strip -->
        <div class="decomp-result-strip">
          <div class="flex-align-center gap-2">
            <span style="font-size: 1.1rem; color: var(--success);">✓</span>
            <div>
              <span class="text-xs font-bold text-white">Targeted Requirement acceptance criteria 100% verified!</span>
              <div class="text-xs text-secondary">Pass rate updated in Kyxo living requirement status. Ready for production release.</div>
            </div>
          </div>
          <span class="badge badge-success font-mono">STLC Synced</span>
        </div>
      </div>
    `;
  } else if (level === 'test') {
    container.innerHTML = `
      <div class="decomp-visual-container">
        <!-- Trigger Strip -->
        <div class="decomp-header-strip">
          <div class="flex-align-center gap-2">
            <span style="font-size: 1.1rem;">⚡</span>
            <div>
              <span class="text-xs font-bold text-white">TRIGGER: Execute Single Test Case "TC-104"</span>
              <div class="text-xs text-cyan">Verify 3DS Payment Authorization Flow</div>
            </div>
          </div>
          <div class="flex-align-center gap-2">
            <span class="badge badge-accent font-mono" style="font-size: 0.65rem;">Scope: single_test</span>
            <span class="badge badge-subtle font-mono" style="font-size: 0.65rem;">Engine: Playwright v1.48</span>
            <span class="badge badge-success font-mono" style="font-size: 0.65rem;">1 Ephemeral Pod</span>
          </div>
        </div>

        <div class="decomp-flow-steps">
          <!-- Step 1: Upstream Traceability Resolution -->
          <div class="decomp-step-box">
            <div class="decomp-step-top">
              <div class="flex-align-center gap-2">
                <span class="step-circle" style="background: var(--accent-purple);">1</span>
                <span class="text-xs font-bold text-white">UPSTREAM TRACEABILITY RESOLUTION</span>
              </div>
              <span class="badge badge-subtle font-mono" style="font-size: 0.65rem;">Linked Hierarchy</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div style="background: var(--bg-card-muted); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 8px 12px;">
                <div class="text-xs text-muted">Upstream Requirement:</div>
                <div class="text-xs font-bold text-cyan font-mono mt-1">REQ-890: Checkout Voucher &amp; 3DS Gateway</div>
              </div>
              <div style="background: var(--bg-card-muted); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 8px 12px;">
                <div class="text-xs text-muted">Parent Business Epic:</div>
                <div class="text-xs font-bold text-white mt-1">KYX-EPIC-01: Checkout &amp; Payments</div>
              </div>
            </div>
          </div>

          <!-- Step 2: Deterministic Script Source in Git -->
          <div class="decomp-step-box">
            <div class="decomp-step-top">
              <div class="flex-align-center gap-2">
                <span class="step-circle" style="background: var(--primary);">2</span>
                <span class="text-xs font-bold text-white">DETERMINISTIC SCRIPT SOURCE IN GIT</span>
              </div>
              <span class="badge badge-success font-mono" style="font-size: 0.65rem;">Commit e8f4a12</span>
            </div>
            <div style="background: #080c14; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 8px 12px;">
              <div class="flex-align-center justify-between" style="font-size: 0.68rem; color: var(--text-muted); margin-bottom: 4px;">
                <span>📁 tests/e2e/checkout-promo.spec.ts:14</span>
                <span class="font-mono text-cyan">Branch: main</span>
              </div>
              <code class="font-mono" style="font-size: 0.74rem; color: #38bdf8;">test('Verify 3DS Payment Authorization Flow', async ({ page }) =&gt; { ... });</code>
            </div>
          </div>

          <!-- Step 3: Lightweight Isolated Sandbox Pod -->
          <div class="decomp-step-box">
            <div class="decomp-step-top">
              <div class="flex-align-center gap-2">
                <span class="step-circle" style="background: var(--accent-cyan);">3</span>
                <span class="text-xs font-bold text-white">LIGHTWEIGHT ISOLATED SANDBOX POD</span>
              </div>
              <span class="status-pill status-pass" style="font-size: 0.62rem;">1.2s Fast Feedback</span>
            </div>
            <div style="background: rgba(6, 182, 212, 0.05); border: 1px solid rgba(6, 182, 212, 0.25); border-radius: var(--radius-sm); padding: 8px 12px; display: flex; align-items: center; justify-content: space-between;">
              <div class="flex-align-center gap-2">
                <span>🛡️</span>
                <span class="text-xs text-white font-mono">Pod shard-1 (Headless Chromium, KeyVault Staging Secret Injected)</span>
              </div>
              <span class="text-xs text-cyan">Zero Disk Writes · RAM Evicted</span>
            </div>
          </div>
        </div>

        <!-- Result Strip -->
        <div class="decomp-result-strip">
          <div class="flex-align-center gap-2">
            <span style="font-size: 1.1rem; color: var(--success);">✓</span>
            <div>
              <span class="text-xs font-bold text-white">Rapid developer feedback delivered in 1.2 seconds!</span>
              <div class="text-xs text-secondary">Trace.zip and HAR network logs uploaded to Azure Blob Lake. Test marked Passed in Test Library.</div>
            </div>
          </div>
          <span class="badge badge-success font-mono">Passed (1.2s)</span>
        </div>
      </div>
    `;
  } else {
    // Whole Module / Epic (default)
    container.innerHTML = `
      <div class="decomp-visual-container">
        <!-- Trigger Strip -->
        <div class="decomp-header-strip">
          <div class="flex-align-center gap-2">
            <span style="font-size: 1.1rem;">🏛️</span>
            <div>
              <span class="text-xs font-bold text-white">TRIGGER: Execute Entire Business Module "Checkout &amp; Payments" (KYX-EPIC-01)</span>
              <div class="text-xs text-cyan">Decomposes module across child requirements and parallel sandboxes</div>
            </div>
          </div>
          <div class="flex-align-center gap-2">
            <span class="badge badge-accent font-mono" style="font-size: 0.65rem;">Scope: module</span>
            <span class="badge badge-subtle font-mono" style="font-size: 0.65rem;">Env: STAGING</span>
            <span class="badge badge-success font-mono" style="font-size: 0.65rem;">4 Parallel Kata Sandboxes</span>
          </div>
        </div>

        <div class="decomp-flow-steps">
          <!-- Step 1: Dynamic STLC Hierarchy Resolution -->
          <div class="decomp-step-box">
            <div class="decomp-step-top">
              <div class="flex-align-center gap-2">
                <span class="step-circle" style="background: var(--accent-purple);">1</span>
                <span class="text-xs font-bold text-white">DYNAMIC STLC HIERARCHY RESOLUTION (Zero Static Git Tags)</span>
              </div>
              <span class="badge badge-subtle font-mono" style="font-size: 0.65rem;">3 Child Requirements Resolved</span>
            </div>
            <p class="text-xs text-secondary" style="margin-bottom: 8px;">AutoQ queries Kyxo metadata store and dynamically resolves all 3 child requirements:</p>
            <div class="decomp-card-grid">
              <div class="decomp-card">
                <div class="flex-align-center justify-between">
                  <span class="font-mono text-xs font-bold text-cyan">REQ-890</span>
                  <span class="badge badge-danger" style="font-size: 0.6rem;">P0 Blocker</span>
                </div>
                <div class="text-xs text-white mt-1">Checkout Voucher Discount &amp; 3DS Gateway</div>
                <div class="text-xs text-muted mt-1">18 Linked Test Cases</div>
              </div>
              <div class="decomp-card" style="border-color: rgba(6, 182, 212, 0.4);">
                <div class="flex-align-center justify-between">
                  <span class="font-mono text-xs font-bold text-cyan">REQ-896</span>
                  <span class="badge badge-accent" style="font-size: 0.6rem;">New Feature · P0</span>
                </div>
                <div class="text-xs text-white mt-1">One-Click Apple Pay &amp; Biometric Checkout</div>
                <div class="text-xs text-muted mt-1">12 Linked Test Cases</div>
              </div>
              <div class="decomp-card">
                <div class="flex-align-center justify-between">
                  <span class="font-mono text-xs font-bold text-cyan">REQ-892</span>
                  <span class="badge badge-warning" style="font-size: 0.6rem;">P1 High</span>
                </div>
                <div class="text-xs text-white mt-1">Multi-Currency Dynamic Pricing Rules</div>
                <div class="text-xs text-muted mt-1">12 Linked Test Cases</div>
              </div>
            </div>
          </div>

          <!-- Step 2: Test Suite Aggregation -->
          <div class="decomp-step-box">
            <div class="decomp-step-top">
              <div class="flex-align-center gap-2">
                <span class="step-circle" style="background: var(--primary);">2</span>
                <span class="text-xs font-bold text-white">TEST SUITE AGGREGATION (42 Total Tests Discovered)</span>
              </div>
              <span class="badge badge-success font-mono" style="font-size: 0.65rem;">Zero Git Code Edits</span>
            </div>
            <p class="text-xs text-secondary" style="margin-bottom: 8px;">AutoQ automatically aggregates all tests linked to these 3 requirements without touching git code:</p>
            <div class="decomp-chips-wrap">
              <span class="code-pill"><strong class="text-cyan">REQ-890:</strong> TC-103 (@smoke), TC-104 (@regression), TC-105 (@e2e) + 15 tests</span>
              <span class="code-pill"><strong class="text-cyan">REQ-896:</strong> TC-301 (Happy Path), TC-302 (Fallback), TC-303 (Sheet Dismiss) + 9 tests</span>
              <span class="code-pill"><strong class="text-cyan">REQ-892:</strong> TC-201 (@regression), TC-202 (@pricing) + 10 tests</span>
            </div>
          </div>

          <!-- Step 3: Elastic Orchestration & Shard Allocation -->
          <div class="decomp-step-box">
            <div class="decomp-step-top">
              <div class="flex-align-center gap-2">
                <span class="step-circle" style="background: var(--accent-cyan);">3</span>
                <span class="text-xs font-bold text-white">ELASTIC ORCHESTRATION &amp; SHARD ALLOCATION (AKS Warm Pool)</span>
              </div>
              <span class="status-pill status-pass" style="font-size: 0.62rem;">4 MicroVM Shards</span>
            </div>
            <p class="text-xs text-secondary" style="margin-bottom: 8px;">Workload bin-packing divides 42 tests across 4 parallel Kata Sandboxes (lightweight microVMs):</p>
            <div class="decomp-shards-grid">
              <div class="decomp-shard-card">
                <div class="flex-align-center justify-between">
                  <span class="text-xs font-bold text-white">🛡️ Pod Shard-1</span>
                  <span class="badge badge-subtle font-mono" style="font-size: 0.6rem;">1m 32s</span>
                </div>
                <div class="text-xs text-cyan mt-1">11 tests (REQ-890)</div>
                <div class="text-xs text-muted font-mono mt-1" style="font-size: 0.62rem;">checkout-promo.spec.ts</div>
              </div>
              <div class="decomp-shard-card">
                <div class="flex-align-center justify-between">
                  <span class="text-xs font-bold text-white">🛡️ Pod Shard-2</span>
                  <span class="badge badge-subtle font-mono" style="font-size: 0.6rem;">1m 35s</span>
                </div>
                <div class="text-xs text-cyan mt-1">10 tests (REQ-896)</div>
                <div class="text-xs text-muted font-mono mt-1" style="font-size: 0.62rem;">apple-pay-checkout.spec.ts</div>
              </div>
              <div class="decomp-shard-card">
                <div class="flex-align-center justify-between">
                  <span class="text-xs font-bold text-white">🛡️ Pod Shard-3</span>
                  <span class="badge badge-subtle font-mono" style="font-size: 0.6rem;">1m 28s</span>
                </div>
                <div class="text-xs text-cyan mt-1">11 tests (REQ-892)</div>
                <div class="text-xs text-muted font-mono mt-1" style="font-size: 0.62rem;">currency-picker.spec.ts</div>
              </div>
              <div class="decomp-shard-card">
                <div class="flex-align-center justify-between">
                  <span class="text-xs font-bold text-white">🛡️ Pod Shard-4</span>
                  <span class="badge badge-subtle font-mono" style="font-size: 0.6rem;">1m 34s</span>
                </div>
                <div class="text-xs text-cyan mt-1">10 tests (Limits &amp; 3DS)</div>
                <div class="text-xs text-muted font-mono mt-1" style="font-size: 0.62rem;">checkout-limits.spec.ts</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Result Strip -->
        <div class="decomp-result-strip">
          <div class="flex-align-center gap-2">
            <span style="font-size: 1.1rem; color: var(--success);">✓</span>
            <div>
              <span class="text-xs font-bold text-white">Complete Business Module verified across all 3 requirements in 1m 38s wall clock!</span>
              <div class="text-xs text-secondary">Zero cross-tenant state pollution · $0 LLM token cost on regression · Unbroken STLC audit trail updated.</div>
            </div>
          </div>
          <span class="badge badge-success font-mono">Module Verified</span>
        </div>
      </div>
    `;
  }
}

// Switch between the 5 Architecture views
function switchArchTab(tabName) {
  state.activeArchTab = tabName;
  document.querySelectorAll('.arch-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.arch-view-section').forEach(sec => sec.classList.remove('active'));

  const activeBtn = document.getElementById(`tab-arch-${tabName}`);
  if (activeBtn) activeBtn.classList.add('active');

  const activeSec = document.getElementById(`view-arch-${tabName}`);
  if (activeSec) activeSec.classList.add('active');

  if (tabName === 'decisions') {
    renderArchitecturalDecisions(state.activeDecisionsCategory || 'all');
  }
}

// Select Real-World Execution Scenario (PR #408, DevTools Chat, Nightly Cron)
function setFlowExample(exampleId) {
  state.activeFlowExample = exampleId;
  const ex = flowScenarios[exampleId] || flowScenarios.pr;

  // Update scenario selector buttons
  document.querySelectorAll('.flow-example-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(`btn-flow-${exampleId}`);
  if (btn) btn.classList.add('active');

  // Update Scenario Banner
  const titleEl = document.getElementById('flow-scenario-title');
  const timeEl = document.getElementById('flow-scenario-time');
  const descEl = document.getElementById('flow-scenario-desc');
  const badgeEl = document.querySelector('#flow-scenario-banner .badge');

  if (titleEl) titleEl.textContent = ex.title;
  if (timeEl) timeEl.textContent = ex.duration;
  if (descEl) descEl.innerHTML = ex.desc;
  if (badgeEl) {
    badgeEl.textContent = ex.badge;
    badgeEl.className = `badge ${ex.badgeClass}`;
  }

  // Update node timings on the 7 stepper nodes
  for (let i = 1; i <= 7; i++) {
    const nodeEl = document.getElementById(`fnode-${i}`);
    if (nodeEl && ex.steps[i]) {
      const timingEl = nodeEl.querySelector('.flow-step-timing');
      if (timingEl) timingEl.textContent = ex.steps[i].nodeTiming;
      const subEl = nodeEl.querySelector('.flow-step-sub');
      if (subEl) subEl.textContent = ex.steps[i].sub;
    }
  }

  // Re-inspect current step with newly selected scenario data
  inspectFlowStep(state.flowCurrentStep || 1);
  showToast(`Switched Execution Scenario: ${ex.badge}`, 'info');
}

// Deep Inspect a Specific Step (1 through 7) in the Architecture Pipeline
function inspectFlowStep(stepNum) {
  state.flowCurrentStep = stepNum;
  const ex = flowScenarios[state.activeFlowExample] || flowScenarios.pr;
  const stepData = ex.steps[stepNum] || ex.steps[1];

  // Update active highlight on stepper nodes
  for (let i = 1; i <= 7; i++) {
    const nodeEl = document.getElementById(`fnode-${i}`);
    if (nodeEl) {
      nodeEl.classList.toggle('active', i === stepNum);
    }
  }

  // Update Inspector Card
  const stepNumEl = document.getElementById('inspector-step-num');
  const titleEl = document.getElementById('inspector-step-title');
  const latencyEl = document.getElementById('inspector-latency');
  const descEl = document.getElementById('inspector-desc');
  const compsEl = document.getElementById('inspector-components');
  const guaranteeEl = document.getElementById('inspector-guarantee');
  const codeTypeEl = document.getElementById('inspector-code-type');
  const codeEl = document.getElementById('inspector-code-snippet');

  if (stepNumEl) stepNumEl.textContent = stepData.num;
  if (titleEl) titleEl.textContent = stepData.title;
  if (latencyEl) latencyEl.textContent = stepData.latency;
  if (descEl) descEl.innerHTML = stepData.desc;
  if (guaranteeEl) guaranteeEl.innerHTML = stepData.guarantee;
  if (codeTypeEl) codeTypeEl.textContent = stepData.codeType;
  if (codeEl) codeEl.textContent = stepData.code;

  if (compsEl) {
    compsEl.innerHTML = stepData.components.map(c => `<span class="badge badge-subtle">${c}</span>`).join('');
  }
}

// Toggle Live Animated Sequence Simulation
function toggleFlowSimulation() {
  if (state.isFlowSimulating) {
    pauseFlowSimulation();
  } else {
    startFlowSimulation();
  }
}

// Start Live Flow Simulation
function startFlowSimulation() {
  if (state.isFlowSimulating) return;

  // If already at step 7, reset to 1
  if (state.flowCurrentStep >= 7) {
    resetFlowSimulation();
  }

  state.isFlowSimulating = true;
  const iconEl = document.getElementById('flow-sim-icon');
  const labelEl = document.getElementById('flow-sim-label');

  if (iconEl) iconEl.textContent = '⏸';
  if (labelEl) labelEl.textContent = 'Pause Simulation';

  // Navigate to Architecture screen & Flow tab if not currently there
  if (state.currentScreen !== 'architecture') {
    navigateToScreen('architecture');
  }
  switchArchTab('flow');

  advanceFlowSimulationStep();
  state.flowSimTimer = setInterval(() => {
    if (state.flowCurrentStep < 7) {
      state.flowCurrentStep++;
      advanceFlowSimulationStep();
    } else {
      finishFlowSimulation();
    }
  }, 1600);
}

// Advance to next simulation step with glow animations and status update
function advanceFlowSimulationStep() {
  const current = state.flowCurrentStep;
  const statusEl = document.getElementById('flow-sim-status-text');

  for (let i = 1; i <= 7; i++) {
    const nodeEl = document.getElementById(`fnode-${i}`);
    if (nodeEl) {
      nodeEl.classList.remove('simulating');
      if (i < current) {
        nodeEl.classList.add('completed');
      } else if (i === current) {
        nodeEl.classList.add('simulating');
        nodeEl.classList.remove('completed');
      } else {
        nodeEl.classList.remove('completed');
      }
    }
  }

  inspectFlowStep(current);

  const stepDescriptions = [
    'Ingress Trigger: Intercepting execution request and verifying HMAC auth...',
    'Scope Resolution: Resolving module & discovering linked Kyxo requirements...',
    'Elastic Sharding: Bin-packing workload across parallel sandbox slices...',
    'Kata Sandboxes: Booting ephemeral hardware-isolated microVM pods on AKS...',
    'Secrets Injection: Decoupled KeyVault credentials in-memory process load...',
    'Engine Execution: High-speed headless browser execution in sandbox...',
    'Artifact Lake & AI Triage: Uploading traces & triaging failures into Git PR...'
  ];

  if (statusEl) {
    statusEl.innerHTML = `Step [${current}/7]: <strong>${stepDescriptions[current - 1]}</strong>`;
  }
}

// Pause Live Flow Simulation
function pauseFlowSimulation() {
  state.isFlowSimulating = false;
  if (state.flowSimTimer) {
    clearInterval(state.flowSimTimer);
    state.flowSimTimer = null;
  }

  const iconEl = document.getElementById('flow-sim-icon');
  const labelEl = document.getElementById('flow-sim-label');
  const statusEl = document.getElementById('flow-sim-status-text');

  if (iconEl) iconEl.textContent = '▶';
  if (labelEl) labelEl.textContent = 'Resume Simulation';
  if (statusEl) {
    statusEl.textContent = `Simulation paused at Step ${state.flowCurrentStep} of 7. Click Resume or click any node.`;
  }

  for (let i = 1; i <= 7; i++) {
    const nodeEl = document.getElementById(`fnode-${i}`);
    if (nodeEl) nodeEl.classList.remove('simulating');
  }
}

// Finish Live Flow Simulation
function finishFlowSimulation() {
  pauseFlowSimulation();
  const iconEl = document.getElementById('flow-sim-icon');
  const labelEl = document.getElementById('flow-sim-label');
  const statusEl = document.getElementById('flow-sim-status-text');

  if (iconEl) iconEl.textContent = '↺';
  if (labelEl) labelEl.textContent = 'Replay Simulation';

  for (let i = 1; i <= 7; i++) {
    const nodeEl = document.getElementById(`fnode-${i}`);
    if (nodeEl) {
      nodeEl.classList.remove('simulating');
      nodeEl.classList.add('completed');
    }
  }

  if (statusEl) {
    statusEl.innerHTML = `✓ <strong>End-to-End Sequence Finished!</strong> All 7 stages executed cleanly in sandboxes. MicroVMs destroyed.`;
  }
  showToast('✓ End-to-End Pipeline simulation completed successfully!', 'success');
}

// Reset Flow Simulation to Step 1
function resetFlowSimulation() {
  pauseFlowSimulation();
  state.flowCurrentStep = 1;

  for (let i = 1; i <= 7; i++) {
    const nodeEl = document.getElementById(`fnode-${i}`);
    if (nodeEl) {
      nodeEl.classList.remove('simulating', 'completed', 'active');
      if (i === 1) nodeEl.classList.add('active');
    }
  }

  inspectFlowStep(1);

  const iconEl = document.getElementById('flow-sim-icon');
  const labelEl = document.getElementById('flow-sim-label');
  const statusEl = document.getElementById('flow-sim-status-text');

  if (iconEl) iconEl.textContent = '▶';
  if (labelEl) labelEl.textContent = 'Start Animated Simulation';
  if (statusEl) statusEl.textContent = 'Click any step above to inspect its architecture payload';
}

// Inspect Component Modal (Clicking any 4-Tier Blueprint Box)
function inspectCompModal(compKey) {
  const spec = componentSpecs[compKey];
  if (!spec) return;

  const modal = document.getElementById('component-detail-modal');
  if (!modal) return;

  const iconEl = document.getElementById('comp-modal-icon');
  const titleEl = document.getElementById('comp-modal-title');
  const tierEl = document.getElementById('comp-modal-tier');
  const descEl = document.getElementById('comp-modal-desc');
  const ingressEl = document.getElementById('comp-modal-ingress');
  const egressEl = document.getElementById('comp-modal-egress');
  const slaEl = document.getElementById('comp-modal-sla');
  const resEl = document.getElementById('comp-modal-resilience');
  const codeTypeEl = document.getElementById('comp-modal-code-type');
  const codeEl = document.getElementById('comp-modal-code');
  const respContainer = document.getElementById('comp-modal-responsibilities');

  if (iconEl) iconEl.textContent = spec.icon;
  if (titleEl) titleEl.textContent = spec.title;
  if (tierEl) tierEl.textContent = spec.tier;
  if (descEl) descEl.textContent = spec.desc;
  if (ingressEl) ingressEl.textContent = spec.ingress;
  if (egressEl) egressEl.textContent = spec.egress;
  if (slaEl) slaEl.textContent = spec.sla;
  if (resEl) resEl.textContent = spec.resilience;
  if (codeTypeEl) codeTypeEl.textContent = spec.codeType;
  if (codeEl) codeEl.textContent = spec.code;

  if (respContainer) {
    respContainer.innerHTML = spec.responsibilities.map(r => `
      <div class="sec-item">
        <span class="sec-item-icon">✓</span>
        <span>${r}</span>
      </div>
    `).join('');
  }

  modal.style.display = 'flex';
}

// Close Component Modal
function closeCompModal() {
  const modal = document.getElementById('component-detail-modal');
  if (modal) modal.style.display = 'none';
}

// Render Architectural Decisions (Filtered by Category)
function renderArchitecturalDecisions(category = 'all') {
  const container = document.getElementById('decisions-container');
  if (!container) return;

  const filtered = category === 'all'
    ? architecturalDecisions
    : architecturalDecisions.filter(d => d.category === category);

  container.innerHTML = filtered.map(d => `
    <div class="decision-card">
      <div class="decision-card-head">
        <span class="decision-num">Decision #${d.id}</span>
        <span class="decision-category-tag">${d.categoryLabel || d.category}</span>
      </div>
      <div class="decision-title mb-2">${d.title}</div>
      <div class="decision-body">${d.desc}</div>
    </div>
  `).join('');
}

// Filter Architectural Decisions Toolbar
function filterDecisions(category) {
  state.activeDecisionsCategory = category;
  document.querySelectorAll('.dec-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick').includes(`'${category}'`));
  });
  renderArchitecturalDecisions(category);
}

// Quick Run Modal
function openQuickRunModal() {
  const modal = document.getElementById('quick-run-modal');
  if (modal) modal.style.display = 'flex';

  const modalInput = document.getElementById('modal-shard-count');
  if (modalInput) modalInput.value = state.shardCount;

  const modalEnv = document.getElementById('modal-env-picker');
  if (modalEnv) modalEnv.value = state.targetEnv;
}

function closeQuickRunModal() {
  const modal = document.getElementById('quick-run-modal');
  if (modal) modal.style.display = 'none';
}

function confirmModalRun() {
  const scopeVal = document.getElementById('modal-suite-picker')?.value || 'module-payments';

  if (scopeVal.startsWith('module-')) {
    const modId = scopeVal.replace('module-', '');
    setRunScopeMode('module');
    selectRunModule(modId, false);
  } else if (scopeVal === 'smoke') {
    setRunScopeMode('tags');
    loadRunTemplate('smoke');
  } else {
    setRunScopeMode('tags');
    loadRunTemplate('full');
  }

  closeQuickRunModal();
  navigateToScreen('results');
  startSimulatedLiveRun();
}

function runSingleTestFromDetail() {
  navigateToScreen('results');
  startSimulatedLiveRun();
}

function runSingleTestFromRow(testId) {
  showToast(`Provisioning Azure sandbox for ${testId}...`, 'info');
  setTimeout(() => {
    navigateToScreen('results');
    startSimulatedLiveRun();
  }, 400);
}

function runSelectedTests() {
  const count = state.selectedTests.size;
  showToast(`Dispatching ${count} selected tests across ${state.shardCount} sandboxes...`, 'info');
  navigateToScreen('results');
  startSimulatedLiveRun();
}

// New Test Case Modal
function openNewTestCaseModal() {
  const modal = document.getElementById('new-testcase-modal');
  if (modal) {
    modal.style.display = 'flex';
    renderRequirementDropdowns();
  }
}

function closeNewTestCaseModal() {
  const modal = document.getElementById('new-testcase-modal');
  if (modal) modal.style.display = 'none';
}

function confirmCreateNewTestCase() {
  const name = document.getElementById('modal-new-test-name').value || 'New Custom Test';
  const req = document.getElementById('modal-new-req-select').value;
  const engine = document.getElementById('modal-new-engine-select').value;

  const tags = [];
  if (document.getElementById('modal-tag-smoke').checked) tags.push('@smoke');
  if (document.getElementById('modal-tag-regression').checked) tags.push('@regression');
  if (document.getElementById('modal-tag-e2e').checked) tags.push('@e2e');

  state.currentTestName = name;
  state.currentReq = req;
  const sel = document.getElementById('modal-new-req-select');
  state.currentReqTitle = sel.options[sel.selectedIndex].text.replace(/\[.*?\]\s*/, '');
  state.currentTags = tags;

  closeNewTestCaseModal();
  navigateToScreen('authoring');

  // Set global engine
  setGlobalEngine(engine.toLowerCase());

  // Sync Studio Ribbon
  const studioReq = document.getElementById('studio-req-selector');
  if (studioReq) studioReq.value = req;

  // Sync Tag Checkboxes
  const tSmoke = document.getElementById('tag-smoke');
  const tReg = document.getElementById('tag-regression');
  const tE2e = document.getElementById('tag-e2e');
  if (tSmoke) tSmoke.checked = tags.includes('@smoke');
  if (tReg) tReg.checked = tags.includes('@regression');
  if (tE2e) tE2e.checked = tags.includes('@e2e');

  renderStudioCodeTemplate();

  showToast(`Created Test linked to ${req} with tags [${tags.join(', ')}] using ${engine}!`, 'success');
}

// Global Search & Keyboard Shortcuts
function initSearchKeyboard() {
  const searchInput = document.getElementById('global-search-input');

  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    }
    if (e.key === 'Escape') {
      closeQuickRunModal();
      closeNewTestCaseModal();
      closeNewRequirementModal();
      closeCompModal();
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase().trim();
      if (val.length > 1) {
        if (state.currentScreen !== 'library') {
          navigateToScreen('library');
        }
        filterLibraryTable(val);
      }
    });
  }

  const libSearch = document.getElementById('library-search');
  if (libSearch) {
    libSearch.addEventListener('input', (e) => {
      filterLibraryTable(e.target.value.toLowerCase().trim());
    });
  }
}

function filterLibraryTable(query) {
  const rows = document.querySelectorAll('#library-table-body tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query) ? '' : 'none';
  });
}

// Toast System
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 200);
  }, 3400);
}

// Helpers
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function getCurrentTime() {
  const d = new Date();
  return d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(3, '0');
}
