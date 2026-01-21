/*
  # Add Rich Content - Protocols & Territory

  Comprehensive content for:
  1. Council Protocols (7 Phase, Swarm Layer, Transparent Reasoning)
  2. Territory Section (Ledger, Boot Sequence, Version Schema, Update Protocol)
*/

-- 7 Phase Protocol
UPDATE codex_documents
SET content = '# 7 Phase Protocol

A systematic approach to executing projects from inception to completion, ensuring thorough planning, execution, and learning.

## Protocol Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    7 PHASE PROTOCOL                          │
├─────────────────────────────────────────────────────────────┤
│  ① SPARK      │ Capture initial idea and energy            │
├─────────────────────────────────────────────────────────────┤
│  ② SCOPE      │ Define boundaries and success criteria     │
├─────────────────────────────────────────────────────────────┤
│  ③ STRUCTURE  │ Break down into actionable components      │
├─────────────────────────────────────────────────────────────┤
│  ④ SPRINT     │ Execute in focused bursts                  │
├─────────────────────────────────────────────────────────────┤
│  ⑤ SYNTHESIZE │ Integrate components into whole            │
├─────────────────────────────────────────────────────────────┤
│  ⑥ SHIP       │ Deliver and release                        │
├─────────────────────────────────────────────────────────────┤
│  ⑦ STUDY      │ Reflect and extract learnings              │
└─────────────────────────────────────────────────────────────┘
```

## Phase Details

### Phase 1: SPARK (Day 0)

**Objective**: Capture the initial energy and vision

**Activities**:
- Document the core idea in raw form
- Capture emotional motivation (why this matters NOW)
- Quick brain dump of all related thoughts
- Set initial excitement level (1-10)

**Output**: Spark Document with:
- [ ] Core idea statement (1 sentence)
- [ ] Why now? (timing rationale)
- [ ] Initial scope guess
- [ ] Energy/motivation level

### Phase 2: SCOPE (Days 1-2)

**Objective**: Define clear boundaries and success criteria

**Activities**:
- Define what IS and IS NOT included
- Establish measurable success criteria
- Identify key constraints (time, budget, resources)
- Risk assessment

**Scope Template**:
```markdown
## Project Scope

### In Scope
- [ ] Item 1
- [ ] Item 2

### Out of Scope
- Item A (future consideration)
- Item B (separate project)

### Success Criteria
1. Metric: Target
2. Metric: Target

### Constraints
- Timeline: X weeks
- Budget: $X
- Resources: Team of X
```

### Phase 3: STRUCTURE (Days 3-5)

**Objective**: Break down into manageable pieces

**Activities**:
- Create work breakdown structure (WBS)
- Identify dependencies
- Estimate effort for each component
- Sequence tasks optimally

**Structure Output**:
| Component | Effort | Dependencies | Owner |
|-----------|--------|--------------|-------|
| Task 1 | 2 days | None | Name |
| Task 2 | 3 days | Task 1 | Name |
| Task 3 | 1 day | None | Name |

### Phase 4: SPRINT (Duration varies)

**Objective**: Execute with focused intensity

**Daily Sprint Rhythm**:
```
06:00 - Review today''s targets
07:00 - Deep work block 1 (3 hours)
10:00 - Break + communication check
10:30 - Deep work block 2 (2 hours)
12:30 - Lunch + reset
13:30 - Collaboration/meetings
15:00 - Deep work block 3 (2 hours)
17:00 - Progress documentation
17:30 - Tomorrow prep
```

**Sprint Rules**:
- Maximum 2 active work items at once
- Daily progress commit required
- Blockers escalated within 4 hours
- No scope changes mid-sprint

### Phase 5: SYNTHESIZE (Final 20%)

**Objective**: Integrate all components into coherent whole

**Activities**:
- Combine individual components
- Test integrations
- Polish transitions
- Quality assurance pass

**Integration Checklist**:
- [ ] All components complete
- [ ] Integration tests pass
- [ ] Performance acceptable
- [ ] Documentation updated
- [ ] Edge cases handled

### Phase 6: SHIP (Launch)

**Objective**: Deliver to users/stakeholders

**Pre-Ship Checklist**:
- [ ] Final QA complete
- [ ] Stakeholder preview done
- [ ] Launch communications ready
- [ ] Rollback plan documented
- [ ] Monitoring in place

**Ship Sequence**:
1. Final approval obtained
2. Deploy to production
3. Verify functionality
4. Announce launch
5. Monitor metrics

### Phase 7: STUDY (Post-Launch)

**Objective**: Extract learnings for future projects

**Retrospective Questions**:
1. What went well?
2. What could be improved?
3. What surprised us?
4. What would we do differently?
5. What should we document?

**Learning Documentation**:
| Category | Observation | Action |
|----------|-------------|--------|
| Process | Finding | Change |
| Technical | Finding | Document |
| Team | Finding | Training |
',
updated_at = NOW()
WHERE path = '/codex/council/protocols/7_phase_protocol.md';

-- Swarm Layer Protocol
UPDATE codex_documents
SET content = '# Swarm Layer Protocol

A coordination system for managing multiple parallel initiatives and agents, ensuring coherent progress toward shared objectives.

## Swarm Architecture

```
                    ┌─────────────────┐
                    │   Hive Mind     │
                    │  (Objectives)   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼────┐          ┌────▼────┐          ┌────▼────┐
   │ Swarm A │          │ Swarm B │          │ Swarm C │
   │ Project │          │ Ongoing │          │ Support │
   └────┬────┘          └────┬────┘          └────┬────┘
        │                    │                    │
   ┌────┴────┐          ┌────┴────┐          ┌────┴────┐
   │ Agent 1 │          │ Agent 4 │          │ Agent 7 │
   │ Agent 2 │          │ Agent 5 │          │ Agent 8 │
   │ Agent 3 │          │ Agent 6 │          │ Agent 9 │
   └─────────┘          └─────────┘          └─────────┘
```

## Communication Protocols

### Signal Types

| Signal | Purpose | Priority | Response Time |
|--------|---------|----------|---------------|
| PULSE | Status check | Low | Async |
| BEACON | Attention needed | Medium | <4 hours |
| ALERT | Urgent issue | High | <1 hour |
| SWARM | All hands needed | Critical | Immediate |

### Message Format

```json
{
  "signal": "BEACON",
  "from": "agent_id",
  "to": ["swarm_id", "agent_id"],
  "subject": "Brief description",
  "context": "Detailed information",
  "action_needed": "Specific request",
  "deadline": "2024-01-15T10:00:00Z"
}
```

## Coordination Patterns

### Pattern 1: Parallel Execution
```
Objective ────┬──► Agent A ──┐
              │              │
              ├──► Agent B ──┼──► Merge
              │              │
              └──► Agent C ──┘
```
Use when: Tasks are independent and can run simultaneously

### Pattern 2: Pipeline
```
Agent A ──► Agent B ──► Agent C ──► Output
```
Use when: Each stage depends on previous output

### Pattern 3: Hub and Spoke
```
        Agent B
            │
Agent A ◄── Hub ──► Agent C
            │
        Agent D
```
Use when: Central coordination required

## Status Dashboard

### Swarm Health Metrics

| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| Active agents | >80% | 50-80% | <50% |
| Task completion | >90% | 70-90% | <70% |
| Communication lag | <1hr | 1-4hr | >4hr |
| Blocker count | 0-1 | 2-3 | >3 |

### Daily Swarm Sync

```markdown
## Daily Swarm Sync Template

### Active Swarms
- Swarm A: [Status] - [Progress %]
- Swarm B: [Status] - [Progress %]

### Blockers
1. Blocker description → Owner → ETA

### Cross-Swarm Dependencies
- Swarm A needs X from Swarm B by [date]

### Resource Conflicts
- Agent X allocated to both A and B

### Next 24 Hours
- Priority 1: Description
- Priority 2: Description
```

## Agent Autonomy Levels

| Level | Description | Decision Authority |
|-------|-------------|--------------------|
| 1 | Executor | Follow instructions only |
| 2 | Contributor | Suggest improvements |
| 3 | Autonomous | Independent decisions within scope |
| 4 | Leader | Direct other agents |
| 5 | Architect | Define swarm structure |

## Conflict Resolution

### Priority Matrix
When conflicts arise, use this priority order:
1. Safety & Security
2. Customer Impact
3. Revenue Impact
4. Timeline Impact
5. Resource Efficiency

### Escalation Path
```
Agent Conflict
     │
     ▼
Swarm Leader Mediates
     │
     ▼ (if unresolved)
Cross-Swarm Council
     │
     ▼ (if unresolved)
Chairman Decision
```
',
updated_at = NOW()
WHERE path = '/codex/council/protocols/swarm_layer.md';

-- Transparent Reasoning Protocol
UPDATE codex_documents
SET content = '# Transparent Reasoning Protocol

A framework for making decisions visible, traceable, and learnable. Every significant decision should be documented with its reasoning chain.

## Core Principles

### 1. Show Your Work
Every decision includes the reasoning that led to it. No "black box" decisions.

### 2. Invite Challenge
Documented reasoning invites constructive challenge and improvement.

### 3. Enable Learning
Future decisions benefit from past reasoning chains.

### 4. Build Trust
Transparency builds confidence in the decision-making process.

## Decision Documentation Template

```markdown
# Decision Record: [Title]

**Date**: YYYY-MM-DD
**Decision Maker**: [Name/Role]
**Status**: [Proposed | Accepted | Deprecated | Superseded]

## Context
What is the situation that requires a decision?

## Decision
What is the decision being made?

## Reasoning Chain

### Observations
1. Fact or data point
2. Fact or data point

### Interpretations
1. What these facts suggest
2. Patterns identified

### Options Considered
| Option | Pros | Cons | Risk |
|--------|------|------|------|
| A | Pro1, Pro2 | Con1 | Low |
| B | Pro1 | Con1, Con2 | Medium |
| C | Pro1 | Con1 | High |

### Selection Rationale
Why this option over others?

## Consequences
What follows from this decision?

## Review Trigger
When should this decision be revisited?
```

## Reasoning Chain Visualization

```
OBSERVATION          INTERPRETATION         DECISION
    │                     │                    │
    ▼                     ▼                    ▼
┌─────────┐         ┌─────────┐          ┌─────────┐
│ Data    │────────►│ Pattern │─────────►│ Choice  │
│ Point 1 │         │ A       │          │         │
└─────────┘         └─────────┘          │         │
                                         │         │
┌─────────┐         ┌─────────┐          │         │
│ Data    │────────►│ Pattern │─────────►│  Final  │
│ Point 2 │         │ B       │          │ Decision│
└─────────┘         └─────────┘          │         │
                                         │         │
┌─────────┐         ┌─────────┐          │         │
│ Data    │────────►│ Pattern │─────────►│         │
│ Point 3 │         │ C       │          └─────────┘
└─────────┘         └─────────┘
```

## Decision Types & Documentation Depth

| Decision Type | Documentation Depth | Review Cycle |
|---------------|---------------------|--------------|
| Trivial | None required | N/A |
| Routine | Brief note | Quarterly |
| Significant | Full template | Monthly |
| Strategic | Full + council review | Weekly |
| Irreversible | Full + external review | Before execution |

## Challenge Protocol

When challenging a decision:

### Step 1: Understand First
- Read the full reasoning chain
- Identify the specific point of disagreement
- Prepare alternative interpretation or data

### Step 2: Constructive Challenge
```markdown
## Challenge to: [Decision Title]

**Challenger**: [Name]
**Point of Challenge**: [Specific element]

### Alternative View
What different interpretation or option should be considered?

### Supporting Evidence
What data supports this alternative?

### Proposed Action
- [ ] Reconsider decision
- [ ] Gather more data
- [ ] Add to considerations
- [ ] No change needed
```

### Step 3: Resolution
Document the outcome of the challenge for future reference.

## Quality Checklist

Before finalizing any significant decision:

- [ ] Context is clear to outsiders
- [ ] All considered options documented
- [ ] Pros and cons are balanced (not biased toward chosen option)
- [ ] Risks explicitly stated
- [ ] Reasoning chain is logical and complete
- [ ] Review trigger is defined
- [ ] Stakeholders have been notified
',
updated_at = NOW()
WHERE path = '/codex/council/protocols/transparent_reasoning.md';

-- Territory Ledger
UPDATE codex_documents
SET content = '# Territory Ledger

The official record of territorial governance, resource allocation, and boundary definitions. This ledger tracks the state of all managed domains.

## Domain Registry

### Active Territories

| Domain | Status | Owner | Last Audit |
|--------|--------|-------|------------|
| codex.systems | Active | Core | 2024-01-15 |
| creative.ops | Active | Creative Agent | 2024-01-10 |
| data.pipeline | Active | CDAAO | 2024-01-12 |
| infra.cloud | Active | Systems Architect | 2024-01-14 |

### Resource Allocation

```
┌────────────────────────────────────────────────────────────┐
│                   RESOURCE ALLOCATION                       │
├────────────────────────────────────────────────────────────┤
│ Compute                                                     │
│ ████████████████████░░░░░░░░░░ 65% utilized                │
├────────────────────────────────────────────────────────────┤
│ Storage                                                     │
│ ████████████░░░░░░░░░░░░░░░░░░ 40% utilized                │
├────────────────────────────────────────────────────────────┤
│ API Calls                                                   │
│ ██████████████████████████░░░░ 85% of quota                │
├────────────────────────────────────────────────────────────┤
│ AI Tokens                                                   │
│ ██████████████░░░░░░░░░░░░░░░░ 45% of budget               │
└────────────────────────────────────────────────────────────┘
```

## Boundary Definitions

### Time Boundaries

| Period | Owner | Protected Activities |
|--------|-------|---------------------|
| 06:00-10:00 | Deep Work | No meetings, no notifications |
| 10:00-12:00 | Collaborative | Meetings, discussions |
| 12:00-13:00 | Recovery | Lunch, walk, reset |
| 13:00-15:00 | Creative | Exploratory work |
| 15:00-17:00 | Administrative | Email, planning, docs |
| 17:00+ | Personal | Territory closed |

### Access Control Matrix

| Resource | Read | Write | Admin |
|----------|------|-------|-------|
| Core Systems | All | Council | Chairman |
| Financial Data | Council | CDAAO | Chairman |
| Creative Assets | All | Creative Agent | Architect |
| Infrastructure | Systems | Systems | Chairman |

## Change Log

### Recent Changes

| Date | Change | Approved By |
|------|--------|-------------|
| 2024-01-15 | Added new storage tier | Chairman |
| 2024-01-12 | Updated API rate limits | Systems Architect |
| 2024-01-10 | Expanded creative domain | Creative Agent |

### Pending Changes

| Request | Requestor | Status |
|---------|-----------|--------|
| Increase compute allocation | CDAAO | Under Review |
| New integration domain | Architect | Approved |

## Governance Rules

### Rule 1: Sovereignty
Each territory has clear ownership. No unauthorized modifications.

### Rule 2: Transparency
All changes logged in this ledger.

### Rule 3: Consent
Cross-territory impacts require affected party approval.

### Rule 4: Reversibility
Changes should be reversible for 7 days minimum.

## Audit Schedule

| Territory | Frequency | Next Audit |
|-----------|-----------|------------|
| Core Systems | Monthly | 2024-02-01 |
| Financial | Weekly | 2024-01-22 |
| Creative | Bi-weekly | 2024-01-24 |
| Infrastructure | Monthly | 2024-02-01 |
',
updated_at = NOW()
WHERE path = '/codex/territory/territory_ledger.md';

-- Boot Sequence
UPDATE codex_documents
SET content = '# Boot Sequence

The initialization protocol for starting a new day, project, or system state. This sequence ensures consistent, reliable activation.

## Daily Boot Sequence

### Phase 0: Pre-Boot (Before Rising)
```
□ Natural wake (no alarm if possible)
□ 2-minute body scan
□ Set intention for the day
□ Hydrate (16oz water)
```

### Phase 1: Physical Activation (15 min)
```
┌─────────────────────────────────────┐
│ 1. Light exposure (natural or lamp) │
│ 2. Movement sequence:               │
│    - 10 stretches                   │
│    - 20 air squats                  │
│    - 10 pushups                     │
│ 3. Cold exposure (30s minimum)      │
└─────────────────────────────────────┘
```

### Phase 2: Mental Activation (15 min)
```
┌─────────────────────────────────────┐
│ 1. Review daily objectives (3 max)  │
│ 2. Calendar scan                    │
│ 3. Priority confirmation            │
│ 4. Blocker identification           │
└─────────────────────────────────────┘
```

### Phase 3: System Activation (10 min)
```
┌─────────────────────────────────────┐
│ 1. Open primary workspace           │
│ 2. Load relevant context            │
│ 3. Set focus mode                   │
│ 4. Begin first deep work block      │
└─────────────────────────────────────┘
```

## Project Boot Sequence

### Pre-Flight Checklist
- [ ] Project scope document reviewed
- [ ] Success criteria clear
- [ ] Resources allocated
- [ ] Dependencies mapped
- [ ] Risks identified
- [ ] Communication plan set

### Initialization Steps

```
STEP 1: Context Loading
────────────────────────
├── Read project brief
├── Review related past projects
├── Load relevant reference materials
└── Update mental model

STEP 2: Environment Setup
────────────────────────
├── Create project folder structure
├── Initialize version control
├── Set up task tracking
└── Configure notifications

STEP 3: First Action
────────────────────────
├── Identify smallest useful step
├── Execute immediately
├── Document progress
└── Set next milestone
```

## System Recovery Boot

When systems need restart after disruption:

### Level 1: Soft Reset
```bash
# Mental state only
1. Step away for 10 minutes
2. Physical movement
3. Hydrate
4. Return with fresh perspective
```

### Level 2: Context Reload
```bash
# Lost thread of work
1. Close all applications
2. Review last committed progress
3. Rebuild mental model from notes
4. Resume from last checkpoint
```

### Level 3: Full Reset
```bash
# Complete restart needed
1. End current session
2. Extended break (1+ hour)
3. Return to Phase 1 of daily boot
4. Rebuild from first principles
```

## Boot Diagnostics

### Health Check Indicators

| Check | Healthy | Warning | Critical |
|-------|---------|---------|----------|
| Sleep quality | 7+ hours | 5-7 hours | <5 hours |
| Stress level | Low | Medium | High |
| Energy | High | Medium | Low |
| Focus | Sharp | Wavering | Unable |

### Conditional Boot Modifications

```
IF sleep < 6 hours:
  → Extend Phase 1 by 10 min
  → Reduce daily objectives to 1
  → Schedule recovery nap

IF stress = high:
  → Add 10 min meditation
  → Review boundaries
  → Reduce commitments

IF energy = low:
  → Check nutrition/hydration
  → Add movement breaks
  → Consider full reset
```
',
updated_at = NOW()
WHERE path = '/codex/territory/boot_sequence.md';

-- Version Schema
UPDATE codex_documents
SET content = '# Version Schema

A systematic approach to versioning documents, systems, and personal evolution. Enables tracking changes over time and understanding progression.

## Versioning Philosophy

### Semantic Versioning for Systems
```
MAJOR.MINOR.PATCH

MAJOR: Breaking changes, paradigm shifts
MINOR: New features, significant additions
PATCH: Bug fixes, small improvements
```

### Life Versioning
```
YEAR.QUARTER.ITERATION

Example: 24.Q1.3
- Year 2024
- First Quarter
- Third significant iteration
```

## Version Categories

### Document Versions
| Status | Version Pattern | Example |
|--------|-----------------|---------|
| Draft | 0.x.x | 0.1.0 |
| Review | 0.9.x | 0.9.1 |
| Published | 1.0.0 | 1.0.0 |
| Updated | 1.x.x | 1.2.3 |
| Deprecated | -.-.x | 1.5.0-deprecated |

### System Versions
```
┌─────────────────────────────────────────┐
│ ALPHA    → Internal testing only        │
│ BETA     → Limited external testing     │
│ RC       → Release candidate            │
│ STABLE   → Production ready             │
│ LTS      → Long-term support            │
└─────────────────────────────────────────┘
```

## Change Classification

### Breaking Changes (MAJOR)
- Removes existing functionality
- Changes fundamental behavior
- Requires user action to upgrade
- Incompatible with previous version

### New Features (MINOR)
- Adds new functionality
- Backward compatible
- No user action required
- Enhances capabilities

### Fixes (PATCH)
- Corrects bugs
- Improves performance
- Updates documentation
- No feature changes

## Version Log Template

```markdown
# Version [X.Y.Z] - YYYY-MM-DD

## Added
- New feature description

## Changed
- Modified behavior description

## Deprecated
- Feature marked for removal

## Removed
- Deleted feature description

## Fixed
- Bug fix description

## Security
- Security-related changes
```

## Personal Evolution Tracking

### Skill Version Matrix

| Skill | Current | Target | Progress |
|-------|---------|--------|----------|
| Photography | 2.3.0 | 3.0.0 | 75% |
| Systems Design | 1.8.0 | 2.0.0 | 90% |
| Writing | 1.5.0 | 2.0.0 | 60% |
| Leadership | 1.2.0 | 2.0.0 | 40% |

### Milestone Definitions

```
VERSION 1.0 - Competent
─────────────────────
Can perform independently
Understands fundamentals
Produces acceptable output

VERSION 2.0 - Proficient
─────────────────────
Performs with excellence
Teaches others
Innovates within domain

VERSION 3.0 - Expert
─────────────────────
Industry recognition
Creates new approaches
Shapes the field
```

## Rollback Protocol

When version issues occur:

### Step 1: Identify
- Document the specific issue
- Determine affected version
- Assess impact scope

### Step 2: Decide
- [ ] Hot fix (patch forward)
- [ ] Rollback (revert to previous)
- [ ] Halt (stop and investigate)

### Step 3: Execute
```
ROLLBACK SEQUENCE:
1. Notify stakeholders
2. Create backup of current state
3. Restore previous version
4. Verify functionality
5. Document incident
```
',
updated_at = NOW()
WHERE path = '/codex/territory/version_schema.md';

-- Update Protocol
UPDATE codex_documents
SET content = '# Update Protocol

The systematic process for implementing changes to systems, documents, and processes while maintaining stability and continuity.

## Update Categories

### Critical Updates
- Security vulnerabilities
- System-breaking bugs
- Data integrity issues
- **Timeline**: Immediate

### Standard Updates
- Feature improvements
- Performance optimizations
- Documentation updates
- **Timeline**: Scheduled window

### Planned Updates
- Major version releases
- Architecture changes
- Process overhauls
- **Timeline**: Coordinated release

## Update Workflow

```
┌──────────────┐
│   PROPOSE    │ Document change request
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   REVIEW     │ Technical + impact review
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   APPROVE    │ Stakeholder sign-off
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   STAGE      │ Deploy to staging
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   TEST       │ Verify in staging
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   DEPLOY     │ Production release
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   MONITOR    │ Watch for issues
└──────────────┘
```

## Change Request Template

```markdown
# Change Request: [Title]

**Requestor**: [Name]
**Date**: YYYY-MM-DD
**Priority**: [Critical | High | Medium | Low]

## Summary
Brief description of the proposed change.

## Rationale
Why is this change needed?

## Impact Assessment
- Systems affected: [List]
- Users affected: [Count/Groups]
- Downtime required: [Yes/No - Duration]
- Rollback complexity: [Low | Medium | High]

## Implementation Plan
1. Step one
2. Step two
3. Step three

## Testing Plan
- [ ] Unit tests updated
- [ ] Integration tests pass
- [ ] Staging verification complete
- [ ] Performance benchmarks met

## Rollback Plan
Steps to revert if issues occur.

## Approvals
- [ ] Technical review
- [ ] Security review
- [ ] Stakeholder approval
```

## Update Windows

### Standard Maintenance
| Day | Time | Duration | Type |
|-----|------|----------|------|
| Tuesday | 02:00 UTC | 2 hours | System updates |
| Thursday | 02:00 UTC | 1 hour | Security patches |
| Sunday | 04:00 UTC | 4 hours | Major releases |

### Emergency Updates
- Authorized by: Chairman or designated backup
- Communication: 15-minute advance notice minimum
- Post-update: Incident report within 24 hours

## Pre-Update Checklist

```
BEFORE ANY UPDATE:
□ Backup current state
□ Document current version
□ Notify affected parties
□ Verify rollback procedure
□ Confirm monitoring active
□ Have support on standby
```

## Post-Update Checklist

```
AFTER ANY UPDATE:
□ Verify core functionality
□ Check error logs
□ Confirm metrics normal
□ Update documentation
□ Notify completion
□ Monitor for 24 hours
```

## Communication Templates

### Pre-Update Notice
```
Subject: [Scheduled/Emergency] Update - [System Name]

When: [Date/Time]
Duration: [Expected duration]
Impact: [Description of impact]

What''s changing:
- Change 1
- Change 2

Action required:
[Any user action needed]

Questions? Contact: [Contact info]
```

### Post-Update Notice
```
Subject: Update Complete - [System Name]

The scheduled update has been completed successfully.

Changes deployed:
- Change 1
- Change 2

If you experience issues, please [action].
```
',
updated_at = NOW()
WHERE path = '/codex/territory/update_protocol.md';
