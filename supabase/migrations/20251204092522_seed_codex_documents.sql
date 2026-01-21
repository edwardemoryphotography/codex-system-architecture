/*
  # Seed Codex Documents

  1. Insert all codex documents and establish hierarchy
  2. Documents are organized by category and sub-sections
  3. Parent-child relationships create the tree structure
  
  Structure:
  - /codex (root)
    - /codex/root (identity, territory, reality_filter)
    - /codex/council (roles, protocols)
    - /codex/territory (ledger, boot_sequence, etc)
    - /codex/artistic_systems (photography_ops, artful_intelligence)
    - /codex/neuro (eeg, websockets, ml, whoop, bio_geometry)
    - /codex/automation (orchestration, reliability, rag, pipelines)
    - /codex/business (drop_model, workshops, money_os)
    - /codex/personal_os (personality, neurodivergent, reflections)
    - /codex/convergence (logs, reflexivity)
*/

DO $$
DECLARE
  codex_id uuid;
  root_id uuid;
  council_id uuid;
  council_roles_id uuid;
  council_protocols_id uuid;
  territory_id uuid;
  artistic_systems_id uuid;
  photography_ops_id uuid;
  artful_intelligence_id uuid;
  neuro_id uuid;
  automation_id uuid;
  business_id uuid;
  personal_os_id uuid;
  convergence_id uuid;
BEGIN
  -- Root codex folder
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Codex', '/codex', 'Knowledge and operational systems', 'root', NULL, 0)
  RETURNING id INTO codex_id;

  -- Root section
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Root', '/codex/root', 'Core identity and territorial concepts', 'root', codex_id, 0)
  RETURNING id INTO root_id;

  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Identity', '/codex/root/identity.md', 'Personal identity framework and definition', 'root', root_id, 0);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Territory Mode', '/codex/root/territory_mode.md', 'Operating model and territorial principles', 'root', root_id, 1);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Reality Filter', '/codex/root/reality_filter.md', 'Perception and reality filtering system', 'root', root_id, 2);

  -- Council section
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Council', '/codex/council', 'Organizational structure and protocols', 'council', codex_id, 1)
  RETURNING id INTO council_id;

  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Roles', '/codex/council/roles', 'Council member roles and responsibilities', 'council', council_id, 0)
  RETURNING id INTO council_roles_id;

  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Architect', '/codex/council/roles/architect.md', 'Architecture role definition', 'council', council_roles_id, 0);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Systems Architect', '/codex/council/roles/systems_architect.md', 'Systems architecture role', 'council', council_roles_id, 1);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('UX Specialist', '/codex/council/roles/ux_specialist.md', 'UX and user experience role', 'council', council_roles_id, 2);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('CDAAO', '/codex/council/roles/cdaao.md', 'Chief Data and AI Architecture Officer', 'council', council_roles_id, 3);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Creative Agent', '/codex/council/roles/creative_agent.md', 'Creative and artistic role', 'council', council_roles_id, 4);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Chairman', '/codex/council/roles/chairman.md', 'Leadership and oversight role', 'council', council_roles_id, 5);

  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Protocols', '/codex/council/protocols', 'Operational protocols and procedures', 'council', council_id, 1)
  RETURNING id INTO council_protocols_id;

  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('7 Phase Protocol', '/codex/council/protocols/7_phase_protocol.md', 'Seven phase operational protocol', 'council', council_protocols_id, 0);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Swarm Layer', '/codex/council/protocols/swarm_layer.md', 'Swarm coordination and communication', 'council', council_protocols_id, 1);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Transparent Reasoning', '/codex/council/protocols/transparent_reasoning.md', 'Transparent decision making framework', 'council', council_protocols_id, 2);

  -- Territory section
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Territory', '/codex/territory', 'Territory management and governance', 'territory', codex_id, 2)
  RETURNING id INTO territory_id;

  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Territory Ledger', '/codex/territory/territory_ledger.md', 'Record of territorial governance', 'territory', territory_id, 0);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Boot Sequence', '/codex/territory/boot_sequence.md', 'System initialization sequence', 'territory', territory_id, 1);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Version Schema', '/codex/territory/version_schema.md', 'Version control and schema management', 'territory', territory_id, 2);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Update Protocol', '/codex/territory/update_protocol.md', 'Update and upgrade procedures', 'territory', territory_id, 3);

  -- Artistic Systems section
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Artistic Systems', '/codex/artistic_systems', 'Creative and artistic operations', 'artistic_systems', codex_id, 3)
  RETURNING id INTO artistic_systems_id;

  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Photography Ops', '/codex/artistic_systems/photography_ops', 'Photography operations and projects', 'artistic_systems', artistic_systems_id, 0)
  RETURNING id INTO photography_ops_id;

  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Astro Ops', '/codex/artistic_systems/photography_ops/astro_ops.md', 'Astrophotography operations', 'artistic_systems', photography_ops_id, 0);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Timelapse Ops', '/codex/artistic_systems/photography_ops/timelapse_ops.md', 'Timelapse photography operations', 'artistic_systems', photography_ops_id, 1);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Landscapes', '/codex/artistic_systems/photography_ops/landscapes.md', 'Landscape photography', 'artistic_systems', photography_ops_id, 2);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Gear Specs', '/codex/artistic_systems/photography_ops/gear_specs.md', 'Photography equipment specifications', 'artistic_systems', photography_ops_id, 3);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Firefall 2026', '/codex/artistic_systems/photography_ops/firefall_2026.md', 'Firefall project 2026', 'artistic_systems', photography_ops_id, 4);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Namibia 2026', '/codex/artistic_systems/photography_ops/namibia_2026.md', 'Namibia expedition 2026', 'artistic_systems', photography_ops_id, 5);

  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Artful Intelligence', '/codex/artistic_systems/artful_intelligence', 'AI-powered creative systems', 'artistic_systems', artistic_systems_id, 1)
  RETURNING id INTO artful_intelligence_id;

  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('AI Overview', '/codex/artistic_systems/artful_intelligence/ai_overview.md', 'Overview of AI creative systems', 'artistic_systems', artful_intelligence_id, 0);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Photo Coach MVP', '/codex/artistic_systems/artful_intelligence/photo_coach_mvp.md', 'AI photo coaching MVP', 'artistic_systems', artful_intelligence_id, 1);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Edition Manager', '/codex/artistic_systems/artful_intelligence/edition_manager.md', 'Edition management system', 'artistic_systems', artful_intelligence_id, 2);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('6 Figure Print Engine', '/codex/artistic_systems/artful_intelligence/6_figure_print_engine.md', 'Print monetization engine', 'artistic_systems', artful_intelligence_id, 3);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Creative Automations', '/codex/artistic_systems/artful_intelligence/creative_automations.md', 'Creative automation workflows', 'artistic_systems', artful_intelligence_id, 4);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('PWA iPhone16', '/codex/artistic_systems/artful_intelligence/pwa_iphone16.md', 'Progressive web app for iPhone 16', 'artistic_systems', artful_intelligence_id, 5);

  -- Neuro section
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Neuro', '/codex/neuro', 'Neurotechnology and biometric systems', 'neuro', codex_id, 4)
  RETURNING id INTO neuro_id;

  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Muse2 EEG Pipeline', '/codex/neuro/muse2_eeg_pipeline.md', 'Muse 2 EEG data pipeline', 'neuro', neuro_id, 0);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('WebSocket Servers', '/codex/neuro/websocket_servers.md', 'Real-time WebSocket communication', 'neuro', neuro_id, 1);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Adaptive ML Models', '/codex/neuro/adaptive_ml_models.md', 'Machine learning models for adaptation', 'neuro', neuro_id, 2);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Whoop Integration', '/codex/neuro/whoop_integration.md', 'Whoop fitness tracking integration', 'neuro', neuro_id, 3);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Bio Geometry Engine', '/codex/neuro/bio_geometry_engine.md', 'Biometric geometry and spatial analysis', 'neuro', neuro_id, 4);

  -- Automation section
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Automation', '/codex/automation', 'Automation and orchestration systems', 'automation', codex_id, 5)
  RETURNING id INTO automation_id;

  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Multi-Agent Orchestration', '/codex/automation/multi_agent_orchestration.md', 'Multi-agent system coordination', 'automation', automation_id, 0);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Reliability Playbook', '/codex/automation/reliability_playbook.md', 'System reliability and resilience', 'automation', automation_id, 1);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('RAG Photography', '/codex/automation/rag_photography.md', 'Retrieval-augmented generation for photography', 'automation', automation_id, 2);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Automation Pipelines', '/codex/automation/automation_pipelines.md', 'Data and workflow pipelines', 'automation', automation_id, 3);

  -- Business section
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Business', '/codex/business', 'Business models and operations', 'business', codex_id, 6)
  RETURNING id INTO business_id;

  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Drop Model', '/codex/business/drop_model.md', 'Limited edition drop business model', 'business', business_id, 0);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Workshop Engines', '/codex/business/workshop_engines.md', 'Workshop and training operations', 'business', business_id, 1);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Money OS', '/codex/business/money_os.md', 'Financial operations system', 'business', business_id, 2);

  -- Personal OS section
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Personal OS', '/codex/personal_os', 'Personal operating system and mindset', 'personal_os', codex_id, 7)
  RETURNING id INTO personal_os_id;

  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Personality Manual', '/codex/personal_os/personality_manual.md', 'Personal operating manual', 'personal_os', personal_os_id, 0);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Neurodivergent OS', '/codex/personal_os/neurodivergent_os.md', 'Neurodivergent optimization framework', 'personal_os', personal_os_id, 1);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Reflections Between Worlds', '/codex/personal_os/reflections_between_worlds.md', 'Reflections and transitions', 'personal_os', personal_os_id, 2);

  -- Convergence section
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Convergence', '/codex/convergence', 'System integration and reflexivity', 'convergence', codex_id, 8)
  RETURNING id INTO convergence_id;

  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('Convergence Log v16', '/codex/convergence/convergence_log_v16.md', 'Integration log version 16', 'convergence', convergence_id, 0);
  
  INSERT INTO codex_documents (title, path, content, category, parent_id, "order")
  VALUES ('System Reflexivity', '/codex/convergence/system_reflexivity.md', 'Self-aware system design', 'convergence', convergence_id, 1);

END $$;
