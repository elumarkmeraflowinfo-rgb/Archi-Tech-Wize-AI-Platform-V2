# Degraded Mode Policy

**Objective**: The user should NEVER see a raw "500 Error" or "Provider Unavailable" crash screen. The application must degrade gracefully.

## States of Operation

### 1. Unified Operation (Normal)
- All preferred layers are active.
- Latency is within targets.
- Features are 100% available.

### 2. Partial Degradation (Warning)
- **Trigger**: Primary provider failed, fell back to Layer 0 or slower alternative.
- **UX**:
  - Show small "⚠️ Using Backup Model" badge.
  - Continue operation.
  - Log warning to Telemetry.

### 3. Feature Lockout (Restricted)
- **Trigger**: No provider available for *specific* capability (e.g., Image Gen is down, but Text is working).
- **UX**:
  - Disable "Generate Image" button.
  - Tooltip: "Service temporarily unavailable due to high load."
  - Text chat remains functional.

### 4. Global Failsafe (Crisis)
- **Trigger**: ALL providers (Layer 0-5) are failing or unreachable (e.g., Offline).
- **UX**:
  - **Failsafe Response**: The Gateway returns a pre-canned "Failsafe Message" instead of throwing.
  - **Message**: "I'm having trouble connecting to my brain right now. I can still help you navigate the app, but I can't generate new thoughts yet."
  - **Action**: Queue retry in background.

## The Failsafe Contract
The `AiGateway` `routeRequest` method MUST be wrapped in a final `try/catch` that returns the Failsafe Response if all else fails. It MUST NOT throw to the UI.
