# AI Provider Layers Strategy

This directive defines the specific hierarchy of AI compute layers for ArchiTech-Wize AI. The Gateway must respect this order to ensure reliance on free/cheap compute while maintaining a "Fail-Safe" user experience.

## The Layers

### Layer 0: Proven Working Models (Baseline Anchor)
- **Definition**: The specific set of providers/models that are KNOWN to be working right now.
- **Role**: The "Break Glass" fallback. If everything else fails, these MUST work.
- **Current Members**:
  - Legacy Hugging Face Inference (Free Tier) functioning models.
- **Constraint**: NEVER remove a Layer 0 provider without a verified, deployed replacement.
- **Allowed Context**: All (Browser & Server).

### Layer 1: Client-Side AI (Edge / WebGPU)
- **Definition**: Models running entirely on the user's device (Browser/Electron).
- **Role**: Zero-cost, high-privacy, offline-capable interactions.
- **Technologies**: WebLLM, MediaPipe, Transformers.js.
- **Constraints**:
  - Limited context window.
  - Dependent on user hardware "Jericho" tier (i5-7300U min).
  - Must fail gracefully if device is unsupported.

### Layer 2: Decentralized / Community
- **Definition**: P2P networks sharing compute.
- **Role**: Access to large models (70B+) without central cloud costs.
- **Technologies**: Petals, Hivemind.
- **Constraints**:
  - Variable latency.
  - Queue times may be unpredictable.

### Layer 3: Free Tiers & Aggregators
- **Definition**: External APIs offering generous free tiers or rotation.
- **Role**: Balanced speed/quality for general tasks.
- **Providers**: OpenRouter (free models), Groq (free beta), Gemini (free tier).
- **Constraints**:
  - Rate limits are tight.
  - Privacy guarantees vary.

### Layer 4: Batch Compute Bridges
- **Definition**: Bridges to non-realtime compute environments.
- **Role**: Heavy lifting for images, video training, and dataset analysis.
- **Sources**: Kaggle Notebooks, Colab, Lightning.ai.
- **Mechanism**: Job Queue -> Remote Worker execution.

### Layer 5: Paid Premium
- **Definition**: Guaranteed commercial SLAs.
- **Role**: Only for "Pro" users or when reliability is non-negotiable and cost is covered.
- **Providers**: OpenAI, Anthropic (Direct).
- **Constraint**: `allowPaidFallback` setting must be TRUE.

## Routing Principle
**"Best Quality within Lowest Layer"**
1. Check **Layer 1** (Is it capable? Is device strong enough?)
2. Check **Layer 2** (Is network healthy?)
3. Check **Layer 3** (Are we within rate limits?)
4. Fallback to **Layer 0** (Reliability anchor).
5. If Batch Task -> Send to **Layer 4** Queue.
