# PROJECT SPEC: Private Schools Sales CRM (Morocco)

## 1. Goal

CRM for a small team (3-5 salespeople to start) selling to ALL PRIVATE
EDUCATIONAL INSTITUTIONS IN MOROCCO: crèches, schools, higher education
(supérieur), and professional training. "School" below includes all these
institutions. Salespeople find schools on a map, claim leads from a shared
pool, call them, rate them independently, take notes, schedule follow-ups,
and contact them by email and WhatsApp. Use simple call outcomes and
priority-based views; do not build an additional sales-stage pipeline.
Built on Atomic CRM (marmelab/atomic-crm), customized.
Must look modern and polished, and work on phones and computers.
Main contacts at schools: director, founder, or person in charge.

Confirmed owner decisions supersede older conflicting requirements.

### 1a. Filters and collaboration

- Combine institution types, city, lead ownership, average stars, and priority.
  Multiple selected types use OR; separate filter dimensions use AND.
  An institution may cover multiple types. Keep the imported raw category.
- Ownership filters: unassigned, mine, assigned, and selected salesperson.
  Remember filters separately for each authenticated user, across sessions.
- New leads start unassigned (`companies.sales_id = NULL`) in a public pool
  visible only to authenticated CRM staff, never to anonymous visitors.
- Salespeople freely claim unassigned leads and release their own leads.
  Only the owner/admin may release or transfer an assigned lead; an admin
  may reassign any lead. Preserve the complete assignment history.
- Claim/release/transfer must be atomic database operations with permission
  checks. Two simultaneous claims must yield one winner and a clear French
  conflict message for the other user. Direct API updates cannot bypass this.
- Everyone can view schools and add their own notes/call logs to any lead,
  including leads owned by another salesperson.
- Each salesperson independently rates each school with 1-5 integer stars.
  Show all individual ratings, the average, and the number of ratings.
  A salesperson can edit only their own rating; assignment changes do not
  remove or transfer ratings or historical activity.
- Priority is computed from the unrounded average, never manually staged:
  HP (Haute priorité) >= 4; MP (Priorité moyenne) >= 2.5 and < 4;
  LP (Basse priorité) < 2.5. No ratings = "Non évalué".
  These are initial defaults; admins can change validated thresholds.
- Dashboard and in-app reminders show due and overdue follow-ups. Email
  reminders are optional later and need separate approval.

## 1b. Product we sell (CONFIGURABLE, NOT HARD-CODED)

- The product description is NOT known yet. Never hard-code it.
- Build an admin-only page "Paramètres > Mon produit" with:
    - product_name (text)
    - product_description (long text)
    - ai_prompt_school_info (long text, French default provided)
    - ai_prompt_email (long text, French default provided)
    - ai_prompt_whatsapp (long text, French default provided)
- Stored in table app_settings (key, value, updated_at, updated_by).
  Read: authenticated users. Write: admin only (RLS).
- Email/WhatsApp templates and AI prompts can use {{produit}} and
  {{description_produit}}, filled from these settings.
- If empty, show "À compléter dans Paramètres" instead of failing.
- Store priority thresholds and nonsecret integration provider preferences
  in app_settings too. Keep existing Atomic CRM configuration for its current
  settings; do not unnecessarily replace it.
- Product content and active AI prompts must be loaded from app_settings.
  French default prompts may initialize settings in their approved phase;
  browser code must not contain the active business prompts.

## 2. How you (Codex) must work

- Read AGENTS.md and this file first.
- Build ONE phase at a time, only when I say so.
- Before coding a phase: short plan (files, tables, env vars). Wait for "go".
- After coding: explain in plain language what you did, how to test it,
  and what could break. I am a beginner on Windows (PowerShell).
- Reuse Atomic CRM patterns. Don't rewrite existing files unnecessarily.
  Don't touch auth/login.
- TypeScript strict. Run type check + lint before finishing.
- Inspect package.json before choosing commands. Run relevant tests and
  format only changed files; do not reformat the whole repository.
- Test the real Supabase-backed app, not only the FakeRest demo.
- After every approved phase, update PROGRESS.md with completed work,
  checks, pending phases, risks, and next steps. Review the Git diff and
  staged file list. Commit locally only when relevant checks pass.
- Never push unless explicitly requested. Never stage secret-containing
  files. Document a safe Windows hook workaround if make is unavailable;
  never silently bypass checks.
- Secrets only in .env / Edge Function secrets. Document in .env.example.
- All third-party integration API calls (AI, email, WhatsApp providers) happen server-side in
  Supabase Edge Functions, never in the browser.
- Do not modify existing authentication/login or its behavior.
- Build actual integrations only in their individually approved phases.

## 3. Language

- Entire UI, emails, WhatsApp templates, and AI output in FRENCH.
- Use react-admin i18n with a French translation file.
- French is the default independently of the browser language. Reuse the
  existing Atomic CRM translation catalog and formatting patterns.
- Display dates DD/MM/YYYY, currency MAD. Keep database/CSV machine dates
  in their required ISO formats; do not change stored values or convert
  existing monetary amounts merely to change their display.
- Preserve existing functionality and explicit preferences. The deployment
  acceptance check must verify the selected language is French and currency
  is MAD; do not silently overwrite existing administrator configuration.

## 4. Stack

React + TypeScript + Vite, react-admin, shadcn/ui, Tailwind, Supabase
(Postgres, Auth, Storage, Edge Functions), Leaflet + OpenStreetMap
(free, no key), an approved AI provider, Resend initially (email).
The actual frontend uses ra-core with the repository's shadcn-admin-kit.
Reuse the installed stack rather than replacing it.

AI options: direct Gemini API, Vertex AI, or OpenRouter. WhatsApp starts with
wa.me; optional later providers: Meta Cloud API, Twilio, or 360dialog.
Do not implement all providers in advance.

## 5. Data model

Schools = Atomic CRM "companies". Add fields:
name, category, address, street, neighborhood, city, country_code,
phone (normalized), phones_raw, is_mobile, email, website, domain,
image_url, facebook_url, instagram_url, linkedin_url, latitude, longitude,
google_place_id (UNIQUE when present), google_maps_url, institution_types,
source, import_file_name, ai_info (JSON), ai_info_updated_at.
Reuse existing columns such as phone_number instead of duplicating their
purpose; settle the exact mapping before the Phase 1 migration.
Reuse contacts (people at school), tasks (follow-ups), and note/activity UI
patterns. Keep existing deals functionality and data intact; do not use
deal stages as the new school's priority/workflow model.
Reuse nullable sales_id for ownership. Roles remain admin and salesperson.
Extend tasks to support a school without requiring a contact, while retaining
existing contact-linked tasks. Aggregate average/count/priority in a view;
do not maintain an editable single school rating as the source of truth.

New tables (all with Row Level Security, authenticated users only):

- school_ratings: company_id, sales_id, stars, created_at, updated_at;
  UNIQUE(company_id, sales_id), stars constrained to integer 1-5.
- ownership_events: company_id, actor, previous_sales_id, new_sales_id,
  action, reason, created_at. Append-only history written by the database.
- company_notes: company_id, author, text, date, attachments as needed;
  reuse existing note components rather than creating fake contacts/deals.
- user_filter_preferences: authenticated user, view key, filters, updated_at;
  each user can read/write only their own preferences.
- call_logs: school_id, optional contact_id, authenticated author, outcome,
  duration_min, note, optional rating snapshot, created_at. The independent
  school_ratings table remains the authoritative source of ratings.
- messages: school_id, contact_id, user_id, channel (email|whatsapp),
  body, status, provider_id, created_at
- campaigns + campaign_recipients (mass email)
- opt_outs (email, created_at)
- app_settings (see section 1b)
- import_batches/import_conflicts (or equivalent): source file provenance,
  school, field, existing/incoming values, review status and reviewer.
- Do not create an integration_secrets table. API secrets belong in server
  environment variables/Edge Function secrets, never app_settings, client
  configuration, CSV exports, application logs, or Git.
- Foreign keys, permission checks, and deletion behavior must preserve
  activity and authorship. Disable users rather than deleting them.

## 6. CSV import (many separate files)

- I have MANY individual CSV files. The import can be run repeatedly,
  one file at a time. Duplicates across files are handled by placeId.
- Store the file name in import_file_name for each school.
  Columns in my files:
  Source.Name, address, categories/0, title, countryCode, domain, emails,
  facebooks/0, imageUrl, instagrams/0, linkedIns/0, location/lat,
  location/lng, neighborhood, phones, placeId, searchPageUrl, street, url,
  website.
  Mapping:
- title -> name; categories/0 -> category; address -> address
- location/lat, location/lng -> latitude, longitude (no geocoding needed)
- phones -> phone (see normalization); emails -> email
- placeId -> google_place_id (DEDUPE KEY: fill missing fields only)
- url -> google_maps_url; imageUrl -> image_url
- facebooks/0, instagrams/0, linkedIns/0 -> social urls
- Ignore: Source.Name, searchPageUrl
  City: NO city column. Derive city from address (Moroccan format: street,
  postal code + city, Morocco). If unclear, reverse geocode lat/lng with
  Nominatim (rate-limited, 1 req/sec) or leave blank and flag "city
  missing" so I can fix it in the UI. Normalize city spelling
  (Casablanca/Casa -> Casablanca).
  Phone normalization: convert to international +212 format
  (06/07 = mobile, 05 = landline). Store is_mobile flag. Keep raw value.
  Import UI: upload, preview first 20 rows, show mapping, show counts
  (new / duplicates / missing city / missing phone), then confirm.
  Handle empty cells and multiple phones/emails in one cell.

Duplicate rules:

- Normalize blank Place IDs to NULL. Match only nonempty Google Place ID;
  do not automatically merge by name, phone, or approximate address.
- Fill only genuinely missing fields with valid incoming information.
  Never overwrite existing populated values, owner, ratings, notes, calls,
  messages, tasks, AI cache, or ownership history.
- Compare normalized values and flag incompatible populated values for
  review, preserving both versions without automatically choosing one.
- Track every import file in batch provenance; keep the original school's
  import_file_name when already populated.
- Preview counts include new, enriched duplicates, unchanged duplicates,
  conflicts, missing Place ID, missing city, missing phone and invalid rows.
- Guard duplicate insert/enrichment against simultaneous imports in the
  database. Re-importing the same file must not duplicate activity.
- Rows missing a Place ID are flagged for manual review before insertion
  or any proposed merge.

## 7. Phases (BUILD ORDER FOR THE DEMO)

Demo in 1 week with 3-5 testers. Order: 0, 1, 2, 4, 6, 7, then 3, 5, 8.
Phases 3 and 5 need provider accounts. Build their screens and the
"Non configuré" state only when those phases are approved. Until then,
do not build their actual integrations or placeholder feature screens.
Every phase requires its own plan and explicit "go"; completing one phase
does not authorize the next.

### Phase 0: Setup check

Verify setup and the actual Supabase-backed app. Summarize where companies,
deals, tasks, notes, dashboard, schemas and relevant migrations live.
Set French by default, DD/MM/YYYY display and MAD default, reusing existing
patterns. Preserve authentication and working CRM features. Document Windows
commands and placeholder-only .env.example. Update this spec and PROGRESS.md.
Run typecheck, lint, relevant tests and formatting checks on changed files.
No migrations, RLS changes, school features or integration implementations.
Record current ownership/RLS weaknesses as blockers before team deployment.

### Phase 1: Schools + CSV import

Migration for school fields and the rating/ownership/settings foundations
needed by the later map and workflow. List/detail/edit forms, combined
institution type/city/ownership/priority/average-star filters remembered per
user, CSV import per section 6, school photo from image_url. New/imported
schools remain unassigned. Agree the exact schema and permissions in the
Phase 1 plan before coding; do not defer ownership protection until polish.

### Phase 2: Map (DEMO MUST-HAVE)

- "Carte" page, full height, modern design, OpenStreetMap + Leaflet.
- Works on touch: bottom sheet on mobile, 44px tap targets.
- Markers cluster. Side panel lists cities with school counts.
- CLICK A CITY: map zooms in AND the panel expands to show ALL schools
  of that city (name, average stars, priority, owner, phone). Fetch all pages;
  do not silently cap a city at the API's default row limit.
- Click school: card with name, phone (tel: link), WhatsApp button
  (mobile numbers only), the current salesperson's STAR RATING editable
  on the card, individual ratings and average,
  photo, buttons "Ouvrir", "Infos école", "Ajouter une note".
- Search by name/city and reuse combined institution/ownership/priority/
  rating filters. Priority is computed, never dragged between stages.
- Buttons for future integrations show "Non configuré" only as permitted
  by that phase's approved scope; actual integration calls wait.

### Phase 3: AI school info (approved provider)

- "Infos école" button on map card and school page.
- Edge Function calls the approved AI provider with school name + city + Google Maps URL,
  using ai_prompt_school_info from settings. Asks JSON: year_founded,
  founder, ranking, type, size, notable_facts.
- Unknown = "Inconnu". Never invent. Cache in ai_info; only re-call on
  "Actualiser".
- Always show: "Généré par IA, à vérifier".
- If the approved provider is not configured: show "Non configuré".
- Provider choice supports a later decision between Gemini, Vertex AI and
  OpenRouter. Build only the selected integration in this approved phase.

### Phase 4: Sales workflow (DEMO MUST-HAVE)

- Shared unassigned pool, atomic claim/release/transfer, administrator
  reassignment, and full ownership history per section 1a.
- Independent 1-5 ratings, individual/average display, "Non évalué", and
  automatically computed HP/MP/LP with admin-configurable thresholds.
  Show them on map cards, school list and school page.
- No additional elaborate sales pipeline or new Kanban. Use straightforward
  call outcomes, notes, follow-ups and priority-based views. "Pas intéressé"
  is a call outcome rather than a priority level.
- "Enregistrer un appel" dialog: outcome, stars, note, next follow-up
  date (auto-creates task); all staff can log calls on any lead.
- Notes timeline per school, merged with call logs, ownership events and
  messages when their integration phases have been approved.
- Dashboard: calls this week, schools per priority, due and overdue tasks,
  average rating, schools by city, per-salesperson activity.
- In-app follow-up reminders; optional email reminders need later approval.

### Phase 5: Email (Resend)

- Single email from school/contact page via Edge Function.
- French templates with {{nom_ecole}}, {{nom_contact}}, {{produit}}.
- Mass email: select schools or filter, pick template, preview,
  send through a queue with rate limiting.
- Mandatory unsubscribe link + opt_outs check. Log in messages.
- I own a business domain: include setup steps for SPF/DKIM in Resend.
- If no Resend key: email buttons show "Non configuré".

### Phase 6: WhatsApp (click-to-chat, no API yet)

- Button opens wa.me/<number> with a pre-filled French template.
- Only shown for mobile numbers. Log "WhatsApp ouvert" when opening wa.me;
  "WhatsApp envoyé" requires user confirmation. Opening a link cannot prove
  delivery. Do not invent sent/read/delivered states.
- "Mass WhatsApp" at this stage = a guided list: open the next school,
  message pre-filled, salesperson taps send, then "Suivant".
- Templates use product/prompt settings; no hard-coded product description.
- Official WhatsApp Business API is a LATER separately approved phase:
  Meta Cloud API (with required approval), Twilio, or 360dialog.

### Phase 7: Export

CSV export of schools, call logs, messages from list pages
(UTF-8 with BOM so Excel shows French accents correctly).

### Phase 8: UI polish + security review + Intégrations

- Admin-only "Paramètres > Intégrations": approved provider selection,
  sending domain and connection status "Connecté" / "Non connecté".
  Provision secrets through server environment/Edge Function secrets;
  never return keys to the browser. Any later credential provisioning UI
  needs a separate approved secure design, not a public configuration table.
- Consistent spacing, dark mode, empty/loading states, mobile layout.
- Verify RLS on every table, no secrets in client, input validation.
- Design throughout approved phases: modern, youthful, artistic and
  professional; bold high-contrast colors, premium typography, elegant
  light/dark modes, refined dashboards and interactions. Take workflow
  inspiration from HubSpot, with an original visual design. Phase 8 refines
  earlier work; do not postpone all design quality until this phase.

### Phase 9 (LATER, optional): Twilio calls + WhatsApp API

Call recording with audio player and costs; official WhatsApp API for
mass sending. Do NOT start until I ask.

## 8. Security

RLS on every table. Unauthenticated user gets nothing.
Validate and sanitize all CSV and form input. Verify webhook signatures.

- "Unauthenticated gets nothing" refers to CRM business data; preserve
  existing authentication bootstrap endpoints needed for login/setup.
- Enforce ownership permissions and caller/author identity server-side.
  A hidden or disabled UI button is not a security control.
- Ratings/preferences have per-user write permissions. Settings writes are
  admin-only. Ownership history is append-only and protected from clients.
- Review delete cascades and attachment deletion so activity is not lost.
- Security blockers in the current unmodified database: companies can be
  updated/deleted by any authenticated user; ownership is auto-assigned on
  insertion; notes/tasks have broad mutation permissions; no atomic claim
  or protected ownership history exists. Do not deploy to a real team until
  approved later phases fix and test these conditions. RLS existing does
  not mean the new product's permissions are implemented.
- Review browser cache/account isolation and all existing API/MCP mutation
  paths. Never reuse committed local/test credentials in production.

## 9. Non-goals

No billing, no multi-tenant, no mobile app, no custom auth.

## 10. Done means

Runs locally against Supabase, no application console errors, strict type
check and lint pass, relevant tests pass, changed files pass formatting,
I can test by clicking, and you gave me PowerShell/browser test steps.
PROGRESS.md records evidence and limitations. Diff/staged files are reviewed;
commit locally only after checks pass; do not push without explicit request.
