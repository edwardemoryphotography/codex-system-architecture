/*
  # Add Rich Content - Artistic Systems

  Photography Operations and Artful Intelligence sections with comprehensive content.
*/

-- Astro Ops
UPDATE codex_documents
SET content = '# Astrophotography Operations

Comprehensive guide to capturing celestial objects, from planning to post-processing.

## Equipment Setup

### Primary Rig
```
┌─────────────────────────────────────────┐
│           ASTROPHOTOGRAPHY RIG           │
├─────────────────────────────────────────┤
│ Camera: Sony A7R IV (modified)          │
│ Lens: Sigma 14mm f/1.8 DG HSM Art       │
│ Mount: Sky-Watcher Star Adventurer GTi  │
│ Tracker: PHD2 Auto-guiding              │
│ Power: Jackery 500 + DC coupler         │
└─────────────────────────────────────────┘
```

### Deep Sky Kit
| Component | Model | Purpose |
|-----------|-------|---------|
| Telescope | William Optics GT81 | Primary imaging scope |
| Reducer | WO Flat6A III | 0.8x focal reducer |
| Filter | Optolong L-Pro | Light pollution |
| Guider | ZWO ASI120MM Mini | Guide camera |

## Planning Protocol

### Target Selection Matrix

| Season | Primary Targets | Backup Targets |
|--------|-----------------|----------------|
| Winter | Orion Nebula, Pleiades | Rosette, Flame |
| Spring | Leo Triplet, Virgo Cluster | M81/82 |
| Summer | Milky Way Core, Lagoon | Trifid, Eagle |
| Fall | Andromeda, Triangulum | Heart, Soul |

### Weather Requirements
- [ ] Clear Sky Chart: >70% clear
- [ ] Humidity: <80%
- [ ] Wind: <15 mph
- [ ] Seeing: 3/5 or better
- [ ] Moon: <25% illumination (deep sky)

### Location Checklist
- [ ] Bortle class 4 or darker
- [ ] Unobstructed horizon (target direction)
- [ ] Safe parking/access
- [ ] Cell signal (for emergencies)
- [ ] Backup battery charged

## Capture Settings

### Milky Way (Wide Field)
```
Focal Length: 14-24mm
Aperture: f/1.8-2.8
ISO: 3200-6400
Exposure: 500 Rule ÷ focal length
Examples:
  14mm → 35 seconds
  24mm → 20 seconds
```

### Star Trails
```
Method 1: Single Long Exposure
- Aperture: f/4
- ISO: 400
- Exposure: 30+ minutes

Method 2: Stacking (Preferred)
- Aperture: f/2.8
- ISO: 1600
- Exposure: 30 seconds each
- Count: 120+ frames
```

### Deep Sky (Tracked)
```
Nebulae (Emission):
- ISO: 800-1600
- Exposure: 120-300 seconds
- Stack: 20+ frames

Galaxies:
- ISO: 1600
- Exposure: 180-300 seconds
- Stack: 30+ frames
```

## Post-Processing Pipeline

```
RAW Files
    │
    ▼
┌─────────────┐
│ Calibration │ Darks, Flats, Bias
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Stacking   │ DeepSkyStacker / Sequator
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Stretching │ PixInsight / Photoshop
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Details   │ Noise reduction, sharpening
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Color     │ Color calibration, saturation
└──────┬──────┘
       │
       ▼
Final Image
```

## Session Log Template

```markdown
# Astro Session: [Date]

## Conditions
- Location: 
- Bortle: 
- Weather: 
- Moon: 
- Temperature: 

## Equipment
- Camera: 
- Lens/Scope: 
- Mount: 

## Captures
| Target | Frames | Exposure | ISO | Notes |
|--------|--------|----------|-----|-------|
|        |        |          |     |       |

## Lessons Learned
- 

## Follow-up
- [ ] Process images
- [ ] Update target list
```
',
updated_at = NOW()
WHERE path = '/codex/artistic_systems/photography_ops/astro_ops.md';

-- Timelapse Ops
UPDATE codex_documents
SET content = '# Timelapse Operations

Complete guide to planning, capturing, and processing timelapse sequences.

## Equipment Configuration

### Standard Timelapse Kit
```
┌─────────────────────────────────────────┐
│          TIMELAPSE SETUP                 │
├─────────────────────────────────────────┤
│ Camera: Sony A7R IV                      │
│ Intervalometer: Built-in + Backup       │
│ Slider: Rhino Arc II (motorized)        │
│ Head: Syrp Genie Mini II                │
│ Power: NP-FZ100 x4 + USB-C power        │
│ Cards: CFexpress 256GB x2               │
└─────────────────────────────────────────┘
```

### Motion Control
| Device | Movement | Max Duration |
|--------|----------|--------------|
| Genie Mini | Pan/Tilt | 8+ hours |
| Arc II | Linear 2ft | 6+ hours |
| Combined | 3-axis | 4+ hours |

## Interval Calculations

### Formula
```
Final Video Length = (Number of Frames) ÷ (Frame Rate)
Number of Frames = (Real Time Duration) ÷ (Interval)

Example:
- Want: 30 second video at 24fps
- Need: 720 frames
- Shooting 2 hour sunset
- Interval = 7200 seconds ÷ 720 = 10 seconds
```

### Quick Reference

| Subject | Interval | Frames/Hour |
|---------|----------|-------------|
| Clouds (fast) | 2-4s | 900-1800 |
| Clouds (slow) | 5-10s | 360-720 |
| Sunset/Sunrise | 5-8s | 450-720 |
| Stars | 20-30s | 120-180 |
| Milky Way | 25-35s | 100-144 |
| Traffic | 1-2s | 1800-3600 |
| Construction | 5-30min | 2-12/day |

## Holy Grail Technique

Transitioning from day to night seamlessly:

### Method 1: Aperture Priority
```
Settings:
- Mode: Aperture Priority
- Aperture: Fixed (f/4 or wider)
- ISO: Auto (with limits)
- Exposure Comp: Adjust manually

Workflow:
1. Start in daylight settings
2. Camera auto-adjusts shutter
3. Monitor histogram
4. Increase ISO as needed
5. Manually bump exposure comp
```

### Method 2: Bulb Ramping
```
Equipment: qDslrDashboard or LRTimelapse

Workflow:
1. Set initial exposure
2. Use ramping software
3. Software adjusts exposure
4. Deflicker in post
```

### Deflicker Sequence
```
RAW Import
    │
    ▼
LRTimelapse (Holy Grail Wizard)
    │
    ▼
Lightroom (Edit keyframes)
    │
    ▼
LRTimelapse (Render)
    │
    ▼
After Effects (Final render)
```

## Shot Types

### Static
- Use sturdy tripod
- Weight down center column
- Disable image stabilization

### Motion Controlled
```
MOVE TYPES:
├── Linear (slider)
├── Pan (rotation)
├── Tilt (vertical rotation)
└── Combined (2-3 axis)

SPEED:
- Subtle: 0.5° per frame
- Medium: 1-2° per frame
- Dynamic: 3-5° per frame
```

### Hyperlapse
```
1. Plan route with markers
2. Use consistent reference point
3. Shoot 2-3 frames per position
4. Post-stabilize with warp
5. Smooth in After Effects
```

## Post-Processing

### LRTimelapse Workflow
```
1. Import to LRTimelapse
2. Create keyframes
3. Apply Holy Grail (if needed)
4. Edit in Lightroom
5. Auto-transition keyframes
6. Export sequence
7. Render video
```

### Export Settings
| Platform | Resolution | Frame Rate | Codec |
|----------|------------|------------|-------|
| YouTube | 4K | 24-30fps | H.264 |
| Instagram | 1080p | 30fps | H.264 |
| Archive | 4K+ | 24fps | ProRes |

## Project Template

```markdown
# Timelapse Project: [Name]

## Planning
- Location: 
- Date/Time: 
- Duration: 
- Interval: 
- Target frames: 

## Equipment
- Camera: 
- Motion: 
- Power plan: 

## Shot List
| Shot | Start | End | Interval | Frames |
|------|-------|-----|----------|--------|
|      |       |     |          |        |

## Post-Production
- [ ] Import and organize
- [ ] Deflicker
- [ ] Color grade
- [ ] Export sequence
- [ ] Render final video
```
',
updated_at = NOW()
WHERE path = '/codex/artistic_systems/photography_ops/timelapse_ops.md';

-- Landscapes
UPDATE codex_documents
SET content = '# Landscape Photography

Principles and techniques for capturing compelling landscape images.

## Core Philosophy

> "A good landscape photograph is not taken, it is made through patience, preparation, and presence."

## The Planning Triad

```
         CONDITIONS
            ▲
           ╱ ╲
          ╱   ╲
         ╱     ╲
        ╱       ╲
   LOCATION ◄───► TIMING
```

### Location Scouting
- [ ] Research online (500px, Flickr, Google Earth)
- [ ] Visit in person during different conditions
- [ ] Identify primary compositions
- [ ] Find backup compositions
- [ ] Note parking, access, safety concerns

### Timing Considerations
| Time | Light Quality | Best For |
|------|---------------|----------|
| Blue Hour | Cool, soft | Seascapes, cityscapes |
| Golden Hour | Warm, directional | Everything |
| Midday | Harsh, flat | Forests, canyons |
| Overcast | Diffused, even | Waterfalls, forests |
| Storm Light | Dramatic | Mountains, plains |

### Conditions Monitoring
- Weather apps: Windy, Clear Outside
- Sun position: PhotoPills, TPE
- Tide charts: Tides Near Me
- Air quality: IQAir
- Road conditions: DOT sites

## Composition Framework

### Primary Elements
```
┌─────────────────────────────────────────┐
│                SKY                       │
│            (interest zone)               │
├─────────────────────────────────────────┤
│              SUBJECT                     │
│         (primary focus)                  │
├─────────────────────────────────────────┤
│            FOREGROUND                    │
│         (anchor + depth)                 │
└─────────────────────────────────────────┘
```

### Foreground Types
| Type | Effect | Examples |
|------|--------|----------|
| Leading Lines | Draws eye in | Paths, streams, fences |
| Anchor | Grounds image | Rocks, flowers, driftwood |
| Texture | Adds interest | Sand patterns, cracked mud |
| Reflection | Adds depth | Water, ice |

### Composition Techniques
- **Rule of Thirds**: Place horizon/subject on grid lines
- **Leading Lines**: Guide viewer through image
- **Frame within Frame**: Natural frames add depth
- **Negative Space**: Emphasize scale and isolation
- **Layers**: Create depth with foreground/mid/background

## Technical Settings

### Sharpness Priority (Default)
```
Mode: Aperture Priority
Aperture: f/8-f/11 (sweet spot)
ISO: Base (100)
Focus: 1/3 into scene or hyperfocal
```

### Motion Blur (Water/Clouds)
```
Long Exposure:
- ND Filter: 6-10 stop
- Aperture: f/11-f/16
- Shutter: 30s - 4min
- Remote trigger essential
```

### Hyperfocal Distance
| Focal Length | f/8 | f/11 | f/16 |
|--------------|-----|------|------|
| 16mm | 1m | 0.7m | 0.5m |
| 24mm | 2.2m | 1.6m | 1.1m |
| 35mm | 4.8m | 3.4m | 2.4m |
| 50mm | 9.7m | 7m | 4.8m |

## Field Workflow

### Pre-Shoot
1. Check gear (batteries, cards, clean lens)
2. Review weather forecast
3. Plan arrival (1 hour before golden hour)
4. Pack layers/rain gear

### On Location
1. Scout without camera first
2. Find primary composition
3. Set up tripod deliberately
4. Fine-tune composition in viewfinder
5. Check edges for distractions
6. Wait for best light
7. Bracket exposures if needed

### Post-Shoot
1. Review on camera
2. Take phone notes of setup
3. Pack carefully
4. Import same day

## Processing Style Guide

### Natural Processing
```
Goals:
- Match memory of scene
- Enhance, don''t fabricate
- Maintain natural colors
- Preserve shadow/highlight detail
```

### Fine Art Processing
```
Approach:
- Interpret scene emotionally
- Push contrast and color
- Dodge/burn for emphasis
- May composite sky/foreground
```
',
updated_at = NOW()
WHERE path = '/codex/artistic_systems/photography_ops/landscapes.md';

-- Gear Specs
UPDATE codex_documents
SET content = '# Gear Specifications

Complete inventory of photography equipment with specifications and maintenance schedules.

## Camera Bodies

### Sony A7R IV (Primary)
```
┌─────────────────────────────────────────┐
│ SONY A7R IV                              │
├─────────────────────────────────────────┤
│ Sensor: 61MP Full Frame BSI-CMOS        │
│ ISO: 100-32000 (expandable 50-102400)   │
│ AF Points: 567 phase detect             │
│ Burst: 10fps                            │
│ Video: 4K 30p, 1080p 120p               │
│ IBIS: 5.5 stops                         │
│ Battery: NP-FZ100 (~670 shots)          │
│ Weight: 665g body only                  │
└─────────────────────────────────────────┘
```

### Sony A7S III (Video/Astro)
```
┌─────────────────────────────────────────┐
│ SONY A7S III                             │
├─────────────────────────────────────────┤
│ Sensor: 12.1MP Full Frame BSI-CMOS      │
│ ISO: 80-102400 (expandable 40-409600)   │
│ AF Points: 759 phase detect             │
│ Video: 4K 120p, 1080p 240p              │
│ Low Light: Exceptional                   │
│ Battery: NP-FZ100 (~600 shots)          │
│ Weight: 699g body only                  │
└─────────────────────────────────────────┘
```

## Lens Collection

### Wide Angle
| Lens | Aperture | Weight | Use Case |
|------|----------|--------|----------|
| Sony 12-24 f/2.8 GM | f/2.8 | 847g | Astro, Interiors |
| Sigma 14mm f/1.8 | f/1.8 | 1170g | Astro, Landscape |
| Sony 16-35 f/2.8 GM | f/2.8 | 680g | Landscape |

### Standard
| Lens | Aperture | Weight | Use Case |
|------|----------|--------|----------|
| Sony 24-70 f/2.8 GM II | f/2.8 | 695g | General |
| Sony 35mm f/1.4 GM | f/1.4 | 524g | Street, Astro |
| Sony 50mm f/1.2 GM | f/1.2 | 778g | Portraits |

### Telephoto
| Lens | Aperture | Weight | Use Case |
|------|----------|--------|----------|
| Sony 70-200 f/2.8 GM II | f/2.8 | 1045g | Wildlife, Sports |
| Sony 100-400 f/4.5-5.6 GM | f/4.5-5.6 | 1395g | Wildlife |
| Sony 200-600 f/5.6-6.3 | f/5.6-6.3 | 2115g | Birds, Wildlife |

## Support Equipment

### Tripods
| Model | Max Load | Height | Weight | Use |
|-------|----------|--------|--------|-----|
| RRS TVC-34L | 25kg | 157cm | 2.3kg | Primary |
| Peak Design Travel | 9kg | 152cm | 1.3kg | Travel |
| Gitzo Mini | 5kg | 26cm | 0.3kg | Tabletop |

### Heads
| Model | Type | Max Load | Weight |
|-------|------|----------|--------|
| RRS BH-55 | Ball | 23kg | 820g |
| Arca Z1 | Ball | 45kg | 800g |
| Gimbal (Wimberley) | Gimbal | 18kg | 1.4kg |

## Filters

### ND Filters (77mm)
| Density | Stops | Use |
|---------|-------|-----|
| ND8 | 3 | Waterfalls |
| ND64 | 6 | Long exposure |
| ND1000 | 10 | Very long exposure |
| Variable ND | 2-5 | Video |

### Graduated ND
| Type | Density | Use |
|------|---------|-----|
| Hard Edge | 2, 3 stop | Flat horizons |
| Soft Edge | 2, 3 stop | Mountains |
| Reverse | 2, 3 stop | Sunset/sunrise |

### Specialty
| Filter | Use |
|--------|-----|
| Circular Polarizer | Reflections, skies |
| UV | Protection |
| Clear Night | Light pollution |

## Maintenance Schedule

### Weekly
- [ ] Clean sensor (if needed)
- [ ] Clean lens front/rear elements
- [ ] Check all batteries
- [ ] Backup memory cards

### Monthly
- [ ] Deep clean all gear
- [ ] Check firmware updates
- [ ] Test all equipment
- [ ] Update gear inventory

### Annually
- [ ] Professional sensor cleaning
- [ ] Calibrate lenses if needed
- [ ] Review insurance coverage
- [ ] Assess upgrade needs

## Packing Lists

### Day Trip
```
□ Camera body
□ 2-3 lenses (wide, standard, tele)
□ Tripod
□ Filter kit
□ 2x batteries
□ 2x memory cards
□ Lens wipes
□ Rain cover
```

### Multi-Day
```
□ 2 camera bodies
□ Full lens kit
□ Primary + travel tripod
□ Complete filter kit
□ 6x batteries + charger
□ 4x memory cards
□ Laptop + hard drive
□ Cleaning kit
□ Tools
□ Rain gear
```
',
updated_at = NOW()
WHERE path = '/codex/artistic_systems/photography_ops/gear_specs.md';

-- Firefall 2026
UPDATE codex_documents
SET content = '# Firefall 2026 Project

Planning document for capturing the Horsetail Fall "Firefall" phenomenon at Yosemite National Park.

## Phenomenon Overview

Horsetail Fall, on the east side of El Capitan, appears to glow orange/red when illuminated by sunset light during a narrow window in mid-to-late February.

### Requirements for Firefall
```
┌─────────────────────────────────────────┐
│         FIREFALL CONDITIONS              │
├─────────────────────────────────────────┤
│ ✓ Water flowing (requires snowmelt)     │
│ ✓ Clear western sky (no clouds)         │
│ ✓ Correct sun angle (Feb 10-28)         │
│ ✓ Last 10 min before sunset             │
└─────────────────────────────────────────┘
```

## Timeline

### 2025 Preparation
| Month | Action |
|-------|--------|
| October | Book lodging in Yosemite Valley |
| November | Reserve campsite at Upper Pines |
| December | Check snowpack levels |
| January | Monitor weather patterns |

### February 2026
| Date | Activity |
|------|----------|
| Feb 12 | Arrive, scout locations |
| Feb 13-14 | Practice shots, test gear |
| Feb 15-22 | Primary shooting window |
| Feb 23-24 | Backup days |
| Feb 25 | Depart |

## Location Strategy

### Primary Spots (Permit Required)
1. **El Capitan Picnic Area** - Classic straight-on view
2. **Cathedral Beach** - El Cap reflection possibility

### Alternative Spots
1. **Southside Drive Pullouts** - Various angles
2. **El Cap Bridge** - Wider context

### Scouting Checklist
- [ ] Visit all locations during day
- [ ] Note tripod positions
- [ ] Check for obstructions
- [ ] Identify parking
- [ ] Plan arrival timing (3+ hours early)

## Equipment Plan

### Primary Kit
```
Camera: Sony A7R IV
Lenses:
  - Sony 70-200 f/2.8 GM II (primary)
  - Sony 100-400 GM (tight crop)
  - Sony 24-70 f/2.8 GM (context)
Tripod: RRS TVC-34L
Head: RRS BH-55
```

### Support Gear
```
□ Extra batteries (6x)
□ Memory cards (4x 128GB)
□ Remote shutter release
□ Headlamp (red light mode)
□ Hand warmers
□ Comfortable chair/pad
□ Snacks and water
```

## Capture Strategy

### Settings Progression
| Time | Aperture | Shutter | ISO |
|------|----------|---------|-----|
| 30 min before | f/8 | 1/125 | 100 |
| 15 min before | f/5.6 | 1/60 | 200 |
| Peak glow | f/4 | 1/30 | 400 |
| After sunset | f/2.8 | 1/15 | 800 |

### Composition Options
1. **Tight**: Fill frame with fall
2. **Medium**: Fall + El Cap context
3. **Wide**: Environmental with valley
4. **Vertical**: Emphasis on height
5. **Reflection**: Include river reflection

## Contingency Plans

### Weather Issues
- Clouds: Shoot anyway for moody images
- Rain: Waterfall still dramatic
- Wind: May affect water pattern (interesting)

### Crowding Issues
- Arrive 4+ hours early for best spots
- Have backup locations ready
- Consider less popular angles

### Water Flow Issues
- Monitor snowpack and temps
- Check USGS stream gauges
- Have backup project ready

## Success Metrics

### Minimum
- [ ] At least one frame with visible orange glow
- [ ] Sharp, well-exposed capture
- [ ] Publishable image

### Target
- [ ] Multiple compositions
- [ ] Peak glow captured
- [ ] Time-lapse sequence
- [ ] Portfolio-worthy image

### Stretch
- [ ] Unique/creative angle
- [ ] Reflection capture
- [ ] Video documentation
- [ ] Multiple successful evenings
',
updated_at = NOW()
WHERE path = '/codex/artistic_systems/photography_ops/firefall_2026.md';

-- Namibia 2026
UPDATE codex_documents
SET content = '# Namibia 2026 Expedition

Comprehensive planning for a 14-day photography expedition to Namibia focusing on landscapes, wildlife, and astrophotography.

## Expedition Overview

```
Duration: 14 days
Focus: Landscape, Wildlife, Astro
Best Time: May-September (dry season)
Target Date: June 2026
```

## Itinerary

### Phase 1: Sossusvlei (Days 1-4)
```
Day 1: Arrive Windhoek → Drive to Sesriem
Day 2: Sunrise at Dune 45, Dead Vlei
Day 3: Alternative dunes, aerial options
Day 4: Buffer day / move toward coast
```

### Phase 2: Skeleton Coast (Days 5-7)
```
Day 5: Drive to Swakopmund
Day 6: Skeleton Coast shipwrecks
Day 7: Seal colony, coastal landscapes
```

### Phase 3: Damaraland (Days 8-10)
```
Day 8: Drive to Twyfelfontein
Day 9: Desert elephants, Spitzkoppe
Day 10: Rock formations, Milky Way
```

### Phase 4: Etosha (Days 11-14)
```
Day 11: Drive to Etosha
Day 12-13: Wildlife at waterholes
Day 14: Return to Windhoek, depart
```

## Key Subjects

### Landscapes
| Location | Subject | Best Time |
|----------|---------|-----------|
| Sossusvlei | Dune 45 | Sunrise |
| Dead Vlei | Dead trees | Morning |
| Spitzkoppe | Rock formations | Golden hour |
| Skeleton Coast | Shipwrecks | Overcast |

### Wildlife
| Species | Location | Notes |
|---------|----------|-------|
| Desert Elephants | Damaraland | Rare, guides needed |
| Lions | Etosha | Waterholes at dawn |
| Oryx | Throughout | Icon of Namibia |
| Cape Fur Seals | Cape Cross | Colony of 100k+ |

### Astrophotography
| Subject | Location | Moon Phase |
|---------|----------|------------|
| Milky Way | Sossusvlei | New moon |
| Star trails | Spitzkoppe | Any |
| Quiver trees | Near Sesriem | New moon |

## Equipment List

### Camera Gear
```
Bodies:
□ Sony A7R IV (primary)
□ Sony A7S III (astro/video)

Lenses:
□ 14mm f/1.8 (astro)
□ 16-35mm f/2.8 (landscape)
□ 24-70mm f/2.8 (general)
□ 100-400mm (wildlife)
□ 200-600mm (birds)

Support:
□ Primary tripod
□ Travel tripod
□ Gimbal head
```

### Protection
```
□ Camera rain covers
□ Lens dust covers
□ Sensor cleaning kit
□ Silica gel packets
□ Padded cases
```

## Logistics

### Transportation
- 4x4 vehicle required
- 2x spare tires
- Emergency supplies
- Extra fuel cans

### Accommodation
| Location | Type | Booked |
|----------|------|--------|
| Sesriem | Lodge | [ ] |
| Swakopmund | Hotel | [ ] |
| Twyfelfontein | Camp | [ ] |
| Etosha | Rest camp | [ ] |

### Budget Estimate
| Category | Estimate |
|----------|----------|
| Flights | $2,000 |
| Vehicle rental | $1,500 |
| Accommodation | $2,500 |
| Food/fuel | $800 |
| Park fees | $400 |
| Guides | $600 |
| Buffer | $500 |
| **Total** | **$8,300** |

## Safety Considerations

### Wildlife
- Never exit vehicle in Etosha
- Maintain safe distance
- Travel with guides in Damaraland

### Environment
- Extreme temperature variation
- Limited water sources
- Remote areas with no cell service

### Health
- Malaria prophylaxis (Etosha)
- First aid kit
- Travel insurance required

## Shot List

### Must-Have
- [ ] Dune 45 at sunrise
- [ ] Dead Vlei trees
- [ ] Oryx silhouette
- [ ] Milky Way over dunes
- [ ] Skeleton shipwreck
- [ ] Desert elephants

### Nice-to-Have
- [ ] Lions at waterhole
- [ ] Aerial dunes
- [ ] Night waterhole (infrared)
- [ ] Spitzkoppe star trails
- [ ] Coastal fog
',
updated_at = NOW()
WHERE path = '/codex/artistic_systems/photography_ops/namibia_2026.md';
