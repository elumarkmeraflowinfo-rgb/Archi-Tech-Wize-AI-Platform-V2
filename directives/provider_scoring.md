# Provider Scoring Directive

The Gateway uses a weighted scoring formula to select the "Best Available" provider for a given task. This ensures we balance quality, speed, cost, and reliability.

## The Formula
`Score = (Capability * 0.4) + (Reliability * 0.3) + (Latency * 0.2) + (Cost * 0.1) + UserBoost`

### Components

#### 1. Capabilities Score (0-100)
- Does the model support the requested capability?
- **Logic**:
  - Exact Match (e.g., asked for 'image', has 'image'): 100
  - Partial Match (e.g., asked for 'reasoning', has 'text'): 50 (if fallback allowed)
  - No Match: 0 (Disqualified)

#### 2. Reliability Score (0-100)
- Based on `health.ts` metrics.
- **Logic**:
  - `ConsecutiveFailures == 0`: 100
  - `ConsecutiveFailures > 0`: `100 - (Failures * 20)`
  - ` CircuitBreakerOpen`: 0

#### 3. Latency Score (0-100)
- Based on `avgLatencyMs`.
- **Logic**:
  - `< 1000ms`: 100
  - `1000ms - 3000ms`: 80
  - `3000ms - 5000ms`: 50
  - `> 5000ms`: 20

#### 4. Cost/Preference Score (0-100)
- **Logic**:
  - Free Provider: 100
  - Paid Provider (User has subscription): 100
  - Paid Provider (No sub): 0 (Disqualified)

#### 5. User Boost (+- Bonus)
- **Logic**:
  - User selected "Preferred Provider": +500 (Force selection)
  - User minimized "Cloud usage": -50 to Cloud providers.

## Tie-Breaking
If scores are within 5% of each other, prefer:
1. **Layer 0** (Known stable)
2. **Layer 1** (Local/Cheapest)
3. **Random** (Load balancing)
