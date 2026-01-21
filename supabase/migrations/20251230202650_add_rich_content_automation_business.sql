/*
  # Add Rich Content - Automation & Business

  Automation systems and business model documentation.
*/

-- Multi-Agent Orchestration
UPDATE codex_documents
SET content = '# Multi-Agent Orchestration

Coordinating multiple AI agents to work together on complex tasks, maintaining context and ensuring coherent output.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATION LAYER                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌───────────────────────────────────────────────────┐     │
│   │              TASK COORDINATOR                      │     │
│   │   Receives request → Plans execution → Assigns    │     │
│   └───────────────────────────────────────────────────┘     │
│                           │                                  │
│           ┌───────────────┼───────────────┐                 │
│           │               │               │                  │
│      ┌────▼────┐     ┌────▼────┐     ┌────▼────┐           │
│      │ AGENT A │     │ AGENT B │     │ AGENT C │           │
│      │ Research│     │ Writer  │     │ Reviewer│           │
│      └────┬────┘     └────┬────┘     └────┬────┘           │
│           │               │               │                  │
│           └───────────────┼───────────────┘                 │
│                           │                                  │
│   ┌───────────────────────▼───────────────────────────┐     │
│   │              SHARED MEMORY                         │     │
│   │   Context, artifacts, intermediate results        │     │
│   └───────────────────────────────────────────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Agent Definitions

### Research Agent
```typescript
const researchAgent = {
  name: ''Researcher'',
  model: ''claude-3-opus'',
  systemPrompt: `You are a research specialist. Your job is to:
    - Gather relevant information on topics
    - Verify facts from multiple sources
    - Summarize findings clearly
    - Flag uncertainties`,
  tools: [''web_search'', ''document_retrieval'', ''fact_check''],
  maxTokens: 4096
};
```

### Writer Agent
```typescript
const writerAgent = {
  name: ''Writer'',
  model: ''claude-3-sonnet'',
  systemPrompt: `You are a skilled writer. Your job is to:
    - Transform research into compelling content
    - Match specified tone and style
    - Structure content logically
    - Ensure clarity and engagement`,
  tools: [''style_guide_lookup'', ''grammar_check''],
  maxTokens: 8192
};
```

### Reviewer Agent
```typescript
const reviewerAgent = {
  name: ''Reviewer'',
  model: ''claude-3-opus'',
  systemPrompt: `You are a critical reviewer. Your job is to:
    - Check factual accuracy
    - Evaluate argument strength
    - Identify gaps or issues
    - Suggest improvements`,
  tools: [''fact_check'', ''plagiarism_check''],
  maxTokens: 2048
};
```

## Orchestration Patterns

### Sequential Pipeline
```
Request → Agent A → Agent B → Agent C → Response

Use when: Each stage depends on previous output
Example: Research → Write → Review
```

### Parallel Execution
```
           ┌─► Agent A ─┐
Request ───┼─► Agent B ─┼─► Merge → Response
           └─► Agent C ─┘

Use when: Tasks are independent
Example: Analyze from multiple perspectives
```

### Iterative Refinement
```
Request → Agent A ◄─────┐
              │         │
              ▼         │
          Agent B ──────┘
              │
              ▼
          Response

Use when: Quality improvement needed
Example: Write → Review → Revise cycle
```

## Implementation

### Task Coordinator
```typescript
class TaskCoordinator {
  private agents: Map<string, Agent>;
  private memory: SharedMemory;
  
  async execute(task: Task): Promise<Result> {
    const plan = await this.planExecution(task);
    
    for (const step of plan.steps) {
      const agent = this.agents.get(step.agentId);
      const context = await this.memory.getContext(step.contextKeys);
      
      const result = await agent.run({
        instruction: step.instruction,
        context,
        tools: step.tools
      });
      
      await this.memory.store(step.outputKey, result);
      
      if (step.validation) {
        const valid = await this.validate(result, step.validation);
        if (!valid) {
          return this.handleFailure(step, result);
        }
      }
    }
    
    return this.memory.get(plan.finalOutputKey);
  }
}
```

### Shared Memory
```typescript
class SharedMemory {
  private store: Map<string, any>;
  private history: MemoryEntry[];
  
  async store(key: string, value: any): Promise<void> {
    this.store.set(key, value);
    this.history.push({
      key,
      value,
      timestamp: Date.now(),
      version: this.getNextVersion(key)
    });
  }
  
  async getContext(keys: string[]): Promise<Context> {
    const items = keys.map(k => ({
      key: k,
      value: this.store.get(k)
    }));
    return new Context(items);
  }
}
```

## Error Handling

### Retry Strategy
```typescript
const retryConfig = {
  maxAttempts: 3,
  backoffMs: 1000,
  backoffMultiplier: 2,
  retryableErrors: [
    ''rate_limit'',
    ''timeout'',
    ''model_overloaded''
  ]
};
```

### Fallback Chain
```typescript
const fallbackChain = [
  { model: ''claude-3-opus'', priority: 1 },
  { model: ''gpt-4'', priority: 2 },
  { model: ''claude-3-sonnet'', priority: 3 }
];
```

## Monitoring

### Metrics Dashboard
```
┌─────────────────────────────────────────────────────┐
│  ORCHESTRATION METRICS                              │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Tasks Completed (24h): 142                         │
│  Average Duration: 45.2s                            │
│  Success Rate: 97.2%                                │
│                                                      │
│  Agent Performance:                                 │
│  ├── Researcher: 98% success, 12.3s avg            │
│  ├── Writer: 96% success, 28.1s avg                │
│  └── Reviewer: 99% success, 8.4s avg               │
│                                                      │
│  Token Usage (24h): 2.4M / 5M limit                │
│  Cost: $48.20                                       │
│                                                      │
└─────────────────────────────────────────────────────┘
```
',
updated_at = NOW()
WHERE path = '/codex/automation/multi_agent_orchestration.md';

-- Reliability Playbook
UPDATE codex_documents
SET content = '# Reliability Playbook

Procedures and practices for maintaining system reliability, handling incidents, and ensuring consistent service delivery.

## Reliability Principles

### The Four Pillars
```
┌─────────────────────────────────────────────────────────┐
│                 RELIABILITY PILLARS                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  AVAILABILITY     DURABILITY     PERFORMANCE    SECURITY│
│  ─────────────    ──────────     ───────────    ────────│
│  Systems are      Data is        Systems meet   Systems │
│  accessible       not lost       latency SLOs   resist  │
│  when needed                                    attack  │
│                                                          │
│  Target: 99.9%    Target: 0      Target: p99   Target: │
│                   data loss      <200ms        0 breach │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Service Level Objectives

### API Services
| Metric | SLO | Measurement |
|--------|-----|-------------|
| Availability | 99.9% | Uptime / Total Time |
| Latency (p50) | <50ms | 50th percentile |
| Latency (p99) | <200ms | 99th percentile |
| Error Rate | <0.1% | 5xx / Total Requests |

### Background Jobs
| Metric | SLO | Measurement |
|--------|-----|-------------|
| Success Rate | >99% | Successful / Total |
| Max Latency | <5min | Job duration |
| Queue Depth | <100 | Pending jobs |

## Incident Response

### Severity Levels

| Level | Description | Response Time | Example |
|-------|-------------|---------------|---------|
| P1 | Service down | Immediate | API returning 500s |
| P2 | Major degradation | <15 min | High latency |
| P3 | Minor impact | <1 hour | Feature broken |
| P4 | No impact | <1 day | Warning in logs |

### Response Procedure

```
┌────────────────────────────────────────────────────┐
│               INCIDENT RESPONSE                     │
├────────────────────────────────────────────────────┤
│                                                     │
│  1. DETECT                                         │
│     └─► Alert triggers or user report              │
│                                                     │
│  2. ASSESS                                         │
│     └─► Determine severity and scope               │
│                                                     │
│  3. COMMUNICATE                                    │
│     └─► Update status page, notify stakeholders    │
│                                                     │
│  4. MITIGATE                                       │
│     └─► Apply immediate fix or workaround          │
│                                                     │
│  5. RESOLVE                                        │
│     └─► Implement permanent solution               │
│                                                     │
│  6. REVIEW                                         │
│     └─► Post-mortem within 48 hours               │
│                                                     │
└────────────────────────────────────────────────────┘
```

### On-Call Checklist

#### Initial Response (First 5 minutes)
- [ ] Acknowledge alert
- [ ] Check dashboards for scope
- [ ] Join incident channel
- [ ] Assess severity level

#### Investigation (Minutes 5-30)
- [ ] Review recent deployments
- [ ] Check error logs
- [ ] Identify affected services
- [ ] Document timeline

#### Mitigation
- [ ] Apply fix or rollback
- [ ] Verify resolution
- [ ] Update status page
- [ ] Notify stakeholders

## Runbooks

### High Latency
```markdown
## Symptoms
- API latency >200ms
- Slow dashboard loads
- User complaints

## Diagnosis
1. Check database query performance
2. Review recent deployments
3. Check external dependencies
4. Verify cache hit rates

## Resolution Options
1. Scale up instances
2. Rollback recent deployment
3. Clear/warm cache
4. Add database indexes
```

### Out of Memory
```markdown
## Symptoms
- OOM errors in logs
- Container restarts
- Request failures

## Diagnosis
1. Check memory usage trends
2. Identify memory leaks
3. Review recent code changes
4. Check for traffic spikes

## Resolution Options
1. Restart affected containers
2. Increase memory limits
3. Deploy memory fix
4. Scale horizontally
```

## Monitoring Stack

### Alert Thresholds
| Metric | Warning | Critical |
|--------|---------|----------|
| CPU Usage | >70% | >90% |
| Memory Usage | >80% | >95% |
| Disk Usage | >70% | >85% |
| Error Rate | >0.5% | >1% |
| Latency p99 | >150ms | >300ms |

### Dashboard Views
```
┌─────────────────────────────────────────────────────┐
│  SYSTEM HEALTH                         [Live]       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Services: █ API  █ Web  █ Worker  █ DB            │
│           [OK]   [OK]   [OK]    [OK]               │
│                                                      │
│  Requests/sec: 450                                  │
│  ████████████████████████░░░░░░ 75% capacity       │
│                                                      │
│  Error Rate: 0.02%                                  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ Normal            │
│                                                      │
│  Latency (p99): 145ms                              │
│  ████████████████░░░░░░░░░░░░░░ Good              │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Post-Mortem Template

```markdown
# Incident Post-Mortem: [Title]

**Date**: YYYY-MM-DD
**Duration**: X hours Y minutes
**Severity**: P1/P2/P3
**Author**: [Name]

## Summary
Brief description of what happened.

## Timeline
- HH:MM - Event 1
- HH:MM - Event 2
- HH:MM - Incident detected
- HH:MM - Mitigation applied
- HH:MM - Resolved

## Root Cause
Detailed explanation of why this happened.

## Impact
- Users affected: X
- Revenue impact: $Y
- Data loss: Yes/No

## Lessons Learned
### What went well
- 

### What could be improved
- 

## Action Items
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
|        |       |          |        |
```
',
updated_at = NOW()
WHERE path = '/codex/automation/reliability_playbook.md';

-- RAG Photography
UPDATE codex_documents
SET content = '# RAG Photography System

Retrieval-Augmented Generation system for photography knowledge, enabling intelligent search and contextual answers about photographic techniques and equipment.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    RAG PHOTOGRAPHY                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐                      ┌─────────────┐       │
│  │   QUERY     │                      │  KNOWLEDGE  │       │
│  │  "How do I  │                      │    BASE     │       │
│  │   shoot     │                      │  ┌───────┐  │       │
│  │   stars?"   │                      │  │Manuals│  │       │
│  └──────┬──────┘                      │  │Guides │  │       │
│         │                             │  │Notes  │  │       │
│         ▼                             │  └───┬───┘  │       │
│  ┌─────────────┐    Semantic Search   │      │      │       │
│  │  EMBEDDING  │◄─────────────────────┼──────┘      │       │
│  └──────┬──────┘                      │             │       │
│         │                             └─────────────┘       │
│         ▼                                                   │
│  ┌─────────────┐    Top K Results                          │
│  │  RETRIEVAL  │────────────────────────────┐              │
│  └──────┬──────┘                            │              │
│         │                                   │              │
│         ▼                                   ▼              │
│  ┌──────────────────────────────────────────────┐         │
│  │                 LLM GENERATION                │         │
│  │  Context: [Retrieved chunks]                 │         │
│  │  Query: [User question]                      │         │
│  │  Output: [Contextual answer]                 │         │
│  └──────────────────────────────────────────────┘         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Knowledge Base

### Document Types
| Type | Source | Count | Update Frequency |
|------|--------|-------|------------------|
| Camera Manuals | PDFs | 5 | On new gear |
| Technique Guides | Markdown | 50+ | Monthly |
| Personal Notes | Obsidian | 200+ | Daily |
| Equipment Reviews | Web scrape | 100+ | Weekly |
| Tutorial Transcripts | Video | 30+ | Weekly |

### Chunking Strategy
```typescript
const chunkConfig = {
  maxSize: 1000,       // tokens
  overlap: 100,        // tokens
  separator: ''\\n\\n'',  // paragraph break
  metadata: [
    ''source'',
    ''document_type'',
    ''topic'',
    ''date_created''
  ]
};
```

## Vector Database

### Schema
```sql
CREATE TABLE photo_knowledge (
  id UUID PRIMARY KEY,
  content TEXT NOT NULL,
  embedding VECTOR(1536),  -- OpenAI ada-002
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON photo_knowledge 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

### Example Metadata
```json
{
  "source": "astro_ops.md",
  "document_type": "guide",
  "topic": ["astrophotography", "milky_way"],
  "equipment": ["sony_a7rv", "14mm_f1.8"],
  "difficulty": "intermediate",
  "last_updated": "2024-01-15"
}
```

## Query Processing

### Pipeline
```typescript
async function queryRAG(question: string): Promise<Answer> {
  // 1. Embed the question
  const queryEmbedding = await embed(question);
  
  // 2. Retrieve relevant chunks
  const chunks = await vectorDB.search({
    embedding: queryEmbedding,
    topK: 5,
    threshold: 0.7
  });
  
  // 3. Build context
  const context = chunks.map(c => c.content).join(''\\n\\n'');
  
  // 4. Generate answer
  const answer = await llm.generate({
    system: `You are a photography expert. Answer based on the 
             provided context. If unsure, say so.`,
    context,
    question
  });
  
  return {
    answer,
    sources: chunks.map(c => c.metadata.source)
  };
}
```

## Example Queries

### Technical Question
```
Q: "What settings should I use for photographing the Milky Way?"

Context Retrieved:
- Chunk from astro_ops.md (0.92 similarity)
- Chunk from gear_specs.md (0.85 similarity)
- Chunk from personal_notes/milky_way.md (0.81 similarity)

A: "For Milky Way photography, use these settings:
   - Aperture: f/1.8-2.8 (as wide as possible)
   - Shutter: 15-25 seconds (500 rule ÷ focal length)
   - ISO: 3200-6400
   - Focus: Manual, focused on bright star or infinity
   
   With your 14mm f/1.8, try: f/1.8, 25 seconds, ISO 3200.
   
   Sources: Astro Ops Guide, Gear Specifications"
```

### Troubleshooting
```
Q: "My star photos are coming out blurry, what''s wrong?"

Context Retrieved:
- Chunk from troubleshooting.md (0.88 similarity)
- Chunk from technique_guides/focus.md (0.84 similarity)

A: "Star blur typically has a few causes:
   1. Star trails: Exposure too long. Use 500/focal length rule.
   2. Focus issues: Use Live View zoomed 10x on a bright star.
   3. Vibration: Use 2-second delay or remote trigger.
   4. Atmospheric conditions: Check seeing conditions.
   
   Try: Reduce exposure time, verify focus with test shots.
   
   Sources: Troubleshooting Guide, Focus Techniques"
```

## Continuous Improvement

### Feedback Loop
```typescript
interface QueryFeedback {
  queryId: string;
  helpful: boolean;
  correctAnswer?: string;
  missingInfo?: string;
}

async function processFeedback(feedback: QueryFeedback) {
  if (!feedback.helpful) {
    // Log for review
    await logFailedQuery(feedback);
    
    // If correction provided, consider adding to knowledge base
    if (feedback.correctAnswer) {
      await queueForReview({
        type: ''knowledge_gap'',
        content: feedback.correctAnswer,
        context: feedback.missingInfo
      });
    }
  }
}
```

### Metrics
| Metric | Target | Current |
|--------|--------|---------|
| Query latency | <3s | 2.1s |
| Relevance score | >0.8 | 0.84 |
| User satisfaction | >4/5 | 4.2/5 |
| Answer accuracy | >90% | 88% |
',
updated_at = NOW()
WHERE path = '/codex/automation/rag_photography.md';

-- Automation Pipelines
UPDATE codex_documents
SET content = '# Automation Pipelines

End-to-end automation workflows for photography, content, and business processes.

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  PIPELINE ORCHESTRATOR                       │
│                       (n8n / Temporal)                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  TRIGGER          PROCESS           ACTION                  │
│  ───────          ───────           ──────                  │
│  • Webhook        • Transform       • Notify                │
│  • Schedule       • Validate        • Store                 │
│  • File Watch     • Enrich          • Publish               │
│  • Event          • AI Process      • Integrate             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Photo Import Pipeline

### Workflow
```
Memory Card Insert
        │
        ▼
┌───────────────┐
│  File Watch   │ Detect new RAW files
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   Ingest      │ Copy to import folder
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Metadata     │ Extract EXIF, rename
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   Organize    │ Sort by date/project
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   Backup      │ Sync to cloud
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   Catalog     │ Add to Lightroom
└───────────────┘
```

### Configuration
```yaml
photo_import:
  trigger:
    type: file_watch
    path: /Volumes/*/DCIM
    pattern: "*.ARW"
  
  steps:
    - name: ingest
      action: copy_files
      destination: ~/Photos/Import/{date}
      
    - name: metadata
      action: extract_exif
      rename_pattern: "{date}_{time}_{camera}_{sequence}"
      
    - name: organize
      action: move_files
      rules:
        - condition: "rating >= 4"
          destination: ~/Photos/Selects/{year}/{month}
        - condition: "keyword contains ''astro''"
          destination: ~/Photos/Astro/{year}
      
    - name: backup
      action: sync
      destinations:
        - s3://photos-backup/raw/
        - nas://photography/raw/
      
    - name: catalog
      action: lightroom_import
      collection: "Import {date}"
```

## Content Publishing Pipeline

### Social Media Automation
```
Edited Photo Export
        │
        ▼
┌───────────────┐
│  Quality      │ Verify resolution, color
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Caption      │ AI-generate description
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Schedule     │ Determine optimal time
└───────┬───────┘
        │
        ├──────────────┬──────────────┐
        │              │              │
        ▼              ▼              ▼
┌───────────┐  ┌───────────┐  ┌───────────┐
│ Instagram │  │  Twitter  │  │   500px   │
└───────────┘  └───────────┘  └───────────┘
```

### Configuration
```yaml
social_publish:
  trigger:
    type: folder_watch
    path: ~/Photos/Export/Social
    
  steps:
    - name: quality_check
      action: validate_image
      requirements:
        min_resolution: 2048x2048
        format: [jpg, png]
        color_space: sRGB
        
    - name: generate_caption
      action: ai_caption
      model: claude-3-sonnet
      style: engaging
      include_hashtags: true
      max_length: 2200  # Instagram limit
      
    - name: schedule
      action: optimal_time
      platforms: [instagram, twitter]
      timezone: America/Los_Angeles
      
    - name: publish
      action: multi_post
      platforms:
        instagram:
          type: feed
          alt_text: auto
        twitter:
          thread: false
        500px:
          category: landscape
```

## Business Pipeline

### Print Order Fulfillment
```
Order Received (Shopify)
        │
        ▼
┌───────────────┐
│  Validate     │ Check inventory, address
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Prepare      │ Generate print files
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Submit       │ Send to print lab
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Track        │ Monitor production
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Certificate  │ Generate authenticity
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  Notify       │ Email customer
└───────────────┘
```

## Monitoring Dashboard

```
┌─────────────────────────────────────────────────────┐
│  PIPELINE STATUS                                    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Photo Import                                        │
│  └── Last run: 2h ago │ Success │ 147 files        │
│                                                      │
│  Social Publishing                                  │
│  └── Scheduled: 3 posts │ Next: 6:00 PM            │
│                                                      │
│  Order Fulfillment                                  │
│  └── Active: 2 orders │ Awaiting: 1 shipment       │
│                                                      │
│  Recent Activity:                                   │
│  ├── 14:32 Photo import completed                  │
│  ├── 12:00 Instagram post published                │
│  └── 09:15 Order #1234 shipped                     │
│                                                      │
└─────────────────────────────────────────────────────┘
```
',
updated_at = NOW()
WHERE path = '/codex/automation/automation_pipelines.md';

-- Drop Model
UPDATE codex_documents
SET content = '# Drop Model

Limited edition release strategy for photography prints, creating scarcity and urgency to drive sales.

## Strategy Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     DROP MODEL                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   BUILD ANTICIPATION → RELEASE → SCARCITY → CLOSE          │
│                                                              │
│   • Tease content       • Limited qty     • Countdown       │
│   • Email waitlist      • Fixed window    • Sold out        │
│   • BTS content         • Clear pricing   • Archive         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Drop Structure

### Edition Tiers
| Tier | Quantity | Price Range | Includes |
|------|----------|-------------|----------|
| Standard | 50 | $200-400 | Signed print |
| Collector | 10 | $500-800 | + Certificate |
| Artist Proof | 5 | $1000-1500 | + Original sketch |
| Unique | 1 | $2000+ | + Personal delivery |

### Timeline
```
WEEK -4: Announce upcoming drop
WEEK -3: Reveal sneak peek
WEEK -2: Full image reveal
WEEK -1: Behind-the-scenes story
DAY 0:   Drop opens (fixed time)
DAY 1-3: Purchase window
DAY 3:   Drop closes / Sold out
WEEK +1: Shipping begins
```

## Pre-Drop Campaign

### Content Calendar
| Day | Content Type | Platform | Purpose |
|-----|--------------|----------|---------|
| -28 | Teaser | IG Story | Awareness |
| -21 | Location hint | Twitter | Engagement |
| -14 | Full reveal | Newsletter | Convert waitlist |
| -7 | Story video | YouTube | Emotional connection |
| -3 | Countdown | All | Urgency |
| -1 | Final reminder | Email | Convert |

### Waitlist Strategy
```typescript
interface WaitlistEntry {
  email: string;
  joinedAt: Date;
  source: string;
  engagementScore: number;
  previousPurchases: number;
}

// Priority access tiers
const accessTiers = {
  vip: {
    criteria: ''previousPurchases >= 2'',
    earlyAccess: 24 * 60 * 60 * 1000  // 24 hours
  },
  priority: {
    criteria: ''engagementScore >= 80'',
    earlyAccess: 12 * 60 * 60 * 1000  // 12 hours
  },
  general: {
    criteria: ''default'',
    earlyAccess: 0
  }
};
```

## Pricing Strategy

### Dynamic Pricing Model
```
Edition Numbers 1-10:   Base Price × 1.0
Edition Numbers 11-25:  Base Price × 1.25
Edition Numbers 26-40:  Base Price × 1.5
Edition Numbers 41-50:  Base Price × 2.0

Example (Base: $300):
  #1-10:  $300
  #11-25: $375
  #26-40: $450
  #41-50: $600
```

### Size Premiums
| Size | Multiplier | Example |
|------|------------|---------|
| 12×18 | 1.0x | $300 |
| 16×24 | 1.5x | $450 |
| 24×36 | 2.5x | $750 |
| 40×60 | 4.0x | $1200 |

## Launch Day Operations

### Hour-by-Hour Checklist
```
T-2h: Final system check
T-1h: Warm up email servers
T-30m: Pre-load product pages
T-15m: Alert waitlist of imminent launch
T-5m:  Final countdown posts
T-0:   GO LIVE
T+5m:  Monitor traffic, errors
T+30m: First milestone update
T+1h:  Sales update post
```

### Real-time Dashboard
```
┌─────────────────────────────────────────────────────┐
│  DROP STATUS: LIVE                    [03:45:22]    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  "Mountain Dawn" - Limited Edition                  │
│                                                      │
│  SOLD: ████████████████░░░░ 42/50                   │
│                                                      │
│  Revenue: $14,850                                   │
│  Avg Order: $353                                    │
│  Conversion: 8.2%                                   │
│                                                      │
│  Traffic: 512 concurrent                            │
│  Cart Abandonment: 12%                              │
│                                                      │
│  Top Sizes:                                         │
│  ├── 24×36: 18 sold                                │
│  ├── 16×24: 14 sold                                │
│  └── 12×18: 10 sold                                │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Post-Drop Analysis

### Metrics Template
```markdown
## Drop Analysis: [Name]

### Results
- Total Revenue: $X
- Units Sold: X/X
- Sell-through Rate: X%
- Average Order Value: $X
- Time to Sellout: X hours

### Traffic
- Unique Visitors: X
- Conversion Rate: X%
- Top Traffic Sources:
  1. Email: X%
  2. Instagram: X%
  3. Direct: X%

### Learnings
- What worked:
- What to improve:
- Next drop adjustments:
```
',
updated_at = NOW()
WHERE path = '/codex/business/drop_model.md';

-- Workshop Engines
UPDATE codex_documents
SET content = '# Workshop Engines

Systems for creating, marketing, and delivering photography workshops and educational experiences.

## Workshop Types

### Format Matrix
| Type | Duration | Price Range | Group Size | Delivery |
|------|----------|-------------|------------|----------|
| Webinar | 2 hours | Free-$50 | Unlimited | Virtual |
| Online Course | Self-paced | $100-500 | Unlimited | Async |
| Virtual Workshop | 1 day | $200-400 | 15-30 | Live virtual |
| In-Person | 1-3 days | $500-2000 | 8-15 | Location |
| Expedition | 5-14 days | $3000-8000 | 6-10 | Travel |

## Course Creation Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                 COURSE CREATION PIPELINE                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PLAN          CREATE         PRODUCE        LAUNCH         │
│  ────          ──────         ───────        ──────         │
│  Outline       Content        Record         Pre-sell       │
│  Structure     Scripts        Edit           Open cart      │
│  Pricing       Slides         Upload         Support        │
│  Timeline      Exercises      Test           Iterate        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Content Structure
```
COURSE: [Title]
│
├── Module 1: Foundation
│   ├── 1.1 Introduction (Video: 10 min)
│   ├── 1.2 Core Concepts (Video: 20 min)
│   ├── 1.3 Exercise: [Task]
│   └── 1.4 Q&A / Discussion
│
├── Module 2: Technique
│   ├── 2.1 Theory (Video: 15 min)
│   ├── 2.2 Demonstration (Video: 30 min)
│   ├── 2.3 Practice Exercise
│   └── 2.4 Feedback Session
│
├── Module 3: Advanced
│   └── ...
│
└── Bonus: Resources
    ├── Cheat Sheets (PDF)
    ├── Presets (LR/PS)
    └── Community Access
```

## In-Person Workshop Template

### Day Schedule
```
07:00 - Sunrise shoot (field)
09:00 - Breakfast
10:00 - Morning session (classroom)
        - Review morning shots
        - Technical instruction
12:30 - Lunch
14:00 - Afternoon session (field)
        - Guided shooting
        - One-on-one coaching
17:00 - Golden hour shoot
19:00 - Dinner
20:30 - Post-processing demo
        - Q&A
22:00 - End
```

### Logistics Checklist
```
VENUE
□ Classroom space booked
□ AV equipment confirmed
□ WiFi credentials
□ Parking information

EQUIPMENT
□ Demo camera + lenses
□ Laptop + projector
□ Backup drives
□ Printed materials

PARTICIPANTS
□ Roster confirmed
□ Skill levels assessed
□ Equipment list sent
□ Location details sent

CONTINGENCY
□ Weather backup plan
□ Emergency contacts
□ Insurance confirmed
□ First aid kit
```

## Marketing Funnel

```
AWARENESS           INTEREST            DECISION           ACTION
─────────           ────────            ────────           ──────
                    
Free Content   →    Lead Magnet    →    Sales Page    →    Enroll
Blog posts          Free guide          Testimonials        Checkout
YouTube             Webinar             Curriculum          Onboard
Social              Email series        Pricing             Support

Metrics:
10,000 views   →    500 signups    →    50 sales      →    45 complete
(5% convert)        (10% convert)       (90% complete)
```

### Email Sequence
| Day | Email | Purpose |
|-----|-------|---------|
| 0 | Welcome | Deliver lead magnet |
| 2 | Value | Teaching content |
| 4 | Story | Personal connection |
| 6 | Social Proof | Testimonials |
| 8 | Offer | Workshop announcement |
| 10 | FAQ | Overcome objections |
| 12 | Deadline | Urgency |
| 14 | Last Chance | Final push |

## Student Success System

### Progress Tracking
```typescript
interface StudentProgress {
  id: string;
  enrolled: Date;
  modulesCompleted: number[];
  exercisesSubmitted: Exercise[];
  feedbackReceived: Feedback[];
  communityPosts: number;
  lastActive: Date;
}

// Engagement triggers
const triggers = {
  inactive7Days: ''Check-in email'',
  moduleCompleted: ''Celebration + next steps'',
  exerciseSubmitted: ''Feedback within 48h'',
  courseCompleted: ''Certificate + testimonial request''
};
```

### Feedback Collection
```
POST-WORKSHOP SURVEY

1. Overall satisfaction (1-10): ___

2. What was most valuable?
   _________________________

3. What could be improved?
   _________________________

4. Would you recommend? (Y/N)

5. Testimonial (optional):
   _________________________
```

## Financial Model

### Workshop Economics
| Item | Revenue/Cost |
|------|--------------|
| **Revenue** | |
| 12 participants × $1,500 | $18,000 |
| **Costs** | |
| Venue | -$2,000 |
| Meals | -$1,200 |
| Materials | -$300 |
| Travel | -$500 |
| Marketing | -$1,000 |
| **Net Profit** | **$13,000** |
| **Margin** | **72%** |

### Online Course Economics
| Item | Amount |
|------|--------|
| Development time | 80 hours |
| Production cost | $2,000 |
| Platform fees | 5% |
| Price point | $297 |
| Break-even | 10 sales |
| Target (Year 1) | 200 sales |
| **Projected Revenue** | **$56,430** |
',
updated_at = NOW()
WHERE path = '/codex/business/workshop_engines.md';

-- Money OS
UPDATE codex_documents
SET content = '# Money Operating System

Financial management framework for creative business, including revenue tracking, expense management, and financial planning.

## Financial Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      MONEY OS                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   INCOME              OPERATIONS           GROWTH            │
│   ──────              ──────────           ──────            │
│   Print Sales         Operating Costs      Investments       │
│   Workshops           Tax Reserve          R&D               │
│   Licensing           Emergency Fund       Marketing         │
│   Commissions         Insurance            Equipment         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Revenue Streams

### Stream Analysis
| Stream | % Revenue | Margin | Effort | Scalability |
|--------|-----------|--------|--------|-------------|
| Print Sales | 40% | 70% | Medium | High |
| Workshops | 30% | 60% | High | Low |
| Licensing | 15% | 90% | Low | High |
| Commissions | 10% | 50% | High | Low |
| Other | 5% | Varies | Low | Medium |

### Monthly Revenue Target
```
┌─────────────────────────────────────────────────────┐
│  MONTHLY REVENUE TARGET: $15,000                    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Print Sales      ████████████████  $6,000  (40%)  │
│  Workshops        ████████████      $4,500  (30%)  │
│  Licensing        ██████            $2,250  (15%)  │
│  Commissions      ████              $1,500  (10%)  │
│  Other            ██                $750    (5%)   │
│                                                      │
│  YTD Progress: ████████░░░░░░░░░░░ $95,000/$180K  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Account Structure

### Bank Accounts
```
┌─────────────────────────────────────────────────────┐
│  ACCOUNT STRUCTURE                                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  BUSINESS CHECKING                                  │
│  └── All income deposits here first                │
│                                                      │
│  TAX RESERVE (30% of income)                        │
│  └── Quarterly estimated payments                   │
│                                                      │
│  OPERATING (50% of income)                          │
│  └── Monthly expenses paid from here               │
│                                                      │
│  PROFIT (20% of income)                             │
│  └── Distributions + emergency fund                │
│                                                      │
│  INVESTMENT (Overflow)                              │
│  └── Growth capital                                │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Allocation Rules
```typescript
const allocations = {
  onIncome: (amount: number) => ({
    taxReserve: amount * 0.30,
    operating: amount * 0.50,
    profit: amount * 0.20
  }),
  
  onQuarterly: {
    taxPayment: ''taxReserve → IRS'',
    distribution: ''profit → personal'',
    review: ''rebalance accounts''
  }
};
```

## Expense Categories

### Fixed Monthly
| Category | Budget | Actual |
|----------|--------|--------|
| Software/Subscriptions | $500 | $475 |
| Insurance | $200 | $200 |
| Storage (cloud + physical) | $150 | $142 |
| Website/Hosting | $50 | $45 |
| Accounting | $200 | $200 |
| **Total Fixed** | **$1,100** | **$1,062** |

### Variable
| Category | Budget | Notes |
|----------|--------|-------|
| Print Production | 25% of print sales | Per order |
| Workshop Costs | 30% of workshop revenue | Per event |
| Marketing | $500-1000/mo | Scale with launches |
| Equipment | $500/mo avg | Annualized |
| Travel | Varies | Project-based |

## Financial Dashboard

```
┌─────────────────────────────────────────────────────┐
│  FINANCIAL DASHBOARD                   Jan 2024     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  REVENUE                                            │
│  MTD: $12,450          Target: $15,000             │
│  ████████████████░░░░░ 83%                         │
│                                                      │
│  EXPENSES                                           │
│  MTD: $4,230           Budget: $5,500              │
│  ██████████████░░░░░░░ 77%                         │
│                                                      │
│  NET PROFIT                                         │
│  MTD: $8,220           Target: $9,500              │
│  ████████████████░░░░░ 86%                         │
│                                                      │
│  CASH POSITION                                      │
│  Operating: $15,420                                 │
│  Tax Reserve: $28,900                               │
│  Profit: $12,100                                    │
│  Emergency: $30,000 ✓                               │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Tax Planning

### Quarterly Estimates
| Quarter | Due Date | Estimated | Paid |
|---------|----------|-----------|------|
| Q1 | April 15 | $4,500 | ✓ |
| Q2 | June 15 | $4,500 | ✓ |
| Q3 | Sept 15 | $4,500 | Pending |
| Q4 | Jan 15 | $4,500 | - |

### Deduction Tracking
```
TRACKED DEDUCTIONS (YTD)

Equipment: $3,200
└── Camera body, lenses

Software: $2,400
└── Adobe, Lightroom, etc.

Travel: $4,800
└── Business trips, workshops

Home Office: $3,600
└── Rent portion, utilities

Marketing: $2,100
└── Ads, promotions

Education: $1,500
└── Courses, workshops

TOTAL DEDUCTIONS: $17,600
EST. TAX SAVINGS: $4,400
```

## Annual Review Template

```markdown
## Annual Financial Review: [Year]

### Revenue Summary
- Total Revenue: $
- vs. Previous Year: +/-X%
- vs. Target: +/-X%

### By Stream
| Stream | Revenue | % Total | YoY Change |
|--------|---------|---------|------------|
|        |         |         |            |

### Expense Summary
- Total Expenses: $
- Gross Margin: X%
- Net Margin: X%

### Key Wins
1. 
2. 

### Areas to Improve
1. 
2. 

### Next Year Targets
- Revenue: $
- Net Profit: $
- Key Initiatives:
```
',
updated_at = NOW()
WHERE path = '/codex/business/money_os.md';
