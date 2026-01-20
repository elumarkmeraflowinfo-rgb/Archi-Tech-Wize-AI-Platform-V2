# Security Directive: No Secret Leaks

**Severity:** CRITICAL
**Status:** ENFORCED

## The Core Rule
**"No Secret Tokens in the Browser."**

The ArchiTech-Wize AI platform runs on a hybrid architecture (Vite Client + Netlify Functions). It is mathematically impossible to secure a secret key sent from a client-side browser to a third-party API.

### 1. Classification of Secrets
- **Forbidden in Client**:
  - `OPENAI_API_KEY`
  - `HF_TOKEN` (Hugging Face Write/Inference)
  - `ANTHROPIC_API_KEY`
  - `REPLICATE_API_TOKEN`
  - Any private database admin key.
- **Allowed in Client**:
  - `VITE_FIREBASE_API_KEY` (Public by design)
  - `VITE_SUPABASE_ANON_KEY` (Public RLS managed)
  - Public-facing endpoint URLs.

### 2. Implementation Rules

#### A. The Gateway Check
The `AiGateway` MUST check context before initializing a provider.
```typescript
if (isBrowser() && provider.requiresServerProxy) {
    console.warn(`Security: Disabling ${provider.id} in browser mode.`);
    provider.enabled = false;
    provider.disabledReason = "SECRETS_PROTECTION";
}
```

#### B. Network Boundaries
- **Direct Calls**: ONLY allowed for providers with no auth or public-key auth (e.g., Layer 2 P2P, Layer 1 WebGPU).
- **Proxied Calls**: ALL paid/authed providers must go through:
  `Client -> Netlify Function (Gateway) -> Provider API`

#### C. Build-Time Audit
- The `execution/audit_env_exposure.js` script must run in CI/CD.
- It scans `src/**/*` for string literals matching key patterns (skipping configured exceptions).
- It verifies `vite.config.ts` does not define `define: { 'process.env': ... }` for secrets.

### 3. Immediate Remediation
If a key is committed or exposed:
1. Revoke the key immediately at the provider.
2. Rotate the key in Netlify Environment Variables.
3. Patch the code to use the server proxy.
