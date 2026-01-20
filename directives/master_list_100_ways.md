# Master List: 100 Ways to Free Compute (Protocol)

**Mission**: Continuously discover, test, and integrate free/cheap compute sources.

## The Protocol
1. **Scout**: Find a potential source (HackerNews, Twitter, Reddit LocalLLaMA).
2. **Probe**: Test reliability (Uptime, Speed, Limits).
3. **Classify**: Assign to Layer (0-4).
4. **Integrate**: Build Adapter -> Add to Registry.

## The Master List (Living Document)

### Verified (Integrated/Ready)
- [x] **Hugging Face Inference (Free)**: Layer 0. (Text/Image). Reliable but rate-limited.
- [ ] **WebLLM (WebGPU)**: Layer 1. (Chat). Browser-based.
- [ ] **Petals**: Layer 2. (Llama-3-70B). P2P.
- [ ] **OpenRouter (Free Tier)**: Layer 3. Aggregator.

### Candidates (To Prospected)
1. **Groq**: Ultra-fast inference (Free beta?).
2. **Google Gemini Flash**: 1.5 Flash (Generous free tier).
3. **Cohere**: Trial keys.
4. **Cloudflare Workers AI**: Generous free tier for Llama.
5. **Github Models**: Marketplace playground (Rate limited).
6. **Kaggle Kernels**: T4 GPUs (Layer 4 Batch).
7. **Google Colab (Free)**: T4 GPUs (Layer 4 Batch).
8. **Lightning.ai Studios**: Free monthly credits.
9. **Together AI**: formatting..
10. **Replicate**: Trial credits.
... (Add new discoveries here)

## Integration Status
| Provider | Layer | Status | Adapter | Notes |
| :--- | :--- | :--- | :--- | :--- |
| HF Free | 0 | Live | `legacyHf.ts` | The bedrock. |
