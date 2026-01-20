# Migration Directive: aiService to AiGateway

**Objective**: Transition from the monolithic `src/services/aiService.ts` to the modular `src/ai/gateway.ts` without disrupting existing functionality.

## The Strategy: "Strangler Fig" Pattern

We will not delete `aiService.ts` immediately. Instead, we will gut its internals and rewire them to call the Gateway. This preserves the API signature for the rest of the app (`App.tsx`, `MediaStudio.tsx`, etc.) while shifting the logic.

## Phase 1: The Gateway Standup (Current)
1. Build `src/ai/gateway.ts` (The Router).
2. Build `src/ai/providers/legacyHf.ts` (The Adapter for current logic).
3. Register Legacy Adapter as Layer 0.

## Phase 2: The Rewiring
Modify `src/services/aiService.ts`:

```typescript
// OLD
chat: async (prompt) => {
   // manual fetch to /api/ai-gateway
}

// NEW
import { gateway } from '../ai/gateway';
chat: async (prompt) => {
   return gateway.routeRequest({
       task: 'REALTIME_CHAT',
       prompt: prompt
   });
}
```

## Phase 3: The Deprecation
1. Audit all callsites of `aiService`.
2. Replace them one by one to use `gateway` directly.
3. Once `aiService` is empty, delete it.

## Rollback Plan
If Gateway fails:
1. Revert `aiService.ts` changes (git revert).
2. Gateway is designed to be "Fail-Safe", so try fixing the Provider Registry first before full rollback.
