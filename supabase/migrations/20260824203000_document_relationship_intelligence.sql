-- Make cross-domain Codex relationships first-class live data.
-- Canonical relationships also remain embedded in the application so the
-- public graph keeps its intelligence during database outages.

create table if not exists public.document_links (
  id uuid primary key default gen_random_uuid(),
  source_document_id uuid not null references public.codex_documents(id) on delete cascade,
  target_document_id uuid not null references public.codex_documents(id) on delete cascade,
  link_type text not null default 'related'
    check (link_type in ('related', 'bridges')),
  rationale text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (source_document_id <> target_document_id)
);

-- Older local migration history created this table without rationales, with a
-- `reference` default, and with anonymous inserts. Upgrade that shape in place
-- as well as supporting projects where the table has never existed.
alter table public.document_links
  add column if not exists rationale text,
  add column if not exists updated_at timestamptz not null default now();

update public.document_links
set
  link_type = case when link_type in ('related', 'bridges') then link_type else 'related' end,
  rationale = coalesce(
    nullif(rationale, ''),
    'Legacy relationship retained; rationale requires review.'
  );

alter table public.document_links
  alter column link_type set default 'related',
  alter column rationale set not null;

alter table public.document_links
  drop constraint if exists document_links_link_type_check;

alter table public.document_links
  add constraint document_links_link_type_check
  check (link_type in ('related', 'bridges'));

create unique index if not exists document_links_source_target_key
  on public.document_links (source_document_id, target_document_id);

create index if not exists document_links_source_idx
  on public.document_links (source_document_id);

create index if not exists document_links_target_idx
  on public.document_links (target_document_id);

alter table public.document_links enable row level security;

drop policy if exists "Public can insert document_links"
  on public.document_links;

drop policy if exists "Public can read document_links"
  on public.document_links;

drop policy if exists "Public can read reviewed document relationships"
  on public.document_links;

create policy "Public can read reviewed document relationships"
  on public.document_links
  for select
  to anon, authenticated
  using (true);

with relationship_seed(source_path, target_path, link_type, rationale) as (
  values
    ('/codex/root/identity.md', '/codex/personal_os/personality_manual.md', 'bridges', 'Confirmed identity informs collaboration, while the manual translates it into practical interaction.'),
    ('/codex/root/territory_mode.md', '/codex/territory/territory_ledger.md', 'bridges', 'The attention model becomes operational only when an active outcome is recorded and resumable.'),
    ('/codex/root/reality_filter.md', '/codex/convergence/convergence_log_v16.md', 'bridges', 'Current integration claims must be classified by evidence and freshness.'),
    ('/codex/root/reality_filter.md', '/codex/council/roles/cdaao.md', 'bridges', 'Truth classification becomes the integrity lens used for AI, data, and status outputs.'),
    ('/codex/council/roles/architect.md', '/codex/automation/multi_agent_orchestration.md', 'bridges', 'Product ownership must constrain where orchestrated work is routed.'),
    ('/codex/council/roles/systems_architect.md', '/codex/territory/version_schema.md', 'bridges', 'System boundaries become reconstructable through explicit version and ownership references.'),
    ('/codex/council/roles/ux_specialist.md', '/codex/personal_os/neurodivergent_os.md', 'bridges', 'Access needs translate into concrete interaction and workflow requirements.'),
    ('/codex/council/roles/creative_agent.md', '/codex/artistic_systems/artful_intelligence/ai_overview.md', 'bridges', 'Creative authorship constrains what AI products should generate or claim.'),
    ('/codex/council/roles/cdaao.md', '/codex/neuro/adaptive_ml_models.md', 'bridges', 'Adaptive models require the strongest provenance, privacy, and evaluation boundaries.'),
    ('/codex/council/protocols/swarm_layer.md', '/codex/automation/multi_agent_orchestration.md', 'bridges', 'The coordination doctrine defines ownership and evidence for multi-agent execution.'),
    ('/codex/council/protocols/7_phase_protocol.md', '/codex/territory/boot_sequence.md', 'bridges', 'The first protocol phase is implemented by the repository and evidence boot sequence.'),
    ('/codex/council/protocols/transparent_reasoning.md', '/codex/convergence/system_reflexivity.md', 'bridges', 'Challengeable decision records make system self-correction possible.'),
    ('/codex/territory/update_protocol.md', '/codex/automation/reliability_playbook.md', 'bridges', 'Repeated updates and failures should become durable automated safeguards.'),
    ('/codex/artistic_systems/photography_ops/astro_ops.md', '/codex/neuro/muse2_eeg_pipeline.md', 'related', 'Field capture and biosignal capture share timing, artifact, environment, and reproducibility constraints.'),
    ('/codex/artistic_systems/photography_ops/timelapse_ops.md', '/codex/automation/automation_pipelines.md', 'related', 'Both require ordered source preservation, deterministic processing, and recoverable long-running execution.'),
    ('/codex/artistic_systems/artful_intelligence/photo_coach_mvp.md', '/codex/automation/rag_photography.md', 'bridges', 'Grounded retrieval can make coaching specific while exposing its photographic sources.'),
    ('/codex/artistic_systems/artful_intelligence/edition_manager.md', '/codex/business/drop_model.md', 'bridges', 'Edition integrity is the operational foundation for a trustworthy limited release.'),
    ('/codex/artistic_systems/artful_intelligence/6_figure_print_engine.md', '/codex/business/money_os.md', 'bridges', 'Offer strategy needs private financial constraints without publishing private figures.'),
    ('/codex/artistic_systems/artful_intelligence/creative_automations.md', '/codex/automation/automation_pipelines.md', 'bridges', 'Creative automation relies on safe, observable, replayable asset pipelines.'),
    ('/codex/artistic_systems/artful_intelligence/pwa_iphone16.md', '/codex/personal_os/neurodivergent_os.md', 'related', 'Mobile-first design and accessible work design both reduce avoidable cognitive transitions.'),
    ('/codex/neuro/whoop_integration.md', '/codex/personal_os/neurodivergent_os.md', 'bridges', 'Biometric context may inform support only when consent, interpretation, and non-clinical limits are explicit.'),
    ('/codex/neuro/websocket_servers.md', '/codex/automation/automation_pipelines.md', 'related', 'Real-time transport is an input layer whose retry and schema behavior shapes downstream reliability.'),
    ('/codex/neuro/bio_geometry_engine.md', '/codex/artistic_systems/photography_ops/landscapes.md', 'related', 'Both explore how measured or observed structure can become a visual experience without losing meaning.'),
    ('/codex/business/workshop_engines.md', '/codex/artistic_systems/photography_ops', 'bridges', 'A credible workshop is grounded in real field practice and a teachable capture-to-finish workflow.'),
    ('/codex/personal_os/reflections_between_worlds.md', '/codex/convergence/system_reflexivity.md', 'bridges', 'A repeated personal insight becomes system learning only after it is translated into a durable, challengeable rule.'),
    ('/codex/convergence/convergence_log_v16.md', '/codex/territory/update_protocol.md', 'related', 'The convergence ledger is only current when update and supersession rules are consistently applied.')
), resolved as (
  select
    source.id as source_document_id,
    target.id as target_document_id,
    seed.link_type,
    seed.rationale
  from relationship_seed seed
  join public.codex_documents source on source.path = seed.source_path
  join public.codex_documents target on target.path = seed.target_path
)
insert into public.document_links (
  source_document_id,
  target_document_id,
  link_type,
  rationale
)
select source_document_id, target_document_id, link_type, rationale
from resolved
on conflict (source_document_id, target_document_id)
do update set
  link_type = excluded.link_type,
  rationale = excluded.rationale,
  updated_at = now();

comment on table public.document_links is
  'Reviewed semantic relationships between Codex documents. Rationale explains why each connection changes understanding or execution.';
