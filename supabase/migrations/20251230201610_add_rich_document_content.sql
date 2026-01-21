/*
  # Add Rich Content to Codex Documents

  This migration updates all codex documents with comprehensive, informative content
  including detailed explanations, code examples, checklists, and interactive elements.

  1. Root Section
    - Identity: Personal identity framework
    - Territory Mode: Operating principles
    - Reality Filter: Perception system

  2. Council Section
    - All role definitions with responsibilities
    - Protocol documentation

  3. All other sections with full content
*/

-- Root Section: Identity
UPDATE codex_documents
SET content = '# Identity Framework

Your identity is the foundation upon which all systems are built. This document defines the core principles that guide decision-making, creative output, and system design.

## Core Values

### 1. Authenticity Over Performance
Every action should stem from genuine intention rather than external validation. This means:
- Creating work that resonates personally before considering audience
- Making decisions aligned with internal compass
- Accepting discomfort over compromise

### 2. Systems Thinking
View everything as interconnected systems:
- Inputs and outputs are always linked
- Small changes cascade through networks
- Optimization requires holistic understanding

### 3. Continuous Evolution
Identity is not static but a living system:
- Regular reflection and adjustment
- Embrace change as growth signal
- Document evolution for pattern recognition

## Identity Pillars

| Pillar | Description | Expression |
|--------|-------------|------------|
| Creator | Building things that matter | Photography, code, systems |
| Explorer | Seeking novel experiences | Travel, learning, experiments |
| Connector | Building meaningful relationships | Community, collaboration |
| Optimizer | Improving efficiency | Automation, workflows |

## Daily Alignment Check

Use this checklist to ensure daily alignment:

- [ ] Did today''s primary task align with core values?
- [ ] Was energy directed toward high-leverage activities?
- [ ] Were boundaries respected and maintained?
- [ ] Was there time for reflection and adjustment?

## Integration Points

This identity framework connects to:
- **Territory Mode**: How identity manifests in daily operations
- **Reality Filter**: How identity shapes perception
- **Personal OS**: Practical implementation of identity principles

> "Identity is not discovered, it is created through consistent action aligned with chosen values."
',
updated_at = NOW()
WHERE path = '/codex/root/identity.md';

-- Root Section: Territory Mode
UPDATE codex_documents
SET content = '# Territory Mode

Territory Mode is the operational framework for maintaining sovereignty over your time, energy, and creative output. It defines boundaries, priorities, and engagement rules.

## Operating Principles

### Defended Boundaries
Your territory requires active defense:

```
TERRITORY BOUNDARIES
├── Time: Protected creative blocks (4-hour minimum)
├── Energy: Reserve 30% for unexpected demands
├── Attention: Single-tasking as default mode
└── Space: Designated zones for different work types
```

### Engagement Rules

| Context | Rule | Rationale |
|---------|------|-----------|
| Deep Work | No interruptions | Flow state protection |
| Communication | Async by default | Batch processing efficiency |
| Meetings | Max 2 per day | Energy preservation |
| New Projects | 48-hour decision buffer | Prevent reactive commitments |

## Daily Territory Protocol

### Morning Activation (6:00-7:00)
1. Review territory status
2. Identify primary objective
3. Block protect first 4 hours
4. Set communication boundaries

### Active Defense (7:00-18:00)
1. Execute primary objective first
2. Batch secondary tasks
3. Process communications in windows
4. Document interruption patterns

### Evening Deactivation (18:00-19:00)
1. Complete open loops
2. Capture tomorrow''s priorities
3. Review territory integrity
4. Initiate recovery protocols

## Territory Metrics

Track these indicators weekly:

| Metric | Target | Warning |
|--------|--------|---------|
| Deep work hours | 20+ | <15 |
| Interruption count | <5/day | >10/day |
| Energy EOD | 30%+ | <20% |
| Primary objective completion | 90%+ | <70% |

## Threat Response Matrix

| Threat Level | Indicator | Response |
|--------------|-----------|----------|
| Green | Normal operations | Maintain protocols |
| Yellow | Boundary pressure | Reinforce defenses |
| Orange | Active intrusion | Emergency protocols |
| Red | Territory collapse | Full reset required |

## Recovery Protocols

When territory integrity is compromised:

1. **Immediate**: Stop all non-essential activity
2. **Assess**: Identify breach source
3. **Contain**: Establish temporary boundaries
4. **Restore**: Rebuild from core protocols
5. **Fortify**: Strengthen weak points
',
updated_at = NOW()
WHERE path = '/codex/root/territory_mode.md';

-- Root Section: Reality Filter
UPDATE codex_documents
SET content = '# Reality Filter

The Reality Filter is a cognitive framework for processing information, making decisions, and maintaining accurate mental models of the world.

## Filter Architecture

```
INPUT STREAM
    │
    ▼
┌─────────────────┐
│  Source Check   │ ─── Is this first-hand or filtered?
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Bias Scan      │ ─── What distortions might exist?
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Model Update   │ ─── How does this change understanding?
└────────┬────────┘
         │
         ▼
    PROCESSED OUTPUT
```

## Information Tiers

### Tier 1: Direct Experience
- Personal observation
- First-hand experiments
- Measurable outcomes
- **Trust Level: 95%**

### Tier 2: Trusted Sources
- Domain experts with track record
- Peer-reviewed research
- Primary documents
- **Trust Level: 75%**

### Tier 3: Secondary Sources
- Curated news sources
- Educational content
- Expert commentary
- **Trust Level: 50%**

### Tier 4: Unverified
- Social media claims
- Anonymous sources
- Sensational content
- **Trust Level: 10%**

## Cognitive Bias Checklist

Before accepting information, scan for:

- [ ] **Confirmation Bias**: Does this just confirm existing beliefs?
- [ ] **Recency Bias**: Am I overweighting recent events?
- [ ] **Authority Bias**: Am I accepting this because of who said it?
- [ ] **Survivorship Bias**: Am I only seeing successful examples?
- [ ] **Anchoring**: Am I stuck on the first number/idea presented?

## Decision Framework

### For Reversible Decisions
- Speed over accuracy
- 70% confidence threshold
- Bias toward action
- Learn from outcomes

### For Irreversible Decisions
- Accuracy over speed
- 90% confidence threshold
- Seek disconfirming evidence
- Sleep on it (minimum 24 hours)

## Reality Testing Protocol

Weekly reality check questions:

1. What belief have I held longest without testing?
2. What would change my mind about my current priority?
3. Where am I most likely wrong right now?
4. What am I avoiding looking at?

## Filter Maintenance

| Frequency | Action |
|-----------|--------|
| Daily | Review information sources consumed |
| Weekly | Audit belief changes |
| Monthly | Test one core assumption |
| Quarterly | Major model review |
',
updated_at = NOW()
WHERE path = '/codex/root/reality_filter.md';

-- Council Section: Architect Role
UPDATE codex_documents
SET content = '# Architect Role

The Architect is responsible for high-level system design, strategic direction, and ensuring all components work together coherently.

## Core Responsibilities

### Strategic Design
- Define system architecture across all domains
- Establish design principles and patterns
- Create integration blueprints
- Maintain technical roadmap

### Quality Assurance
- Review major technical decisions
- Ensure consistency across systems
- Identify technical debt
- Prioritize refactoring efforts

### Documentation
- Maintain architecture decision records (ADRs)
- Create system diagrams and flowcharts
- Document integration patterns
- Keep technical specifications current

## Decision Authority

| Decision Type | Authority Level |
|---------------|-----------------|
| Tech stack changes | Full |
| Integration patterns | Full |
| Data architecture | Full |
| Feature prioritization | Advisory |
| Resource allocation | Advisory |

## Design Principles

### 1. Simplicity First
> "The best architecture is the one that doesn''t exist"

Every component must justify its existence. Complexity is a cost.

### 2. Loose Coupling
Systems should communicate through well-defined interfaces:

```
┌──────────┐     API     ┌──────────┐
│ System A │ ◄─────────► │ System B │
└──────────┘             └──────────┘
     │                        │
     └────────► Events ◄──────┘
```

### 3. Graceful Degradation
When components fail, the system should degrade gracefully rather than collapse entirely.

### 4. Observable Systems
Every system must expose metrics, logs, and traces for monitoring and debugging.

## Weekly Review Checklist

- [ ] Review new technical decisions made
- [ ] Assess system health metrics
- [ ] Identify emerging technical debt
- [ ] Update architecture documentation
- [ ] Plan next week''s architectural focus

## Collaboration Points

| Role | Interaction |
|------|-------------|
| Systems Architect | Implementation details |
| UX Specialist | User-facing architecture |
| CDAAO | Data and AI integration |
| Creative Agent | Creative system design |
',
updated_at = NOW()
WHERE path = '/codex/council/roles/architect.md';

-- Council Section: Systems Architect Role
UPDATE codex_documents
SET content = '# Systems Architect Role

The Systems Architect focuses on infrastructure, deployment pipelines, and operational excellence of all technical systems.

## Core Responsibilities

### Infrastructure Management
- Design and maintain cloud infrastructure
- Optimize resource utilization
- Implement security best practices
- Manage deployment pipelines

### Reliability Engineering
- Define SLOs and SLAs
- Implement monitoring and alerting
- Create incident response procedures
- Conduct post-mortems

### Performance Optimization
- Profile and benchmark systems
- Identify bottlenecks
- Implement caching strategies
- Scale systems appropriately

## Technology Stack

### Current Infrastructure
```
┌─────────────────────────────────────┐
│           Edge Layer                │
│  Cloudflare CDN / Edge Functions    │
├─────────────────────────────────────┤
│         Application Layer           │
│   Supabase / Vercel / Railway       │
├─────────────────────────────────────┤
│          Data Layer                 │
│  PostgreSQL / Redis / S3            │
├─────────────────────────────────────┤
│        Monitoring Layer             │
│   Grafana / Prometheus / Sentry     │
└─────────────────────────────────────┘
```

### Key Technologies
| Category | Technology | Purpose |
|----------|------------|---------|
| Database | PostgreSQL | Primary data store |
| Cache | Redis | Session & query cache |
| Storage | S3/R2 | Media and backups |
| CI/CD | GitHub Actions | Automated deployment |
| Monitoring | Grafana | Metrics visualization |

## Operational Metrics

### Service Level Objectives

| Service | Availability | Latency (p99) |
|---------|-------------|---------------|
| API | 99.9% | <200ms |
| Web App | 99.5% | <1s |
| Background Jobs | 99% | <5min |

### Incident Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| P1 | Service down | Immediate |
| P2 | Major degradation | <1 hour |
| P3 | Minor impact | <4 hours |
| P4 | Low priority | Next business day |

## Weekly Operational Review

- [ ] Review uptime metrics
- [ ] Analyze error rates and patterns
- [ ] Check resource utilization
- [ ] Review security alerts
- [ ] Update runbooks as needed
- [ ] Plan capacity adjustments

## Security Checklist

- [ ] Secrets rotated on schedule
- [ ] Dependencies updated
- [ ] Access logs reviewed
- [ ] Backup integrity verified
- [ ] SSL certificates valid
',
updated_at = NOW()
WHERE path = '/codex/council/roles/systems_architect.md';

-- Council Section: UX Specialist Role
UPDATE codex_documents
SET content = '# UX Specialist Role

The UX Specialist ensures all user-facing systems provide exceptional experiences through research, design, and continuous improvement.

## Core Responsibilities

### User Research
- Conduct user interviews and surveys
- Analyze usage patterns and metrics
- Create user personas and journey maps
- Identify pain points and opportunities

### Design Systems
- Maintain component libraries
- Define interaction patterns
- Establish accessibility standards
- Create responsive design guidelines

### Prototyping & Testing
- Build interactive prototypes
- Conduct usability testing
- Iterate based on feedback
- Validate design decisions

## Design Principles

### 1. Clarity Over Cleverness
Users should never have to guess what something does. Clear labels, obvious actions, predictable outcomes.

### 2. Progressive Disclosure
Show essential information first. Reveal complexity only when needed.

```
Level 1: Core Action (visible)
    │
    └─► Level 2: Options (on demand)
            │
            └─► Level 3: Advanced (hidden)
```

### 3. Consistent Patterns
Same action = same interaction everywhere. Build muscle memory.

### 4. Graceful Errors
When things go wrong, explain clearly and offer solutions.

## Component Library

### Core Components
| Component | Usage | Variants |
|-----------|-------|----------|
| Button | Primary actions | Primary, Secondary, Danger, Ghost |
| Input | Data entry | Text, Number, Date, Search |
| Card | Content containers | Default, Interactive, Elevated |
| Modal | Focused interactions | Dialog, Drawer, Full-screen |

### Design Tokens

```css
/* Spacing Scale */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;

/* Typography Scale */
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;
```

## Accessibility Standards

### WCAG 2.1 AA Compliance
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Keyboard navigable
- [ ] Screen reader compatible
- [ ] Focus indicators visible
- [ ] Error messages descriptive

### Testing Checklist
- [ ] Lighthouse accessibility score ≥ 90
- [ ] Tested with VoiceOver/NVDA
- [ ] Keyboard-only navigation verified
- [ ] Color blind modes tested

## Metrics to Track

| Metric | Target | Measurement |
|--------|--------|-------------|
| Task completion rate | >90% | User testing |
| Time on task | -20% vs baseline | Analytics |
| Error rate | <5% | Error tracking |
| Satisfaction score | >4.2/5 | Surveys |
',
updated_at = NOW()
WHERE path = '/codex/council/roles/ux_specialist.md';

-- Council Section: CDAAO Role
UPDATE codex_documents
SET content = '# Chief Data & AI Architecture Officer (CDAAO)

The CDAAO oversees all data strategy, AI/ML implementations, and ensures data-driven decision making across all systems.

## Core Responsibilities

### Data Strategy
- Define data collection and storage policies
- Ensure data quality and governance
- Design data pipelines and transformations
- Manage data lifecycle

### AI/ML Operations
- Evaluate and implement AI solutions
- Maintain model performance
- Ensure responsible AI practices
- Optimize inference costs

### Analytics & Insights
- Build dashboards and reports
- Enable self-service analytics
- Identify data-driven opportunities
- Measure and optimize KPIs

## Data Architecture

```
┌─────────────────────────────────────────────┐
│              Data Sources                    │
│  APIs │ Sensors │ User Input │ External     │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│           Ingestion Layer                    │
│     Event Streams │ Batch Jobs │ CDC        │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│           Processing Layer                   │
│   Transform │ Enrich │ Validate │ Model     │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│           Storage Layer                      │
│   PostgreSQL │ Vector DB │ Object Store     │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│           Consumption Layer                  │
│   APIs │ Dashboards │ ML Models │ Reports   │
└─────────────────────────────────────────────┘
```

## AI Model Inventory

| Model | Purpose | Provider | Cost |
|-------|---------|----------|------|
| GPT-4 | Complex reasoning | OpenAI | $30/1M tokens |
| Claude | Long context tasks | Anthropic | $15/1M tokens |
| Embeddings | Semantic search | OpenAI | $0.13/1M tokens |
| Whisper | Audio transcription | OpenAI | $0.006/min |

## Data Quality Framework

### Quality Dimensions
| Dimension | Definition | Target |
|-----------|------------|--------|
| Accuracy | Data correctness | >99% |
| Completeness | No missing values | >95% |
| Timeliness | Data freshness | <1 hour |
| Consistency | Cross-system agreement | 100% |

### Monitoring Queries

```sql
-- Data freshness check
SELECT 
  table_name,
  MAX(updated_at) as last_update,
  NOW() - MAX(updated_at) as lag
FROM information_schema.tables
GROUP BY table_name
HAVING NOW() - MAX(updated_at) > interval ''1 hour'';

-- Completeness check
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN field IS NULL THEN 1 END) as nulls,
  ROUND(100.0 * COUNT(CASE WHEN field IS NULL THEN 1 END) / COUNT(*), 2) as null_pct
FROM table_name;
```

## Weekly Data Review

- [ ] Review data quality metrics
- [ ] Check AI model performance
- [ ] Audit data access patterns
- [ ] Update data documentation
- [ ] Plan data infrastructure improvements
',
updated_at = NOW()
WHERE path = '/codex/council/roles/cdaao.md';

-- Council Section: Creative Agent Role
UPDATE codex_documents
SET content = '# Creative Agent Role

The Creative Agent drives artistic vision, ensures creative excellence, and maintains the aesthetic coherence across all projects.

## Core Responsibilities

### Creative Direction
- Define and evolve visual identity
- Establish creative standards
- Guide artistic decisions
- Maintain brand coherence

### Project Execution
- Lead creative projects
- Collaborate with technical teams
- Ensure quality of deliverables
- Meet creative deadlines

### Innovation
- Research new techniques
- Experiment with tools and methods
- Push creative boundaries
- Document learnings

## Creative Framework

### Visual Identity Pillars

```
                    ┌─────────────┐
                    │   Vision    │
                    │  "Capture   │
                    │   wonder"   │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼─────┐    ┌─────▼─────┐    ┌─────▼─────┐
    │   Bold    │    │  Natural  │    │   Tech    │
    │ Contrast  │    │  Beauty   │    │ Precision │
    └───────────┘    └───────────┘    └───────────┘
```

### Style Guidelines

| Element | Specification |
|---------|---------------|
| Color Palette | Earth tones + Electric accents |
| Typography | Clean sans-serif + Display serif |
| Imagery | High contrast, natural subjects |
| Motion | Smooth, purposeful transitions |

## Project Workflow

### 1. Brief & Research
- Understand objectives
- Research references
- Define success criteria
- Timeline estimation

### 2. Concept Development
- Ideation sessions
- Mood boards
- Initial sketches
- Concept presentation

### 3. Production
- Asset creation
- Technical execution
- Quality checks
- Version control

### 4. Delivery & Archive
- Final delivery
- Asset organization
- Documentation
- Retrospective

## Quality Checklist

### Pre-Delivery
- [ ] Meets creative brief requirements
- [ ] Technical specifications correct
- [ ] Color accuracy verified
- [ ] Typography consistent
- [ ] Responsive across devices
- [ ] Accessibility reviewed

### Post-Delivery
- [ ] Assets properly archived
- [ ] Metadata complete
- [ ] Source files organized
- [ ] Process documented

## Creative Tools

| Category | Primary Tool | Backup |
|----------|--------------|--------|
| Photo Editing | Lightroom + Photoshop | Capture One |
| Vector | Illustrator | Figma |
| UI/UX | Figma | Sketch |
| 3D | Blender | Cinema 4D |
| Video | Premiere + After Effects | DaVinci |

## Inspiration Sources

- **Daily**: Behance, Dribbble, Instagram curated
- **Weekly**: Design publications, museum visits
- **Monthly**: Conferences, workshops, exhibitions
- **Quarterly**: Travel, nature immersion
',
updated_at = NOW()
WHERE path = '/codex/council/roles/creative_agent.md';

-- Council Section: Chairman Role
UPDATE codex_documents
SET content = '# Chairman Role

The Chairman provides strategic oversight, facilitates decision-making, and ensures alignment across all council roles and initiatives.

## Core Responsibilities

### Strategic Leadership
- Set overall direction and priorities
- Resolve conflicts between roles
- Make final decisions when consensus fails
- Communicate vision and goals

### Coordination
- Facilitate council meetings
- Ensure role accountability
- Remove blockers
- Allocate resources

### External Relations
- Represent the organization
- Build strategic partnerships
- Manage stakeholder relationships
- Handle crisis communications

## Decision Framework

### Decision Types & Process

| Type | Timeline | Process |
|------|----------|---------|
| Operational | Same day | Individual role decides |
| Tactical | 1-3 days | Role + Chairman approval |
| Strategic | 1+ week | Full council consensus |
| Crisis | Immediate | Chairman decides |

### Escalation Path

```
Individual Role
      │
      ▼ (if blocked)
Related Roles Discuss
      │
      ▼ (if no consensus)
Chairman Mediates
      │
      ▼ (if still blocked)
Chairman Decides
```

## Meeting Structure

### Weekly Council Sync (60 min)

| Time | Activity |
|------|----------|
| 0-10 | Wins and blockers roundtable |
| 10-30 | Priority discussions |
| 30-50 | Decision items |
| 50-60 | Action items and next steps |

### Monthly Strategy Review (2 hours)

| Time | Activity |
|------|----------|
| 0-30 | Metrics review |
| 30-60 | Strategic initiatives update |
| 60-90 | Long-term planning |
| 90-120 | Resource allocation |

## Key Metrics Dashboard

| Category | Metric | Target |
|----------|--------|--------|
| Execution | Projects on track | >80% |
| Finance | Budget variance | <10% |
| Quality | Customer satisfaction | >4.5/5 |
| Team | Role effectiveness | >4/5 |

## Crisis Response Protocol

### Level Assessment
1. **Minor**: Single role can handle
2. **Moderate**: Multi-role coordination needed
3. **Major**: Chairman takes command
4. **Critical**: All hands on deck

### Response Steps
1. Acknowledge and assess
2. Communicate with stakeholders
3. Assign response team
4. Execute containment
5. Document and debrief

## Quarterly Review Template

- [ ] Review strategic objectives progress
- [ ] Assess role performance
- [ ] Update resource allocation
- [ ] Refine priorities for next quarter
- [ ] Document lessons learned
',
updated_at = NOW()
WHERE path = '/codex/council/roles/chairman.md';
