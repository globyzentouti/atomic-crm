# PROJECT SPEC: Private Schools Sales CRM (Morocco)

## 1. Goal
CRM for a small team (3-5 salespeople to start) selling to PRIVATE SCHOOLS
IN MOROCCO. Salespeople find schools on a map, call them, rate them, take
notes, move them through a pipeline, and contact them by email and WhatsApp.
Built on Atomic CRM (marmelab/atomic-crm), customized.
Must look modern and polished, and work on phones and computers.
Main contacts at schools: director, founder, or person in charge.

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

## 2. How you (Codex) must work
- Read AGENTS.md and this file first.
- Build ONE phase at a time, only when I say so.
- Before coding a phase: short plan (files, tables, env vars). Wait for "go".
- After coding: explain in plain language what you did, how to test it,
  and what could break. I am a beginner on Windows (PowerShell).
- Reuse Atomic CRM patterns. Don't rewrite existing files unnecessarily.
  Don't touch auth/login.
- TypeScript strict. Run type check + lint before finishing.
- Secrets only in .env / Edge Function secrets. Document in .env.example.
- All third-party API calls (Gemini, Resend) happen server-side in
  Supabase Edge Functions, never in the browser.

## 3. Language
- Entire UI, emails, WhatsApp templates, and AI output in FRENCH.
- Use react-admin i18n with a French translation file.
- Dates DD/MM/YYYY, currency MAD.

## 4. Stack
React + TypeScript + Vite, react-admin, shadcn/ui, Tailwind, Supabase
(Postgres, Auth, Storage, Edge Functions), Leaflet + OpenStreetMap
(free, no key), Gemini API, Resend (email).

## 5. Data model
Schools = Atomic CRM "companies". Add fields:
name, category, address, street, neighborhood, city, country_code,
phone (normalized), phones_raw, is_mobile, email, website, domain,
image_url, facebook_url, instagram_url, linkedin_url, latitude, longitude,
google_place_id (UNIQUE), google_maps_url, rating (1-5, nullable),
source, import_file_name, ai_info (JSON), ai_info_updated_at.
Reuse: contacts (people at school), deals (pipeline), tasks (follow-ups),
notes (history). Each school can be assigned to a salesperson
(existing sales_id). Roles: admin and salesperson.

New tables (all with Row Level Security, authenticated users only):
- call_logs: school_id, contact_id, user_id, outcome, duration_min, note,
  rating, created_at
- messages: school_id, contact_id, user_id, channel (email|whatsapp),
  body, status, provider_id, created_at
- campaigns + campaign_recipients (mass email)
- opt_outs (email, created_at)
- app_settings (see section 1b)
- integration_secrets: API keys. NO client access at all (RLS blocks
  everyone); only Edge Functions with the service role can read/write.

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
- placeId -> google_place_id (DEDUPE KEY: skip or update if exists)
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

## 7. Phases (BUILD ORDER FOR THE DEMO)
Demo in 1 week with 3-5 testers. Order: 0, 1, 2, 4, 6, 7, then 3, 5, 8.
Phases 3 and 5 need accounts I don't have yet (Gemini, Resend): build the
screens and the "Non configuré" state first; they work once keys are added.

### Phase 0: Setup check
App runs, type check passes. Summarize codebase (where companies, deals,
tasks, notes, dashboard live). Set French locale.

### Phase 1: Schools + CSV import
Migration for school fields, list/detail/edit forms, filters (city,
rating, stage), CSV import per section 6, school photo from image_url.

### Phase 2: Map (DEMO MUST-HAVE)
- "Carte" page, full height, modern design, OpenStreetMap + Leaflet.
- Works on touch: bottom sheet on mobile, 44px tap targets.
- Markers cluster. Side panel lists cities with school counts.
- CLICK A CITY: map zooms in AND the panel expands to show ALL schools
  of that city (name, stars, stage, phone).
- Click school: card with name, phone (tel: link), WhatsApp button
  (mobile numbers only), STAR RATING (editable right on the card),
  photo, buttons "Ouvrir", "Infos école", "Ajouter une note".
- Search by name/city, filter by priority stage and rating.

### Phase 3: Gemini school info
- "Infos école" button on map card and school page.
- Edge Function calls Gemini with school name + city + Google Maps URL,
  using ai_prompt_school_info from settings. Asks JSON: year_founded,
  founder, ranking, type, size, notable_facts.
- Unknown = "Inconnu". Never invent. Cache in ai_info; only re-call on
  "Actualiser".
- Always show: "Généré par IA, à vérifier".
- If no Gemini key: button shows "Non configuré".

### Phase 4: Sales workflow (DEMO MUST-HAVE)
- Pipeline stages: HP (Haute priorité), MP (Priorité moyenne),
  LP (Basse priorité), Pas intéressé, Gagné. Kanban board.
- MANUAL STAR RATING (1-5) by the salesperson, visible on map card,
  school list, school page, and kanban cards.
- "Enregistrer un appel" dialog: outcome, stars, note, next follow-up
  date (auto-creates task), optional stage change.
- Notes timeline per school, merged with call logs and messages.
- Dashboard: calls this week, schools per stage, overdue tasks,
  average rating, schools by city, per-salesperson activity.

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
- Only shown for mobile numbers. Log "WhatsApp envoyé" in history.
- "Mass WhatsApp" at this stage = a guided list: open the next school,
  message pre-filled, salesperson taps send, then "Next".
- Official WhatsApp Business API is a LATER phase after Meta approval.

### Phase 7: Export
CSV export of schools, call logs, messages from list pages
(UTF-8 with BOM so Excel shows French accents correctly).

### Phase 8: UI polish + security review + Intégrations
- Admin-only "Paramètres > Intégrations": fields for Gemini key, Resend
  key, sending domain. Shows "Connecté" / "Non connecté". Keys are saved
  server-side only and NEVER shown again in the browser after saving.
- Consistent spacing, dark mode, empty/loading states, mobile layout.
- Verify RLS on every table, no secrets in client, input validation.

### Phase 9 (LATER, optional): Twilio calls + WhatsApp API
Call recording with audio player and costs; official WhatsApp API for
mass sending. Do NOT start until I ask.

## 8. Security
RLS on every table. Unauthenticated user gets nothing.
Validate and sanitize all CSV and form input. Verify webhook signatures.

## 9. Non-goals
No billing, no multi-tenant, no mobile app, no custom auth.

## 10. Done means
Runs locally, no console errors, type check passes, I can test by
clicking, and you gave me test steps.