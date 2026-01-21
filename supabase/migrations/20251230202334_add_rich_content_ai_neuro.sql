/*
  # Add Rich Content - Artful Intelligence & Neuro

  AI systems for creative work and neurotechnology integrations.
*/

-- AI Overview
UPDATE codex_documents
SET content = '# Artful Intelligence Overview

AI-powered systems for creative enhancement, workflow automation, and artistic decision support.

## Vision

> "Use AI to amplify creativity, not replace it. Technology should enhance human artistic vision."

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ARTFUL INTELLIGENCE                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│   │   ANALYZE   │───►│   SUGGEST   │───►│   CREATE    │    │
│   │  (Vision)   │    │   (Coach)   │    │  (Generate) │    │
│   └─────────────┘    └─────────────┘    └─────────────┘    │
│                                                              │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│   │   CURATE    │───►│   PUBLISH   │───►│   MONETIZE  │    │
│   │ (Selection) │    │ (Platform)  │    │  (Business) │    │
│   └─────────────┘    └─────────────┘    └─────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Core Modules

### 1. Vision Analysis
- Image quality assessment
- Composition analysis
- Technical metadata extraction
- Style classification

### 2. Photo Coach
- Real-time feedback during editing
- Comparison to portfolio standards
- Improvement suggestions
- Learning path recommendations

### 3. Content Generation
- Caption writing assistance
- Blog post drafts
- Social media content
- Marketing copy

### 4. Curation Engine
- Portfolio selection assistance
- Series organization
- Collection building
- Archive management

### 5. Business Intelligence
- Pricing recommendations
- Market trend analysis
- Audience insights
- Revenue optimization

## Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Vision | GPT-4 Vision | Image analysis |
| Language | Claude 3 | Writing, reasoning |
| Embeddings | OpenAI | Similarity search |
| Vector DB | Pinecone | Fast retrieval |
| Workflow | n8n | Automation |
| Interface | React/Next.js | User interaction |

## Implementation Phases

### Phase 1: Foundation (Q1)
- [ ] Image ingestion pipeline
- [ ] Basic metadata extraction
- [ ] Simple quality scoring
- [ ] Portfolio database

### Phase 2: Intelligence (Q2)
- [ ] Photo coach MVP
- [ ] Style analysis
- [ ] Composition feedback
- [ ] Learning recommendations

### Phase 3: Automation (Q3)
- [ ] Auto-captioning
- [ ] Social scheduling
- [ ] Email newsletter generation
- [ ] Client communication

### Phase 4: Business (Q4)
- [ ] Pricing engine
- [ ] Edition management
- [ ] Sales analytics
- [ ] Market intelligence

## Ethical Guidelines

### Human-First Principles
1. AI assists decisions, human makes final call
2. No fully automated public output
3. Transparency about AI involvement
4. Artistic integrity preserved

### Usage Boundaries
| Allowed | Not Allowed |
|---------|-------------|
| Enhancement suggestions | Autonomous posting |
| Draft generation | Final content creation |
| Analysis and insights | Style replication |
| Workflow automation | Art generation |

## Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Time saved per image | 30% | - |
| Portfolio curation quality | +20% | - |
| Caption engagement | +15% | - |
| Revenue per hour | +25% | - |
',
updated_at = NOW()
WHERE path = '/codex/artistic_systems/artful_intelligence/ai_overview.md';

-- Photo Coach MVP
UPDATE codex_documents
SET content = '# Photo Coach MVP

An AI-powered coaching system that provides real-time feedback on photographs to accelerate skill development.

## Product Vision

```
PHOTOGRAPHER                    PHOTO COACH                    OUTPUT
     │                              │                            │
     │  Upload Image                │                            │
     │─────────────────────────────►│                            │
     │                              │ Analyze                    │
     │                              │ ● Composition              │
     │                              │ ● Technical quality        │
     │                              │ ● Style alignment          │
     │                              │ ● Portfolio fit            │
     │                              │                            │
     │         Feedback Report      │                            │
     │◄─────────────────────────────│                            │
     │                              │                            │
     │  Request Deep Dive           │                            │
     │─────────────────────────────►│                            │
     │                              │                            │
     │    Interactive Coaching      │                            │
     │◄─────────────────────────────│                            │
```

## Core Features

### 1. Instant Analysis
Upload any image and receive immediate feedback on:

| Category | Checks |
|----------|--------|
| Technical | Exposure, focus, noise, sharpness |
| Composition | Rule of thirds, balance, leading lines |
| Color | Harmony, contrast, white balance |
| Impact | Emotional response, storytelling |

### 2. Comparative Feedback
```
Your Image                vs.              Reference
┌─────────────────┐              ┌─────────────────┐
│                 │              │                 │
│   Your Shot     │              │  Similar work   │
│                 │              │  from portfolio │
│                 │              │                 │
└─────────────────┘              └─────────────────┘
        │                                │
        └──────────► Analysis ◄──────────┘
                         │
                         ▼
                   Suggestions
```

### 3. Learning Path
Based on analysis patterns, receive personalized learning recommendations:

```markdown
## Your Development Areas

### Priority 1: Composition
Your recent work shows strong technical execution but 
composition scores averaging 6.5/10. Recommended focus:

- [ ] Study leading lines in landscape work
- [ ] Practice frame-within-frame technique
- [ ] Review foreground interest strategies

### Priority 2: Color Grading
Consider developing a more consistent color signature.
Current work shows 4 different color profiles.
```

## Technical Architecture

### Analysis Pipeline
```
Image Upload
     │
     ▼
┌─────────────┐
│ Pre-process │ Resize, normalize, extract EXIF
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ GPT-4 Vision│ Visual analysis
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Style Match │ Compare to portfolio embeddings
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Report Gen  │ Generate coaching report
└──────┬──────┘
       │
       ▼
  Feedback UI
```

### Data Model
```sql
-- Core tables
photos (id, user_id, url, metadata, created_at)
analyses (id, photo_id, scores, feedback, model_version)
learning_paths (id, user_id, focus_areas, progress)
```

## MVP Scope

### In Scope (v1.0)
- [x] Single image upload
- [x] Basic analysis (tech, composition, color)
- [x] Score breakdown
- [x] 3 actionable suggestions
- [x] Historical tracking

### Out of Scope (Future)
- Batch upload
- Real-time editing feedback
- Video analysis
- Social features
- Mobile app

## Prompting Strategy

### Analysis Prompt Structure
```
You are an expert photography coach analyzing an image.

Context:
- Photographer skill level: {intermediate}
- Primary genre: {landscape}
- Learning goals: {composition improvement}

Analyze the attached image and provide:

1. TECHNICAL SCORE (1-10)
   - Exposure assessment
   - Focus/sharpness evaluation
   - Noise analysis

2. COMPOSITION SCORE (1-10)
   - Balance analysis
   - Use of space
   - Visual flow

3. TOP 3 IMPROVEMENTS
   - Specific, actionable
   - Reference techniques by name
   - Include "why" for each

4. STRENGTHS TO BUILD ON
   - What works well
   - How to leverage further

Format as structured JSON.
```

## Success Metrics

| Metric | MVP Target |
|--------|------------|
| Analysis latency | <10 seconds |
| User satisfaction | >4/5 stars |
| Return usage (7-day) | >40% |
| Skill improvement | Measurable after 10 images |
',
updated_at = NOW()
WHERE path = '/codex/artistic_systems/artful_intelligence/photo_coach_mvp.md';

-- Edition Manager
UPDATE codex_documents
SET content = '# Edition Manager

System for managing limited edition prints, tracking inventory, and automating the edition lifecycle.

## Edition Types

| Type | Quantity | Pricing | Certificate |
|------|----------|---------|-------------|
| Open | Unlimited | $$ | Digital |
| Limited | 10-100 | $$$ | Physical |
| Artist Proof | 3-10 | $$$$ | Physical + signed |
| Collector | 1-5 | $$$$$ | Physical + extras |

## Edition Lifecycle

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│  CREATE    │────►│  RELEASE   │────►│   SELL     │
│ - Quantity │     │ - Announce │     │ - Track    │
│ - Pricing  │     │ - Open     │     │ - Invoice  │
│ - Assets   │     │ - Display  │     │ - Ship     │
└────────────┘     └────────────┘     └────────────┘
                                            │
┌────────────┐     ┌────────────┐           │
│  ARCHIVE   │◄────│  CLOSE     │◄──────────┘
│ - Records  │     │ - Sold out │
│ - Certs    │     │ - Timeline │
└────────────┘     └────────────┘
```

## Data Model

### Edition Record
```typescript
interface Edition {
  id: string;
  title: string;
  imageUrl: string;
  type: ''open'' | ''limited'' | ''ap'' | ''collector'';
  totalQuantity: number;
  availableQuantity: number;
  price: {
    base: number;
    currency: string;
    tiers?: PriceTier[];
  };
  sizes: PrintSize[];
  releaseDate: Date;
  closeDate?: Date;
  status: ''draft'' | ''active'' | ''soldout'' | ''archived'';
}

interface PriceTier {
  fromNumber: number;
  toNumber: number;
  price: number;
}

interface PrintSize {
  name: string;
  dimensions: string;
  price: number;
  available: boolean;
}
```

### Sale Record
```typescript
interface Sale {
  id: string;
  editionId: string;
  editionNumber: number;
  buyer: {
    name: string;
    email: string;
    address: Address;
  };
  size: string;
  price: number;
  purchaseDate: Date;
  certificateId: string;
  shippingStatus: ''pending'' | ''shipped'' | ''delivered'';
}
```

## Certificate Generation

### Certificate Data
```
┌─────────────────────────────────────────────────────┐
│                                                      │
│           CERTIFICATE OF AUTHENTICITY                │
│                                                      │
│  Title: "Mountain Dawn"                             │
│  Edition: 15 of 50                                  │
│  Size: 24" x 36"                                    │
│                                                      │
│  This certifies that this is an original            │
│  limited edition print by [Artist Name].            │
│                                                      │
│  Date of Issue: January 15, 2024                    │
│  Certificate ID: CERT-2024-001-015                  │
│                                                      │
│  [Signature]                    [QR Code]           │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Verification System
- QR code links to verification page
- Blockchain record (optional)
- Database verification endpoint

## Pricing Strategy

### Dynamic Pricing Model
```
Edition 1-10:   Base Price × 1.0
Edition 11-25:  Base Price × 1.2
Edition 26-40:  Base Price × 1.5
Edition 41-50:  Base Price × 2.0
```

### Size Multipliers
| Size | Multiplier |
|------|------------|
| Small (12"×18") | 1.0x |
| Medium (24"×36") | 2.5x |
| Large (40"×60") | 5.0x |
| Massive (60"×90") | 10.0x |

## Inventory Dashboard

```
┌─────────────────────────────────────────────────────┐
│  EDITION INVENTORY                     [+ New]      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Mountain Dawn          ████████░░ 40/50  $2,400    │
│  Ocean Sunset           ██████████ SOLD    $1,800   │
│  Desert Stars           ██░░░░░░░░ 8/50   $3,200    │
│  Forest Mist            ░░░░░░░░░░ Draft  $2,000    │
│                                                      │
│  Revenue This Month: $12,400                        │
│  Pending Shipments: 3                               │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Automation Workflows

### On Sale
1. Decrement available quantity
2. Generate certificate
3. Send confirmation email
4. Create shipping label
5. Update inventory display
6. Trigger social announcement (if milestone)

### On Sellout
1. Mark edition as sold out
2. Send announcement to waitlist
3. Archive edition
4. Generate sales report
5. Update portfolio
',
updated_at = NOW()
WHERE path = '/codex/artistic_systems/artful_intelligence/edition_manager.md';

-- Muse2 EEG Pipeline
UPDATE codex_documents
SET content = '# Muse 2 EEG Pipeline

Real-time brainwave data collection, processing, and visualization using the Muse 2 headband.

## System Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   MUSE 2    │────►│  BLUETOOTH  │────►│   MOBILE    │
│  (Headband) │     │  (BLE 4.0)  │     │    APP      │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               │ WebSocket
                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  DASHBOARD  │◄────│  PROCESSOR  │◄────│   SERVER    │
│    (UI)     │     │   (Python)  │     │  (Node.js)  │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                          ▼
                    ┌─────────────┐
                    │  DATABASE   │
                    │ (TimescaleDB)│
                    └─────────────┘
```

## Data Channels

### EEG Bands
| Band | Frequency | Associated State |
|------|-----------|------------------|
| Delta | 1-4 Hz | Deep sleep |
| Theta | 4-8 Hz | Drowsy, meditation |
| Alpha | 8-12 Hz | Relaxed, calm |
| Beta | 12-30 Hz | Active thinking |
| Gamma | 30-100 Hz | Peak concentration |

### Sensor Locations
```
        ┌───────────────────┐
        │        Fp1        │
        │    ╱         ╲    │
       TP9              TP10
        │    ╲         ╱    │
        │        Fp2        │
        └───────────────────┘

Fp1, Fp2 = Forehead
TP9, TP10 = Behind ears
```

## Data Schema

### Raw Sample
```typescript
interface MuseSample {
  timestamp: number;      // Unix ms
  tp9: number;           // Microvolt
  fp1: number;
  fp2: number;
  tp10: number;
  accelerometer: {
    x: number;
    y: number;
    z: number;
  };
  gyroscope: {
    x: number;
    y: number;
    z: number;
  };
}
```

### Processed Metrics
```typescript
interface BrainMetrics {
  timestamp: number;
  bands: {
    delta: number;    // 0-1 normalized
    theta: number;
    alpha: number;
    beta: number;
    gamma: number;
  };
  ratios: {
    focus: number;    // beta/alpha
    calm: number;     // alpha/beta
    meditation: number; // theta/alpha
  };
  quality: number;    // Signal quality 0-1
}
```

## Processing Pipeline

### Step 1: Signal Acquisition
```python
# BlueMuse or Muse Direct connection
from muselsl import stream, list_muses

muses = list_muses()
stream(muses[0][''address''])
```

### Step 2: Preprocessing
```python
# Filter and clean signal
from scipy import signal

# Bandpass filter (1-50 Hz)
b, a = signal.butter(4, [1, 50], btype=''band'', fs=256)
filtered = signal.filtfilt(b, a, raw_data)

# Artifact removal
cleaned = remove_blinks(filtered)
```

### Step 3: Feature Extraction
```python
# FFT for band powers
from scipy.fft import fft

def get_band_powers(data, fs=256):
    freqs = np.fft.fftfreq(len(data), 1/fs)
    fft_vals = np.abs(fft(data))
    
    bands = {
        ''delta'': (1, 4),
        ''theta'': (4, 8),
        ''alpha'': (8, 12),
        ''beta'': (12, 30),
        ''gamma'': (30, 50)
    }
    
    powers = {}
    for band, (low, high) in bands.items():
        idx = (freqs >= low) & (freqs <= high)
        powers[band] = np.mean(fft_vals[idx])
    
    return powers
```

## Real-time Dashboard

### Visualization Components
```
┌─────────────────────────────────────────────────────┐
│  BRAIN STATE MONITOR                    [Recording] │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Signal Quality: ████████░░ 82%                     │
│                                                      │
│  ┌─────────────────────────────────────┐            │
│  │ Alpha ████████████░░░░░░░░ 65%     │            │
│  │ Beta  █████░░░░░░░░░░░░░░░ 25%     │            │
│  │ Theta ███░░░░░░░░░░░░░░░░░ 15%     │            │
│  └─────────────────────────────────────┘            │
│                                                      │
│  Focus Score: 7.2 / 10                              │
│  Calm Score: 8.5 / 10                               │
│                                                      │
│  [Raw EEG Waveform Graph]                           │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Use Cases

### Meditation Tracking
Monitor depth and consistency of meditation practice.

### Focus Sessions
Track concentration levels during deep work.

### Sleep Quality
Analyze pre-sleep brain state.

### Creative State Detection
Identify optimal conditions for creative work.

## Data Storage

### Session Record
```sql
CREATE TABLE eeg_sessions (
  id UUID PRIMARY KEY,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  activity_type VARCHAR(50),
  avg_focus FLOAT,
  avg_calm FLOAT,
  notes TEXT
);

CREATE TABLE eeg_samples (
  time TIMESTAMPTZ NOT NULL,
  session_id UUID REFERENCES eeg_sessions(id),
  channel VARCHAR(10),
  value FLOAT,
  PRIMARY KEY (time, session_id, channel)
);
```
',
updated_at = NOW()
WHERE path = '/codex/neuro/muse2_eeg_pipeline.md';

-- WebSocket Servers
UPDATE codex_documents
SET content = '# WebSocket Servers

Real-time communication infrastructure for streaming biometric data, notifications, and live updates.

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    WEBSOCKET HUB                          │
├──────────────────────────────────────────────────────────┤
│                                                           │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐             │
│   │ SENSORS │    │ CLIENTS │    │ WORKERS │             │
│   │ ────►   │    │ ◄────►  │    │ ◄────   │             │
│   └────┬────┘    └────┬────┘    └────┬────┘             │
│        │              │              │                   │
│        └──────────────┼──────────────┘                   │
│                       │                                  │
│              ┌────────▼────────┐                        │
│              │   MESSAGE BUS   │                        │
│              │    (Redis)      │                        │
│              └────────┬────────┘                        │
│                       │                                  │
│        ┌──────────────┼──────────────┐                  │
│        │              │              │                   │
│   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐             │
│   │  EEG    │   │  WHOOP  │   │ ALERTS  │             │
│   │ Channel │   │ Channel │   │ Channel │             │
│   └─────────┘   └─────────┘   └─────────┘             │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

## Server Implementation

### Core Server (Node.js)
```typescript
import { WebSocketServer, WebSocket } from ''ws'';
import { createClient } from ''redis'';

const wss = new WebSocketServer({ port: 8080 });
const redis = createClient();

// Channel subscriptions
const channels = new Map<string, Set<WebSocket>>();

wss.on(''connection'', (ws) => {
  ws.on(''message'', async (data) => {
    const msg = JSON.parse(data.toString());
    
    switch (msg.type) {
      case ''subscribe'':
        subscribeToChannel(ws, msg.channel);
        break;
      case ''publish'':
        await publishToChannel(msg.channel, msg.data);
        break;
      case ''unsubscribe'':
        unsubscribeFromChannel(ws, msg.channel);
        break;
    }
  });
  
  ws.on(''close'', () => {
    // Cleanup subscriptions
    channels.forEach((subs, channel) => {
      subs.delete(ws);
    });
  });
});
```

### Message Protocol
```typescript
// Client → Server
interface ClientMessage {
  type: ''subscribe'' | ''publish'' | ''unsubscribe'' | ''ping'';
  channel?: string;
  data?: unknown;
  id?: string;  // For request tracking
}

// Server → Client
interface ServerMessage {
  type: ''message'' | ''subscribed'' | ''error'' | ''pong'';
  channel?: string;
  data?: unknown;
  id?: string;
  timestamp: number;
}
```

## Channels

### EEG Channel
```typescript
// Real-time brain data
{
  channel: ''eeg'',
  data: {
    timestamp: 1704067200000,
    bands: {
      alpha: 0.65,
      beta: 0.25,
      theta: 0.15,
      delta: 0.10,
      gamma: 0.08
    },
    quality: 0.92
  }
}
```

### Biometrics Channel
```typescript
// Health metrics
{
  channel: ''biometrics'',
  data: {
    source: ''whoop'',
    heartRate: 72,
    hrv: 45,
    strain: 8.5,
    recovery: 78,
    timestamp: 1704067200000
  }
}
```

### Alerts Channel
```typescript
// System notifications
{
  channel: ''alerts'',
  data: {
    level: ''warning'',
    title: ''High Stress Detected'',
    message: ''HRV below threshold for 30 minutes'',
    action: ''Consider taking a break'',
    timestamp: 1704067200000
  }
}
```

## Client Connection

### Browser Client
```typescript
class WSClient {
  private ws: WebSocket;
  private handlers = new Map<string, Function[]>();
  
  connect(url: string) {
    this.ws = new WebSocket(url);
    
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const handlers = this.handlers.get(msg.channel) || [];
      handlers.forEach(h => h(msg.data));
    };
  }
  
  subscribe(channel: string, handler: Function) {
    this.ws.send(JSON.stringify({ 
      type: ''subscribe'', 
      channel 
    }));
    
    const handlers = this.handlers.get(channel) || [];
    handlers.push(handler);
    this.handlers.set(channel, handlers);
  }
}
```

## Scaling

### Horizontal Scaling with Redis
```
Client ──► WS Server 1 ──┐
                         │
Client ──► WS Server 2 ──┼──► Redis Pub/Sub
                         │
Client ──► WS Server 3 ──┘
```

### Health Monitoring
| Metric | Threshold | Alert |
|--------|-----------|-------|
| Connections | >5000 | Scale up |
| Message latency | >100ms | Investigate |
| Error rate | >1% | Critical |
| Memory usage | >80% | Scale up |

## Security

### Authentication
```typescript
wss.on(''connection'', (ws, req) => {
  const token = req.headers[''authorization''];
  
  if (!validateToken(token)) {
    ws.close(4001, ''Unauthorized'');
    return;
  }
  
  // Continue with authenticated connection
});
```

### Rate Limiting
- Max 100 messages/second per client
- Max 10 subscriptions per client
- Reconnection backoff required
',
updated_at = NOW()
WHERE path = '/codex/neuro/websocket_servers.md';

-- Adaptive ML Models
UPDATE codex_documents
SET content = '# Adaptive ML Models

Machine learning models that learn from personal data to provide personalized insights and predictions.

## Model Categories

### 1. State Detection
Predict current cognitive/physical state from biometric signals.

### 2. Pattern Recognition
Identify recurring patterns in behavior and performance.

### 3. Recommendation Engine
Suggest optimal timing and conditions for activities.

### 4. Anomaly Detection
Flag unusual patterns that may indicate issues.

## Model Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 ADAPTIVE ML PIPELINE                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐             │
│  │  DATA   │───►│ FEATURE │───►│  MODEL  │             │
│  │ INGEST  │    │ENGINEER │    │ TRAINING│             │
│  └─────────┘    └─────────┘    └─────────┘             │
│                                      │                  │
│                                      ▼                  │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐            │
│  │ ACTION  │◄───│INFERENCE│◄───│  MODEL  │            │
│  │         │    │         │    │ SERVING │            │
│  └─────────┘    └─────────┘    └─────────┘            │
│                                      │                  │
│                                      ▼                  │
│                              ┌─────────────┐           │
│                              │  FEEDBACK   │           │
│                              │    LOOP     │           │
│                              └─────────────┘           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Focus Prediction Model

### Features
```python
features = {
    # Time features
    ''hour_of_day'': int,        # 0-23
    ''day_of_week'': int,        # 0-6
    ''minutes_since_wake'': int,
    
    # Biometric features
    ''hrv_current'': float,
    ''hrv_baseline_diff'': float,
    ''sleep_score'': float,
    ''recovery_score'': float,
    
    # Context features
    ''caffeine_mg'': float,
    ''last_meal_hours'': float,
    ''exercise_today'': bool,
    
    # Historical
    ''focus_7day_avg'': float,
    ''productive_hours_yesterday'': float
}
```

### Model Definition
```python
import tensorflow as tf

model = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation=''relu'', input_shape=(15,)),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(32, activation=''relu''),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(16, activation=''relu''),
    tf.keras.layers.Dense(1, activation=''sigmoid'')  # Focus score 0-1
])

model.compile(
    optimizer=''adam'',
    loss=''binary_crossentropy'',
    metrics=[''accuracy'']
)
```

### Training Loop
```python
def continuous_learning(model, new_data, feedback):
    # Only retrain with verified feedback
    if feedback.confidence > 0.8:
        X_new = extract_features(new_data)
        y_new = feedback.actual_focus_score
        
        # Fine-tune with low learning rate
        model.fit(
            X_new, y_new,
            epochs=5,
            learning_rate=0.0001,
            validation_split=0.2
        )
```

## Energy Prediction Model

### Output
```typescript
interface EnergyPrediction {
  currentLevel: number;      // 0-100
  predictedPeak: {
    time: Date;
    level: number;
  };
  predictedLow: {
    time: Date;
    level: number;
  };
  recommendations: string[];
}
```

### Usage
```typescript
const prediction = await energyModel.predict({
  currentTime: new Date(),
  sleepData: lastNightSleep,
  activityData: todayActivity,
  nutritionData: todayMeals
});

// Output
{
  currentLevel: 72,
  predictedPeak: {
    time: "10:30 AM",
    level: 85
  },
  predictedLow: {
    time: "3:00 PM",
    level: 45
  },
  recommendations: [
    "Schedule deep work before 11 AM",
    "Consider light activity at 3 PM",
    "Avoid caffeine after 2 PM"
  ]
}
```

## Model Performance

### Metrics Tracked
| Model | Accuracy | Precision | Recall | F1 |
|-------|----------|-----------|--------|-----|
| Focus | 84% | 0.82 | 0.86 | 0.84 |
| Energy | 79% | 0.77 | 0.81 | 0.79 |
| Sleep | 88% | 0.90 | 0.86 | 0.88 |

### Drift Detection
```python
def check_model_drift(predictions, actuals, threshold=0.1):
    recent_accuracy = calculate_accuracy(
        predictions[-100:], 
        actuals[-100:]
    )
    
    if recent_accuracy < baseline_accuracy - threshold:
        trigger_retraining()
        alert_model_drift()
```

## Privacy Considerations

- All models run locally when possible
- Personal data never leaves device for training
- Federated learning for aggregate insights
- Full data export and deletion capability
',
updated_at = NOW()
WHERE path = '/codex/neuro/adaptive_ml_models.md';

-- Whoop Integration
UPDATE codex_documents
SET content = '# Whoop Integration

Integration with Whoop fitness tracker for recovery, strain, and sleep optimization.

## Data Available

### Recovery Metrics
| Metric | Range | Description |
|--------|-------|-------------|
| Recovery Score | 0-100% | Daily readiness |
| HRV | ms | Heart rate variability |
| RHR | bpm | Resting heart rate |
| Respiratory Rate | br/min | Breathing rate |
| SpO2 | % | Blood oxygen |
| Skin Temp | °C | Skin temperature |

### Strain Metrics
| Metric | Range | Description |
|--------|-------|-------------|
| Strain Score | 0-21 | Cardiovascular load |
| Calories | kcal | Energy expenditure |
| Activity Duration | minutes | Active time |
| Avg HR | bpm | Average heart rate |
| Max HR | bpm | Peak heart rate |

### Sleep Metrics
| Metric | Description |
|--------|-------------|
| Sleep Performance | % of sleep need met |
| Time in Bed | Total time |
| Sleep Duration | Actual sleep |
| Sleep Efficiency | Sleep/time in bed |
| Disturbances | Wake events |
| Sleep Stages | REM, Deep, Light |

## API Integration

### Authentication
```typescript
const whoop = new WhoopClient({
  clientId: process.env.WHOOP_CLIENT_ID,
  clientSecret: process.env.WHOOP_CLIENT_SECRET,
  redirectUri: ''https://app/callback''
});

// OAuth flow
const authUrl = whoop.getAuthorizationUrl();
const tokens = await whoop.exchangeCode(code);
```

### Data Fetching
```typescript
// Get recovery data
const recovery = await whoop.getRecovery({
  start: ''2024-01-01'',
  end: ''2024-01-31''
});

// Get sleep data
const sleep = await whoop.getSleep({
  start: ''2024-01-01'',
  end: ''2024-01-31''
});

// Get strain data
const strain = await whoop.getStrain({
  start: ''2024-01-01'',
  end: ''2024-01-31''
});
```

## Data Schema

### Daily Summary
```typescript
interface DailySummary {
  date: string;
  recovery: {
    score: number;
    hrv: number;
    rhr: number;
    sleepPerformance: number;
  };
  strain: {
    score: number;
    calories: number;
    activities: Activity[];
  };
  sleep: {
    duration: number;
    efficiency: number;
    stages: SleepStages;
  };
}
```

## Dashboard Integration

```
┌─────────────────────────────────────────────────────┐
│  WHOOP DAILY SUMMARY               January 15, 2024 │
├─────────────────────────────────────────────────────┤
│                                                      │
│  RECOVERY                                           │
│  ████████████████░░░░ 78%  "Ready to perform"      │
│  HRV: 45ms  RHR: 52bpm  Sleep: 92%                 │
│                                                      │
│  STRAIN                                             │
│  ████████░░░░░░░░░░░░ 8.2   Light day              │
│  Calories: 2,100  Activities: 1                     │
│                                                      │
│  SLEEP                                              │
│  ┌────────────────────────────────┐                │
│  │ ██ REM: 1h 45m (22%)          │                │
│  │ ████ Deep: 2h 10m (27%)       │                │
│  │ ██████ Light: 4h 05m (51%)    │                │
│  └────────────────────────────────┘                │
│  Total: 8h 00m  Efficiency: 94%                    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Automation Rules

### Recovery-Based Scheduling
```typescript
const rules = {
  recovery: {
    high: {    // >75%
      allowDeepWork: 6,      // hours
      allowExercise: ''high'',
      alertThreshold: null
    },
    medium: {  // 50-75%
      allowDeepWork: 4,
      allowExercise: ''moderate'',
      alertThreshold: 16      // strain alert
    },
    low: {     // <50%
      allowDeepWork: 2,
      allowExercise: ''light'',
      alertThreshold: 10
    }
  }
};
```

### Alert System
```typescript
// Morning brief
if (recovery.score < 50) {
  notify({
    title: ''Low Recovery Day'',
    body: `Recovery at ${recovery.score}%. Consider lighter schedule.`,
    actions: [''View suggestions'', ''Dismiss'']
  });
}

// Strain warning
if (strain.score > rules.recovery[level].alertThreshold) {
  notify({
    title: ''Strain Alert'',
    body: ''Approaching strain limit for recovery level.'',
    priority: ''high''
  });
}
```

## Historical Analysis

### Trends Query
```sql
SELECT 
  date_trunc(''week'', date) as week,
  AVG(recovery_score) as avg_recovery,
  AVG(strain_score) as avg_strain,
  AVG(sleep_performance) as avg_sleep
FROM whoop_daily
WHERE date >= NOW() - INTERVAL ''12 weeks''
GROUP BY week
ORDER BY week;
```
',
updated_at = NOW()
WHERE path = '/codex/neuro/whoop_integration.md';

-- Bio Geometry Engine
UPDATE codex_documents
SET content = '# Bio Geometry Engine

Spatial analysis of biometric data to understand how physical environment affects cognitive and physical performance.

## Concept

The Bio Geometry Engine correlates biometric data with location and environmental factors to identify optimal conditions for different activities.

## Data Layers

```
┌─────────────────────────────────────────────────────────┐
│                    BIO GEOMETRY                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Layer 1: LOCATION                                      │
│  ────────────────────────────────────────               │
│  GPS coordinates, indoor/outdoor, room type             │
│                                                          │
│  Layer 2: ENVIRONMENT                                   │
│  ────────────────────────────────────────               │
│  Temperature, humidity, light, noise, air quality       │
│                                                          │
│  Layer 3: BIOMETRICS                                    │
│  ────────────────────────────────────────               │
│  Heart rate, HRV, EEG, movement, posture               │
│                                                          │
│  Layer 4: PERFORMANCE                                   │
│  ────────────────────────────────────────               │
│  Focus score, output quality, subjective rating        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Data Model

### Location Record
```typescript
interface LocationData {
  timestamp: Date;
  coordinates: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  type: ''home'' | ''office'' | ''cafe'' | ''outdoors'' | ''travel'';
  room?: ''desk'' | ''couch'' | ''bedroom'' | ''kitchen'';
  environment: {
    temperature: number;
    humidity: number;
    lightLevel: number;
    noiseLevel: number;
    co2?: number;
  };
}
```

### Correlated Session
```typescript
interface BioGeoSession {
  id: string;
  startTime: Date;
  endTime: Date;
  location: LocationData;
  activity: string;
  biometrics: {
    avgHeartRate: number;
    avgHRV: number;
    focusScore: number;
  };
  output: {
    quality: number;     // 1-10
    quantity: number;    // Units of work
    subjective: number;  // Self-rating
  };
}
```

## Analysis Queries

### Best Focus Locations
```sql
SELECT 
  location_type,
  room,
  AVG(focus_score) as avg_focus,
  AVG(output_quality) as avg_quality,
  COUNT(*) as sessions
FROM bio_geo_sessions
WHERE activity = ''deep_work''
GROUP BY location_type, room
HAVING COUNT(*) > 5
ORDER BY avg_focus DESC;
```

### Environmental Sweet Spots
```sql
SELECT 
  FLOOR(temperature / 2) * 2 as temp_bucket,
  FLOOR(humidity / 10) * 10 as humidity_bucket,
  AVG(focus_score) as avg_focus
FROM bio_geo_sessions
GROUP BY temp_bucket, humidity_bucket
HAVING COUNT(*) > 10
ORDER BY avg_focus DESC
LIMIT 5;
```

## Visualizations

### Heat Map
```
                    FOCUS BY LOCATION
                    
          Home                      Office
    ┌─────────────────┐      ┌─────────────────┐
    │ Desk    ████ 8.2│      │ Desk    ███  6.8│
    │ Couch   ██   4.5│      │ Conf    ██   5.2│
    │ Kitchen █    2.1│      │ Lounge  ██   5.0│
    └─────────────────┘      └─────────────────┘
    
          Cafe                      Outdoors
    ┌─────────────────┐      ┌─────────────────┐
    │ Corner  ███  7.1│      │ Park    ████ 7.8│
    │ Window  ██   5.5│      │ Beach   ███  6.5│
    │ Center  █    3.2│      │ Trail   ██   5.0│
    └─────────────────┘      └─────────────────┘
```

### Environment Correlation
```
Focus Score vs Temperature
    │
 10 │                    ●
    │                  ● ● ●
  8 │                ● ● ● ●
    │              ● ● ● ● ●
  6 │            ● ● ● ● ●
    │          ● ● ● ●
  4 │        ● ● ●
    │      ● ●
  2 │    ●
    │
    └────────────────────────
      60  65  70  75  80  85°F
      
    Peak: 68-72°F
```

## Recommendations Engine

### Daily Suggestions
```typescript
function getLocationRecommendation(
  activity: string,
  conditions: CurrentConditions
): Recommendation {
  const historicalBest = getBestLocation(activity);
  const weatherAdjusted = adjustForWeather(historicalBest, conditions);
  
  return {
    primary: weatherAdjusted.best,
    alternative: weatherAdjusted.second,
    reason: `Based on ${historicalBest.sessions} past sessions, 
             your focus is ${historicalBest.improvement}% higher here.`,
    conditions: `Optimal temperature: ${historicalBest.temp}°F`
  };
}
```

## Integration Points

- Calendar: Auto-suggest locations for scheduled focus blocks
- Smart Home: Auto-adjust environment to optimal settings
- Notifications: Alert when current conditions are suboptimal
',
updated_at = NOW()
WHERE path = '/codex/neuro/bio_geometry_engine.md';
