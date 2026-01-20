# Integration SOP: OpenRouter

**Layer**: 3 (Aggregator)
**Role**: Access to high-end models (Claude, GPT-4) and free rotation models.

## 1. Credentials
- Requires `OPENROUTER_API_KEY`.
- **Security Check**: MUST be proxied. `requiresServerProxy = true`.

## 2. Configuration
- **Base URL**: `https://openrouter.ai/api/v1`
- **Headers**:
  - `Authorization: Bearer $KEY`
  - `HTTP-Referer: $SITE_URL` (Required for rankings)
  - `X-Title: ArchiTech-Wize`

## 3. Models
- `google/gemini-2.0-flash-exp:free`
- `meta-llama/llama-3-8b-instruct:free`
- `mistralai/mistral-7b-instruct:free`

## 4. Adapter Logic (`src/ai/providers/openrouter.ts`)
- Map `AiRequest.capability` to model ID.
- Handle "402 Payment Required" -> Throw `ProviderQuotaError`.
- Handle "429 Rate Limit" -> Throw `ProviderRateLimitError`.
