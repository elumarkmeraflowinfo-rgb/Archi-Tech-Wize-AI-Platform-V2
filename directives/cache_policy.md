# Cache Policy

**Constraint**: ArchiTech-Wize AI values privacy. Caching must be strictly controlled to prevent "Data Bleed" between users or sessions.

## 1. Allowed to Cache (Public)
- **Global Prompts**: "Explain how this tool works", "Welcome message".
- **Static Content**: Provider status, pricing info, available tools list.
- **Generic Generations**: Non-personalized, generic queries (e.g., "What is the capital of Kenya?").

## 2. FORBIDDEN to Cache (Private)
- **User Inputs**: Any prompt containing "I", "me", "my", or specific names/data.
- **Generated Personal Content**: Draft emails, business plans, private advice.
- **Auth Tokens**: NEVER cache or log API keys or session tokens.

## 3. Implementation
- **Key Generation**: Cache keys must include `userId` if the content is user-specific (which is mostly forbidden anyway).
- **TTL**:
  - Static: 24 hours.
  - Dynamic/Status: 1 minute.
- **Storage**:
  - Client-side: `sessionStorage` (Wiped on tab close).
  - Server-side: In-memory only (No persistent DB for caches unless encrypted).

## 4. The "No-Leak" Rule
If you are unsure if data is private, **DO NOT CACHE IT**.
Performance is secondary to Privacy.
