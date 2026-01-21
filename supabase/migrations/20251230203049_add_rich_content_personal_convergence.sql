/*
  # Add Rich Content - Personal OS & Convergence

  Personal operating system and convergence/integration documentation.
*/

-- Personality Manual
UPDATE codex_documents
SET content = '# Personality Manual

A comprehensive guide to understanding and optimizing personal operating patterns, preferences, and tendencies.

## Core Profile

### Type Indicators
```
┌─────────────────────────────────────────────────────────────┐
│                    PERSONALITY PROFILE                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  MBTI: INTJ-A (Architect)                                   │
│  ────────────────────────                                   │
│  Introverted (85%)  │  Intuitive (72%)                     │
│  Thinking (68%)     │  Judging (79%)                       │
│  Assertive (65%)                                            │
│                                                              │
│  Enneagram: 5w4 (Investigator)                             │
│  ─────────────────────────────                             │
│  Core: Knowledge & Competence                               │
│  Wing: Individualism & Creativity                           │
│                                                              │
│  StrengthsFinder Top 5:                                     │
│  ────────────────────────                                   │
│  1. Strategic  │  2. Learner  │  3. Ideation              │
│  4. Input      │  5. Focus                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Operating Modes

### Deep Work Mode
```
ACTIVATION CONDITIONS:
• Energy level > 70%
• Uninterrupted time block (3+ hours)
• Clear primary objective
• Optimal environment

CHARACTERISTICS:
• Single-task focus
• Time blindness (set alarms)
• High output quality
• Flow state likely

SUPPORT NEEDS:
• Do not disturb enabled
• Snacks/water accessible
• Temperature controlled
• Background audio (if any)
```

### Creative Mode
```
ACTIVATION CONDITIONS:
• Mental freshness
• Low external pressure
• Inspiration trigger present
• Permission to explore

CHARACTERISTICS:
• Associative thinking
• Rapid ideation
• Less linear process
• Sensitivity to interruption

SUPPORT NEEDS:
• Visual inspiration accessible
• Capture tools ready
• Freedom from deadlines
• Movement allowed
```

### Recovery Mode
```
ACTIVATION CONDITIONS:
• Energy depleted
• After high-intensity work
• Social battery drained
• Stress indicators elevated

CHARACTERISTICS:
• Low cognitive load tolerance
• Preference for solitude
• Sensory sensitivity
• Need for routine

SUPPORT NEEDS:
• Minimal decisions required
• Familiar environments
• Solo activities
• Nature exposure
```

## Energy Management

### Energy Patterns
```
           DAILY ENERGY CURVE
    
High │           ╭──────╮
     │         ╱        ╲
     │       ╱            ╲
     │     ╱                ╲       ╭──╮
     │   ╱                    ╲   ╱    ╲
Low  │_╱________________________╲╱______╲___
     6    9    12    15    18    21    24
     
PEAK: 9-12 (Use for deep work)
DIP: 14-16 (Use for admin, meetings)
SECOND WIND: 20-22 (Creative exploration)
```

### Energy Drains
| Activity | Drain Rate | Recovery Time |
|----------|------------|---------------|
| Social events | High | 24-48 hours |
| Conflict | Very High | 48+ hours |
| Context switching | Medium | 30-60 min |
| Meetings | Medium | 30 min each |
| Decision fatigue | Cumulative | Sleep reset |

### Energy Gains
| Activity | Gain Rate | Duration |
|----------|-----------|----------|
| Solo nature time | High | 60+ min |
| Learning new skills | Medium | Ongoing |
| Creative flow | High | While in flow |
| Quality sleep | Very High | 7-8 hours |
| Exercise | Medium | 30+ min |

## Communication Preferences

### Interaction Guide
| Context | Preferred | Acceptable | Avoid |
|---------|-----------|------------|-------|
| Updates | Async text | Email | Calls |
| Brainstorming | Doc comments | 1:1 call | Group call |
| Urgent | Direct message | Call | Drop-by |
| Feedback | Written first | Video call | Public |
| Planning | Async doc | Meeting | Ad hoc |

### Response Patterns
```
Message Type        Expected Response Time
────────────        ──────────────────────
Urgent/Labeled      < 2 hours
Direct question     < 24 hours
FYI/No action       48 hours or none
Meeting request     < 24 hours
Project update      Weekly batch
```

## Decision Making

### Decision Framework
```
               ┌─────────────────┐
               │  Is it urgent?  │
               └────────┬────────┘
                       │
           ┌───────────┴───────────┐
          Yes                      No
           │                       │
           ▼                       ▼
    ┌─────────────┐         ┌─────────────┐
    │ Reversible? │         │   Sleep on  │
    └──────┬──────┘         │     it      │
           │                └─────────────┘
    ┌──────┴──────┐
   Yes           No
    │             │
    ▼             ▼
 Decide        Research
 Quickly       Thoroughly
```

### Common Pitfalls
- Over-researching reversible decisions
- Under-consulting on irreversible decisions
- Analysis paralysis on medium-stakes choices
- Dismissing emotional/intuitive signals

## Boundaries

### Non-Negotiables
1. **Morning routine**: No meetings before 10 AM
2. **Focus blocks**: Minimum 3 hours uninterrupted
3. **Recovery days**: One full day per week
4. **Sleep**: 7+ hours non-negotiable
5. **Nature**: Outdoor time weekly minimum

### Flexible Boundaries
- Evening work (if energy allows)
- Weekend projects (if intrinsically motivated)
- Social commitments (1-2 per week max)
- Travel (if recovery time built in)
',
updated_at = NOW()
WHERE path = '/codex/personal_os/personality_manual.md';

-- Neurodivergent OS
UPDATE codex_documents
SET content = '# Neurodivergent Operating System

Strategies and systems optimized for neurodivergent thinking patterns, including ADHD management, hyperfocus leveraging, and executive function support.

## Understanding the Wiring

### Strengths to Leverage
```
┌─────────────────────────────────────────────────────────────┐
│                 NEURODIVERGENT STRENGTHS                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  HYPERFOCUS                                                  │
│  └── Deep, sustained attention on interesting tasks         │
│                                                              │
│  PATTERN RECOGNITION                                        │
│  └── Seeing connections others miss                         │
│                                                              │
│  CREATIVE PROBLEM SOLVING                                   │
│  └── Non-linear, innovative approaches                      │
│                                                              │
│  CRISIS PERFORMANCE                                         │
│  └── Thriving under pressure/deadlines                      │
│                                                              │
│  RAPID LEARNING                                             │
│  └── Quick absorption of interesting material               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Challenges to Manage
| Challenge | Impact | Management Strategy |
|-----------|--------|---------------------|
| Task initiation | Delayed starts | Reduce friction, use triggers |
| Sustained attention | Wandering focus | Body doubling, Pomodoro |
| Working memory | Forgotten tasks | External systems |
| Time blindness | Missed deadlines | Visual timers, alarms |
| Emotional regulation | Mood swings | Recognition + protocols |

## Executive Function Support

### Task Initiation Protocol
```
STUCK ON STARTING?

Step 1: Make it tiny
└── "Just open the document"
└── "Just write one sentence"
└── "Just 5 minutes"

Step 2: Add novelty
└── New location
└── Different music
└── New tool/approach

Step 3: Add accountability
└── Body doubling
└── Public commitment
└── External deadline

Step 4: Add stakes
└── If/then rewards
└── Artificial urgency
└── Gamification
```

### Working Memory Offload
```
CAPTURE EVERYTHING EXTERNAL

Inbox System:
┌─────────────────────────────────────┐
│  Physical: Notebook always present  │
│  Digital: Quick capture app         │
│  Voice: Voice memos for ideas       │
│  Visual: Screenshot + annotate      │
└─────────────────────────────────────┘

Processing: Daily sweep into system
Storage: Task manager / Notes app
Review: Weekly review ritual
```

## Focus Management

### Hyperfocus Harvesting
```
HYPERFOCUS TRIGGER CHECKLIST

Prerequisites:
□ Interesting/novel task
□ Clear next action
□ Uninterrupted time available
□ Optimal environment set

Activation:
□ Remove all distractions
□ Set end-time alarm (!)
□ Begin with tiny action
□ Don''t break the flow

Capture (when done):
□ Document progress
□ Note next steps
□ Schedule follow-up
□ Take recovery break
```

### Focus Modes
| Mode | Duration | Use For | Recovery |
|------|----------|---------|----------|
| Sprint | 25 min | Boring tasks | 5 min |
| Flow | 90 min | Creative work | 20 min |
| Hyperfocus | 3+ hours | High-interest | 60+ min |

## Time Management

### Time Blindness Countermeasures
```
VISUAL TIME TOOLS

1. Time Timer (visual countdown)
2. Calendar blocking (see time as space)
3. Regular check-in alarms
4. Buffer time between everything

ESTIMATION FORMULA:
Initial estimate × 2 + 30 min = Realistic time

DEADLINE PROTOCOL:
Real deadline - 2 days = Your deadline
```

### Day Structure
```
FLEXIBLE STRUCTURE (Not rigid schedule)

Morning Block (Peak hours)
├── Most important task
├── Creative/deep work
└── High-focus required

Midday Block (Variable)
├── Meetings clustered
├── Communication batch
└── Administrative tasks

Evening Block (Second wind)
├── Learning/exploration
├── Low-stakes creative
└── Planning tomorrow
```

## Emotional Regulation

### State Recognition
```
CURRENT STATE CHECK

Energy:  ░░░░░░░░░░  Low ──────► High
Focus:   ░░░░░░░░░░  Scattered ─► Sharp
Mood:    ░░░░░░░░░░  Low ──────► Positive
Stress:  ░░░░░░░░░░  Calm ─────► Overwhelmed

If multiple in red zone: STOP → Recovery protocol
```

### Regulation Toolkit
| State | Quick Reset | Longer Reset |
|-------|-------------|--------------|
| Overwhelmed | 5 min outside | Nature walk |
| Frustrated | Physical movement | Workout |
| Scattered | Cold water face | Meditation |
| Low energy | Bright light + movement | Nap |
| Anxious | Box breathing | Journaling |

## Environmental Design

### Workspace Setup
```
OPTIMAL ENVIRONMENT

Physical:
□ Standing desk option
□ Fidget tools available
□ Good lighting (bright)
□ Minimal visual clutter
□ Movement space nearby

Digital:
□ Distraction blockers installed
□ Notifications off
□ Second monitor for reference
□ Focus playlist ready

Sensory:
□ Temperature controlled
□ Background audio option
□ Comfortable seating
□ Natural light if possible
```

### Context Switching Costs
```
SWITCHING TAX

Task A ──► Task B = 23 min recovery

MINIMIZE BY:
• Batching similar tasks
• Completing before switching
• Using "parking lot" for intrusions
• Scheduling switch points
```

## Support Systems

### Accountability Structures
1. **Body doubling**: Virtual coworking sessions
2. **Daily standups**: Brief commitment checks
3. **Weekly reviews**: With accountability partner
4. **Deadlines**: External > Internal

### Tools Stack
| Function | Tool | Why |
|----------|------|-----|
| Capture | Quick Note | Fastest possible |
| Tasks | Things 3 | Visual + flexible |
| Calendar | Cal.com | Time blocking |
| Focus | Freedom | Blocks distractions |
| Timers | Time Timer | Visual countdown |
',
updated_at = NOW()
WHERE path = '/codex/personal_os/neurodivergent_os.md';

-- Reflections Between Worlds
UPDATE codex_documents
SET content = '# Reflections Between Worlds

A contemplative space for processing transitions, integrating experiences, and maintaining perspective during times of change.

## The Nature of Transitions

```
         BETWEEN WORLDS

    Past Self          Future Self
        ╲                 ╱
         ╲               ╱
          ╲             ╱
           ╲           ╱
            ╲         ╱
             ╲       ╱
              ╲     ╱
               ╲   ╱
                ╲ ╱
                 ●
            Present
           (The Gap)
```

## Transition Types

### Life Transitions
| Transition | Challenge | Opportunity |
|------------|-----------|-------------|
| Career shift | Identity uncertainty | Reinvention |
| Location change | Lost familiarity | Fresh perspective |
| Relationship change | Grief/adjustment | Growth |
| Health change | Adaptation | Prioritization |
| Success | Expectations | Expansion |
| Failure | Disappointment | Learning |

### Project Transitions
| Phase | State | Need |
|-------|-------|------|
| Starting | Excitement + uncertainty | Structure |
| Middle | Doubt + fatigue | Persistence |
| Ending | Relief + loss | Closure |
| Between | Emptiness + possibility | Integration |

## Integration Practices

### Daily Reflection
```markdown
## Evening Reflection Template

### Three Good Things
1. 
2. 
3. 

### One Challenge
- What happened:
- What I learned:

### Tomorrow''s Intention
- 

### Gratitude
- 
```

### Weekly Review
```markdown
## Weekly Integration

### Energy Audit
This week I felt most alive when:

This week drained me most when:

### Progress Check
What moved forward:

What stalled:

### Pattern Notice
Recurring theme this week:

### Adjustment
One thing to change next week:
```

### Monthly Reflection
```markdown
## Monthly Contemplation

### The Bigger Picture
What is life teaching me right now?

### Values Alignment
Where am I aligned?
Where am I misaligned?

### Relationships
Who energized me?
Who depleted me?
Who do I want more time with?

### Creative Expression
What did I create this month?
What wants to be created?

### Letting Go
What am I holding that no longer serves?
```

## Processing Change

### The Change Curve
```
                    ╭─────────────────────╮
                   ╱                       ╲  Integration
                  ╱                         ╲
Shock ─────────────►  Resistance              ╲
                              ╲                ╲
                               ╲                ╲
                                Exploration ────► New Normal
                               ╱
                              ╱
                             ╱
                    Acceptance
```

### Questions for Each Stage
| Stage | Questions |
|-------|-----------|
| Shock | What just happened? What do I need right now? |
| Resistance | What am I afraid to lose? What am I protecting? |
| Acceptance | What is actually true? What can I control? |
| Exploration | What possibilities exist? What could I try? |
| Integration | What did I learn? How am I different? |

## Holding Space

### For Uncertainty
```
When certainty dissolves:

1. Acknowledge the discomfort
   "This is uncomfortable and that''s okay"

2. Find the ground
   What is still true?
   What do I still know?

3. Embrace the not-knowing
   Certainty is often illusion
   Uncertainty is often opportunity

4. Take the next small step
   You don''t need the whole map
   Just the next foothold
```

### For Grief
```
When something ends:

Allow the feeling
Don''t rush through it
Honor what was
Create ritual for closure
Look for the gift
(There always is one, eventually)
```

### For Excitement
```
When something begins:

Stay grounded in the present
Don''t attach to outcomes
Enjoy the energy
Channel it into action
Remember: excitement fades
But commitment endures
```

## Wisdom Collected

### From Past Transitions
> "Every ending I feared became a beginning I cherished."

> "The gap between who I was and who I''m becoming is where growth lives."

> "Resistance to change is just fear in costume."

> "What feels like falling apart is often falling into place."

### Principles for Navigation
1. **Go slow to go fast**: Rushing through transitions leads to incomplete processing
2. **Feel the feelings**: Suppressed emotions resurface later, usually worse
3. **Trust the process**: The path reveals itself through walking
4. **Maintain anchors**: Keep some constants while everything changes
5. **Document the journey**: Future you will want to remember

## Sacred Pauses

### When to Stop and Reflect
- After completing major projects
- Before making big decisions
- When feeling disconnected
- At natural time boundaries (seasons, birthdays)
- When patterns are repeating
- When intuition is nudging
',
updated_at = NOW()
WHERE path = '/codex/personal_os/reflections_between_worlds.md';

-- Convergence Log v16
UPDATE codex_documents
SET content = '# Convergence Log v16

Documentation of system integration progress, cross-domain connections, and emergent patterns across all codex systems.

## Integration Status

### System Connectivity Matrix
```
                Root  Council  Territory  Artistic  Neuro  Auto  Business  Personal
Root             ■      ●         ●          ○        ○      ○       ○         ●
Council          ●      ■         ●          ●        ○      ●       ●         ●
Territory        ●      ●         ■          ○        ○      ●       ○         ○
Artistic         ○      ●         ○          ■        ●      ●       ●         ○
Neuro            ○      ○         ○          ●        ■      ●       ○         ●
Auto             ○      ●         ●          ●        ●      ■       ●         ○
Business         ○      ●         ○          ●        ○      ●       ■         ○
Personal         ●      ●         ○          ○        ●      ○       ○         ■

Legend: ■ = Self  ● = Strong  ○ = Weak/Planned
```

## Version 16 Changes

### New Integrations
| Connection | Status | Impact |
|------------|--------|--------|
| Neuro → Artistic | Complete | Biometric-informed creative timing |
| Auto → Business | Complete | Automated order fulfillment |
| Personal → Neuro | In Progress | Recovery-adjusted scheduling |

### Removed/Deprecated
- Legacy calendar integration (replaced by unified scheduling)
- Manual export workflows (automated)

## Cross-System Workflows

### Morning Activation Sequence
```
06:00 ─► Whoop Recovery Data
            │
            ▼
         Recovery Score
            │
      ┌─────┴─────┐
      │           │
   High         Low
      │           │
      ▼           ▼
  Full Boot    Light Boot
  Sequence     Sequence
      │           │
      ▼           ▼
  Deep Work    Recovery
  Scheduled    Priority
```

### Creative Session Optimization
```
Session Request
      │
      ▼
┌─────────────┐     ┌─────────────┐
│ Check Neuro │────►│ Check       │
│ State       │     │ Calendar    │
└─────────────┘     └─────────────┘
      │                   │
      └─────────┬─────────┘
                │
                ▼
         Schedule Optimal
         Creative Block
                │
                ▼
         Environment Preset
         Activated
                │
                ▼
         Begin Session
```

## Emergent Patterns

### Pattern 1: Recovery-Productivity Correlation
```
Analysis Period: 90 days
Sample Size: 63 deep work sessions

Recovery Score vs Output Quality:

High (>80%)    ████████████████████ 94% excellent
Medium (50-80) ████████████████     78% excellent  
Low (<50%)     ████████             43% excellent

INSIGHT: Schedule highest-value creative work on high-recovery days
ACTION: Implement recovery-based task assignment
```

### Pattern 2: Location-Focus Mapping
```
Location Analysis:

Home Office:    Focus ████████░░ 8.2/10  Sessions: 145
Coffee Shop:    Focus ██████░░░░ 6.1/10  Sessions: 28
Outdoor:        Focus ███████░░░ 7.4/10  Sessions: 12
Travel:         Focus ████░░░░░░ 4.2/10  Sessions: 8

INSIGHT: Home office significantly outperforms alternatives
ACTION: Invest in home office optimization over coworking
```

### Pattern 3: Creative-Business Tension
```
Revenue vs Creative Satisfaction (Monthly)

Jan: Revenue ████████ $14K  Satisfaction ██████ 6/10
Feb: Revenue ██████   $11K  Satisfaction ████████ 8/10
Mar: Revenue ██████████ $18K Satisfaction ████ 4/10

CORRELATION: -0.67 (inverse relationship)

INSIGHT: High revenue months sacrifice creative satisfaction
ACTION: Establish minimum creative time regardless of business demands
```

## System Health

### Current Status
```
┌─────────────────────────────────────────────────────┐
│  CODEX SYSTEM HEALTH                    v16.2.1    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Core Systems                                       │
│  ├── Identity Framework      █████████░ Healthy    │
│  ├── Territory Mode          ████████░░ Good       │
│  └── Reality Filter          ███████░░░ Needs Work │
│                                                      │
│  Operational Systems                                │
│  ├── Council Protocols       █████████░ Healthy    │
│  ├── Automation Pipelines    ████████░░ Good       │
│  └── Neuro Integration       ██████░░░░ Building   │
│                                                      │
│  Business Systems                                   │
│  ├── Revenue Tracking        █████████░ Healthy    │
│  ├── Edition Management      ████████░░ Good       │
│  └── Workshop Engine         ███████░░░ Needs Work │
│                                                      │
│  Last Full Review: 2024-01-15                       │
│  Next Scheduled: 2024-02-15                         │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Roadmap

### Q1 Priorities
1. Complete Neuro → Personal integration
2. Automate weekly review process
3. Build prediction model for creative windows

### Q2 Priorities
1. External API for system access
2. Mobile dashboard
3. Voice interface for quick capture

### Long-term Vision
```
CONVERGENCE ENDSTATE

All systems talking to each other
Proactive recommendations
Automated optimization
Human in the loop for decisions
Data-informed but intuition-honoring
```

## Changelog

### v16.2.1 (Current)
- Added Bio Geometry Engine integration
- Fixed Whoop sync reliability
- Updated decision framework

### v16.2.0
- New Edition Manager system
- Improved automation pipelines
- Added RAG photography system

### v16.1.0
- Multi-agent orchestration
- Enhanced reliability playbook
- Workshop engines documented
',
updated_at = NOW()
WHERE path = '/codex/convergence/convergence_log_v16.md';

-- System Reflexivity
UPDATE codex_documents
SET content = '# System Reflexivity

The practice of systems observing, evaluating, and improving themselves. A meta-framework for continuous evolution.

## The Reflexive Loop

```
┌─────────────────────────────────────────────────────────────┐
│                   REFLEXIVITY CYCLE                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│              ┌─────────────────────┐                        │
│              │      OBSERVE        │                        │
│              │  (What is happening)│                        │
│              └──────────┬──────────┘                        │
│                         │                                    │
│                         ▼                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   ADJUST    │◄─┤   REFLECT   ├─►│   DESIGN    │         │
│  │(Change sys) │  │ (Why/What)  │  │ (New pattern│         │
│  └──────┬──────┘  └─────────────┘  └──────┬──────┘         │
│         │                                  │                 │
│         │         ┌─────────────┐         │                 │
│         └────────►│   EXECUTE   │◄────────┘                 │
│                   │ (Try change)│                           │
│                   └──────┬──────┘                           │
│                          │                                   │
│                          ▼                                   │
│                     Back to OBSERVE                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Observation Practices

### Data Collection
| Domain | Metrics | Frequency |
|--------|---------|-----------|
| Productivity | Tasks completed, deep work hours | Daily |
| Energy | Recovery score, sleep quality | Daily |
| Creative | Projects shipped, satisfaction | Weekly |
| Financial | Revenue, expenses, runway | Weekly |
| Relationships | Connection quality | Monthly |
| Growth | Skills developed, learning | Quarterly |

### Pattern Recognition
```
WHAT TO LOOK FOR:

Recurring Problems
└── Same issue appearing repeatedly
└── Similar failures in different contexts
└── Persistent friction points

Unexpected Successes
└── What worked better than expected?
└── What happened differently?
└── What can be replicated?

Correlations
└── What tends to happen together?
└── What predicts what?
└── Hidden connections
```

## Reflection Framework

### The Five Whys
```
Problem: [State the problem]
Why 1: 
Why 2: 
Why 3: 
Why 4: 
Why 5: [Root cause usually here]
```

### After Action Review
```
AFTER ACTION REVIEW

1. What was supposed to happen?
   
2. What actually happened?
   
3. Why was there a difference?
   
4. What will we do differently?
```

### Assumption Audit
```
ASSUMPTION CHECK

Assumption being tested:
"[State assumption]"

Evidence supporting:
- 

Evidence contradicting:
- 

Verdict:
□ Confirmed  □ Refined  □ Rejected

New understanding:
"[Updated belief]"
```

## System Evolution

### Change Categories
| Type | Scope | Example |
|------|-------|---------|
| Tweak | Single parameter | Adjust wake time by 30 min |
| Tune | Single system | Revise morning routine |
| Transform | Multiple systems | Restructure work week |
| Transcend | Paradigm shift | New operating philosophy |

### Change Protocol
```
BEFORE CHANGING:

1. Document current state
   (Can''t measure improvement without baseline)

2. Define success criteria
   (How will you know it worked?)

3. Set evaluation period
   (Give changes time to show effects)

4. Plan rollback
   (How to undo if needed)

DURING CHANGE:

5. Implement cleanly
   (One variable at a time)

6. Track rigorously
   (Daily notes minimum)

AFTER CHANGE:

7. Evaluate honestly
   (Did it actually work?)

8. Document learnings
   (For future reference)
```

## Meta-Awareness

### Watching the Watcher
```
Questions for meta-reflection:

On Observation:
- Am I seeing what''s actually there or what I expect?
- What might I be missing?
- Are my metrics measuring what matters?

On Reflection:
- Am I being honest with myself?
- What am I avoiding looking at?
- Am I rationalizing or reasoning?

On Change:
- Am I changing for good reasons?
- Is this a real improvement or just novelty?
- Am I changing too much or too little?
```

### Bias Recognition
```
REFLEXIVITY BIASES TO WATCH

Confirmation Bias
└── Only seeing what confirms current view

Recency Bias
└── Overweighting recent events

Optimization Bias
└── Changing things that don''t need changing

Complexity Bias
└── Preferring complex solutions over simple ones

Novelty Bias
└── Attracted to new over effective
```

## Documentation Practice

### System Changelog
```markdown
## Change Log Entry

Date: YYYY-MM-DD
System: [Which system]
Type: Tweak | Tune | Transform | Transcend

### Before
[Describe previous state]

### Change
[Describe what changed]

### Rationale
[Why this change]

### Outcome
[Results after evaluation period]

### Lessons
[What was learned]
```

### Wisdom Capture
```markdown
## Insight Capture

Date: YYYY-MM-DD
Domain: [Life area]

### Observation
[What was noticed]

### Interpretation
[What it might mean]

### Application
[How to use this]

### Confidence
Low | Medium | High

### Review Date
[When to revisit]
```

## The Meta Question

> "Is this system of self-improvement itself improving me, or just keeping me busy feeling like I''m improving?"

Regular check: Is all this reflection and optimization actually leading to a better life, or has it become its own hamster wheel?

The goal is not perfect systems.
The goal is a life well-lived.
Systems serve life, not the other way around.
',
updated_at = NOW()
WHERE path = '/codex/convergence/system_reflexivity.md';

-- 6 Figure Print Engine
UPDATE codex_documents
SET content = '# 6 Figure Print Engine

A systematic approach to building a six-figure annual revenue stream from fine art print sales.

## Revenue Architecture

### Target Breakdown
```
ANNUAL TARGET: $100,000

Monthly Average: $8,333
Weekly Average: $1,923

Revenue Mix:
├── Limited Editions (60%): $60,000
│   └── 40 editions × $1,500 avg
├── Open Editions (25%): $25,000
│   └── 125 prints × $200 avg
├── Collector Sales (10%): $10,000
│   └── 4 major sales × $2,500 avg
└── Licensing (5%): $5,000
    └── 5 licenses × $1,000 avg
```

## The Print Flywheel

```
┌─────────────────────────────────────────────────────────────┐
│                    PRINT FLYWHEEL                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│           CREATE                                             │
│         Great Images                                         │
│              │                                               │
│              ▼                                               │
│    BUILD ◄────────► AUDIENCE                                 │
│              │                                               │
│              ▼                                               │
│           ENGAGE                                             │
│        Community                                             │
│              │                                               │
│              ▼                                               │
│           RELEASE                                            │
│         Limited Drops                                        │
│              │                                               │
│              ▼                                               │
│            SELL                                              │
│         Scarcity                                             │
│              │                                               │
│              ▼                                               │
│         REINVEST                                             │
│      in Better Work ──────────► Back to CREATE              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Pricing Framework

### Edition Pricing
```
PRICE CALCULATION

Base Rate: $50/print inch on longest side
Scarcity Multiplier: 1 + (100 - Edition Size)/100
Size Multiplier: 1 + (Size Category × 0.5)

Example: 24" print, Edition of 50
Base: 24 × $50 = $1,200
Scarcity: 1 + (100-50)/100 = 1.5
Price: $1,200 × 1.5 = $1,800
```

### Size Tiers
| Size | Category | Base | With Margin |
|------|----------|------|-------------|
| 12×18 | Small | $300 | $200-400 |
| 16×24 | Medium | $600 | $400-800 |
| 24×36 | Large | $1,200 | $800-1,600 |
| 40×60 | XL | $2,400 | $1,600-3,200 |
| Custom | Premium | Quote | $3,000+ |

## Product Stack

### Three Tiers
```
TIER 1: ENTRY ($150-400)
─────────────────────────
• Open edition prints
• Smaller sizes (12×18)
• Simple framing options
• Digital delivery included
• Target: Volume sales

TIER 2: COLLECTOR ($500-2,000)
─────────────────────────────
• Limited editions (25-100)
• Medium sizes (16×24, 24×36)
• Premium framing available
• Certificate of authenticity
• Target: Core revenue

TIER 3: PATRON ($2,500+)
───────────────────────
• Ultra-limited (5-10)
• Large/custom sizes
• Museum framing
• Personal delivery option
• Exclusive access
• Target: Margin + relationships
```

## Sales Funnel

### Journey Map
```
AWARENESS → INTEREST → DESIRE → ACTION → LOYALTY

Awareness:
├── Instagram discovery
├── SEO / Blog posts
├── Word of mouth
└── Exhibitions

Interest:
├── Website gallery
├── Behind-the-scenes
├── Story content
└── Email capture

Desire:
├── Limited edition tease
├── Countdown urgency
├── Social proof
└── Exclusive access

Action:
├── Clear pricing
├── Easy checkout
├── Payment plans
└── Fast shipping

Loyalty:
├── Packaging experience
├── Thank you follow-up
├── Collector community
└── Early access to drops
```

## Operations

### Print Partners
| Partner | Use Case | Lead Time | Quality |
|---------|----------|-----------|---------|
| WHCC | Standard orders | 5-7 days | Excellent |
| Bay Photo | Premium/Large | 7-10 days | Superior |
| Local Lab | Rush orders | 2-3 days | Good |

### Quality Control
```
PRE-SHIP CHECKLIST

□ Print quality inspection
  ├── Color accuracy
  ├── Detail sharpness
  ├── No artifacts/damage
  └── Proper paper/finish

□ Certificate prepared
  ├── Edition number
  ├── Signature
  └── QR verification

□ Packaging materials
  ├── Acid-free tissue
  ├── Rigid mailer/tube
  ├── Fragile labels
  └── Thank you card

□ Shipping
  ├── Insurance added
  ├── Tracking number
  └── Customer notified
```

## Marketing Calendar

### Annual Rhythm
| Quarter | Focus | Major Release |
|---------|-------|---------------|
| Q1 | New work from winter | March drop |
| Q2 | Workshop promo | Portfolio expansion |
| Q3 | Travel work | September drop |
| Q4 | Holiday sales | Gift editions |

### Release Schedule
```
MONTHLY RHYTHM

Week 1: Tease upcoming work
Week 2: Behind-the-scenes
Week 3: Full reveal + pre-orders
Week 4: Launch + sales push

Annual: 6-8 major releases
Ongoing: Open editions available
```

## Metrics Dashboard

```
┌─────────────────────────────────────────────────────┐
│  PRINT ENGINE METRICS                   YTD 2024   │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Revenue Target: $100,000                           │
│  Current: ████████████░░░░░░░ $62,400 (62%)        │
│                                                      │
│  Prints Sold: 89                                    │
│  Average Order: $701                                │
│  Conversion Rate: 3.2%                              │
│                                                      │
│  Top Sellers:                                       │
│  1. Mountain Dawn (28 sold)                         │
│  2. Ocean Sunset (19 sold)                          │
│  3. Desert Stars (15 sold)                          │
│                                                      │
│  Revenue by Tier:                                   │
│  Entry: $12,400 (20%)                               │
│  Collector: $42,000 (67%)                           │
│  Patron: $8,000 (13%)                               │
│                                                      │
└─────────────────────────────────────────────────────┘
```
',
updated_at = NOW()
WHERE path = '/codex/artistic_systems/artful_intelligence/6_figure_print_engine.md';

-- Creative Automations
UPDATE codex_documents
SET content = '# Creative Automations

Automated workflows that support the creative process without replacing human artistry.

## Automation Philosophy

> "Automate the mechanical, protect the magical."

The goal is to remove friction from the creative process, not to automate creativity itself.

## Automation Categories

### Pre-Creative (Setup)
- Environment preparation
- Tool readiness
- Context loading
- Distraction blocking

### Post-Creative (Processing)
- File organization
- Backup procedures
- Metadata application
- Export workflows

### Support (Ongoing)
- Inspiration capture
- Reference organization
- Progress tracking
- Communication handling

## Workflow Automations

### Photo Import
```
TRIGGER: Memory card connected

ACTIONS:
1. Create dated folder
2. Copy RAW files
3. Extract metadata
4. Rename files (Date_Time_Camera_Seq)
5. Generate previews
6. Add to Lightroom catalog
7. Backup to cloud
8. Backup to NAS
9. Notify completion

ESTIMATED TIME SAVED: 30 min/session
```

### Social Media Prep
```
TRIGGER: Photo exported to Social folder

ACTIONS:
1. Resize for platform specs
   ├── Instagram: 1080×1350
   ├── Twitter: 1200×675
   └── Facebook: 1200×630
2. Apply platform-specific sharpening
3. Add watermark (optional)
4. Generate initial caption draft
5. Schedule optimal posting time
6. Queue to scheduler

ESTIMATED TIME SAVED: 20 min/post
```

### Client Delivery
```
TRIGGER: Gallery marked "Ready"

ACTIONS:
1. Generate web-optimized versions
2. Create download gallery
3. Apply password protection
4. Generate share link
5. Send client email
6. Set reminder for feedback
7. Log in CRM

ESTIMATED TIME SAVED: 45 min/delivery
```

## Tool Integrations

### Stack Connections
```
┌─────────────────────────────────────────────────────────────┐
│                  AUTOMATION STACK                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Capture Layer                                              │
│  ├── Lightroom → Hazel → File organization                 │
│  ├── Camera → Import Script → Cataloging                   │
│  └── Phone → iCloud → Inspiration folder                   │
│                                                              │
│  Processing Layer                                           │
│  ├── Lightroom → Export → Social Folder                    │
│  ├── Photoshop → Actions → Batch processing                │
│  └── Scripts → Metadata → Backup                           │
│                                                              │
│  Distribution Layer                                         │
│  ├── n8n → Multi-platform posting                          │
│  ├── Zapier → CRM updates                                  │
│  └── Make → Client notifications                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Trigger Types
| Trigger | Tool | Use Case |
|---------|------|----------|
| File created | Hazel | Organization |
| Schedule | cron | Backups |
| Webhook | n8n | External events |
| Manual | Keyboard shortcut | On-demand |
| Email | Zapier | Client requests |

## Preset Library

### Lightroom Presets
| Preset | Use | One-click apply |
|--------|-----|-----------------|
| Import Standard | Initial adjustments | Yes |
| Landscape Base | Outdoor scenes | Yes |
| Portrait Soft | People | Yes |
| Astro Foundation | Night sky | Yes |
| B&W Dramatic | Monochrome | Yes |

### Export Presets
| Name | Format | Size | Use |
|------|--------|------|-----|
| Web Gallery | JPEG 85% | 2048px | Online display |
| Social Square | JPEG 90% | 1080px | Instagram |
| Print Full | TIFF | Original | Lab printing |
| Archive | DNG | Original | Backup |

## Time Savings

### Monthly Impact
```
AUTOMATION ROI

Task                    Manual    Auto    Savings
──────────────────────────────────────────────────
Photo import (8x)       4h        0.5h    3.5h
Social prep (20x)       7h        1h      6h
Client delivery (4x)    3h        0.3h    2.7h
Backup procedures       2h        0h      2h
Metadata management     3h        0.5h    2.5h
──────────────────────────────────────────────────
TOTAL                   19h       2.3h    16.7h/mo

Annual time recovered: 200+ hours
```

## Maintenance

### Weekly
- [ ] Review automation logs for errors
- [ ] Update any changed credentials
- [ ] Test one random workflow

### Monthly
- [ ] Audit automation usage
- [ ] Identify new automation opportunities
- [ ] Update documentation

### Quarterly
- [ ] Full automation review
- [ ] Deprecate unused workflows
- [ ] Optimize slow automations
',
updated_at = NOW()
WHERE path = '/codex/artistic_systems/artful_intelligence/creative_automations.md';

-- PWA iPhone16
UPDATE codex_documents
SET content = '# PWA iPhone 16

Progressive Web App optimized for iPhone 16 Pro as a mobile creative companion and field reference tool.

## App Overview

### Purpose
A pocket-sized extension of the Codex system for field use:
- Quick reference during shoots
- Settings calculators
- Location notes
- Gear checklists
- Inspiration capture

## Core Features

### 1. Quick Reference
```
┌────────────────────────────────┐
│  EXPOSURE CALCULATOR           │
├────────────────────────────────┤
│                                │
│  Current Settings:             │
│  f/2.8  |  1/125  |  ISO 400  │
│                                │
│  Want to change:               │
│  [Aperture ▼]  to  [f/8 ▼]    │
│                                │
│  New Settings:                 │
│  f/8  |  1/15  |  ISO 400     │
│  or                            │
│  f/8  |  1/125 |  ISO 3200    │
│                                │
│  [Apply to Camera]             │
│                                │
└────────────────────────────────┘
```

### 2. Location Scout
```
┌────────────────────────────────┐
│  LOCATION: Tunnel View         │
├────────────────────────────────┤
│                                │
│  [Map Preview]                 │
│                                │
│  Coords: 37.7156°N, 119.6769°W│
│  Elevation: 5,160 ft           │
│                                │
│  Today:                        │
│  Sunrise: 6:42 AM (Optimal ★)  │
│  Sunset: 5:18 PM               │
│  Golden Hour: 4:38-5:18 PM    │
│                                │
│  Best Conditions:              │
│  ☀️ Clear for Valley views     │
│  🌫️ Fog for mood shots         │
│                                │
│  My Notes:                     │
│  "Parking fills by 5AM for    │
│   sunrise. Bring layers."     │
│                                │
│  [Navigate] [Add Note] [Share]│
│                                │
└────────────────────────────────┘
```

### 3. Gear Checklist
```
┌────────────────────────────────┐
│  PACKING: Landscape Day Trip   │
├────────────────────────────────┤
│                                │
│  Camera & Lenses               │
│  ☑️ Sony A7R IV                │
│  ☑️ 16-35mm f/2.8              │
│  ☐ 24-70mm f/2.8               │
│  ☐ 70-200mm f/2.8              │
│                                │
│  Support                       │
│  ☑️ Tripod                     │
│  ☑️ L-bracket                  │
│  ☐ Filters (ND, CPL)           │
│                                │
│  Power                         │
│  ☑️ Batteries (4x)             │
│  ☐ Battery charger             │
│                                │
│  Progress: 5/11                │
│  ████████████░░░░░░░░ 45%     │
│                                │
│  [Mark All] [Save as Template] │
│                                │
└────────────────────────────────┘
```

### 4. Field Notes
```
┌────────────────────────────────┐
│  NEW FIELD NOTE                │
├────────────────────────────────┤
│                                │
│  [📷 Add Photo]                │
│                                │
│  Location: [Auto-detect]       │
│  Weather: [Auto-fetch]         │
│  Time: 6:45 AM                 │
│                                │
│  Notes:                        │
│  ┌──────────────────────────┐ │
│  │Light coming through gap  │ │
│  │in clouds, creating god   │ │
│  │rays on the valley floor. │ │
│  │Return when fog is lower. │ │
│  └──────────────────────────┘ │
│                                │
│  Tags: [sunrise] [fog] [rays] │
│                                │
│  [Save] [Save + Remind Later] │
│                                │
└────────────────────────────────┘
```

## Technical Implementation

### PWA Manifest
```json
{
  "name": "Codex Field",
  "short_name": "Codex",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Offline Capability
```typescript
// Service Worker caching strategy
const CACHE_NAME = ''codex-field-v1'';
const OFFLINE_ASSETS = [
  ''/'',
  ''/calculators'',
  ''/checklists'',
  ''/reference'',
  ''/styles.css'',
  ''/app.js''
];

// Cache first, network fallback
// for reference content

// Network first, cache fallback
// for location and weather data
```

### iPhone 16 Optimizations
- Dynamic Island integration for timers
- Action Button quick launch
- Always-On Display for checklists
- ProMotion 120Hz smooth scrolling
- Haptic feedback on interactions

## Data Sync

### Sync Strategy
```
┌─────────────────────────────────────────────────────────────┐
│                    SYNC ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Mobile App ◄─────────────► Supabase ◄─────────────► Desktop│
│                                                              │
│  Offline:                                                   │
│  - Locations cached                                         │
│  - Checklists stored locally                               │
│  - Notes queued for sync                                   │
│                                                              │
│  Online:                                                    │
│  - Real-time sync                                          │
│  - Background upload of photos                             │
│  - Push notifications                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Usage Scenarios

### Pre-Shoot
1. Check weather and sun position
2. Review location notes
3. Run through gear checklist
4. Download offline maps

### During Shoot
1. Reference exposure settings
2. Capture field notes
3. Log interesting spots
4. Timer for long exposures

### Post-Shoot
1. Review captured notes
2. Rate locations
3. Sync to desktop
4. Plan return visits
',
updated_at = NOW()
WHERE path = '/codex/artistic_systems/artful_intelligence/pwa_iphone16.md';
