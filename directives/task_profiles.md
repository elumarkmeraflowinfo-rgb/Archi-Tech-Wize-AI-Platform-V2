# Task Profiles Directive

Task Profiles mapping user intent to technical constraints. The Gateway uses these profiles to select the appropriate Provider Layer and minimum capabilities.

## The Profiles

### `REALTIME_CHAT`
- **Use Case**: General conversation, onboarding, quick questions.
- **Latency Target**: < 2.0s (Time to First Token).
- **Min Capability**: `text` (Medium reasoning).
- **Routing**: Layer 0 (Fast) -> Layer 1 (Edge) -> Layer 3 (Fast Provider).
- **Streaming**: PREFERRED.

### `DEEP_REASONING` / `SUPPORT`
- **Use Case**: Complex problem solving, debate, code analysis.
- **Latency Target**: < 10.0s.
- **Min Capability**: `reasoning` (High).
- **Routing**: Layer 3 (Strong Model) -> Layer 2 (Large Community Model) -> Layer 0.
- **Streaming**: REQUIRED (to prevent user abandonment).

### `CREATIVE_WRITING` (Batch-Like)
- **Use Case**: Blog posts, marketing copy, video scripts.
- **Latency Target**: < 30s.
- **Min Capability**: `text` (High creativity/context).
- **Routing**: Layer 3 -> Layer 4 (Batch).

### `IMAGE_GENERATION`
- **Use Case**: Thumbnails, assets, art.
- **Latency Target**: < 15s.
- **Min Capability**: `image`.
- **Routing**: Layer 4 (Queue) -> Layer 3 (Fast Gen).
- **Note**: Often requires specific model adapters (SDXL, Flux).

### `VIDEO_GENERATION`
- **Use Case**: Social clips, motion backgrounds.
- **Latency Target**: Minutes (Async).
- **Min Capability**: `video`.
- **Routing**: **STRICTLY Layer 4 (Queue)**.
- **UX**: User receives notification upon completion.

### `AUDIO_SPEECH`
- **Use Case**: TTS, Voice Cloning.
- **Latency Target**: < 1.0s (Realtime) or Batch.
- **Min Capability**: `audio`.
- **Routing**: Layer 1 (WebGPU TTS) -> Layer 3 (Fast API).

## Profile Configuration Schema
```typescript
interface TaskProfile {
    id: AiTaskType;
    maxLatencyMs: number;
    minQualityTier: 'low' | 'mid' | 'high';
    allowedLayers: number[]; // e.g., [0, 1, 3]
    fallbackOrder: 'speed' | 'quality' | 'cost';
}
```
