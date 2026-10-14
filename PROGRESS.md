# Morocco Private Schools Sales CRM — Progress

Last updated: 13/10/2026 (owner's timezone).

## Approved documentation reconciliation

Owner approval for this update covers PROJECT_SPEC.md and PROGRESS.md ONLY.
No application code, migrations, authentication, secrets, staging, commit or push.
Phase 1 planning and implementation have not been approved by this update.

- Added the approved mass email/WhatsApp contract: all HP, MP, LP or any
  combination, individual schools, combined filters, search by school/city/
  contact/email/phone, selection across every page and manual recipient exclusions.
- Added explicit selected/eligible/excluded/duplicate counts, destination choices,
  editable French templates/personalized variables, reusable campaigns, editable
  generation prompts and mandatory final recipient/message previews.
- Defined immutable run/message snapshots, fresh checks when reusing campaigns,
  consent/opt-outs, duplicate-safe sending/events and preserved delivery history.
- Distinguished native provider-backed CRM campaigns (server queues/rate limits)
  from optional external marketing-platform connections/synchronization. Initial
  WhatsApp remains guided wa.me; automated bulk WhatsApp waits for a separately
  approved provider, proper opt-in and applicable approved templates.
- Recorded exact future email adapter options: Resend, Brevo, SendGrid, Mailgun,
  Amazon SES, Mailchimp. Recorded exact future WhatsApp options: Meta Cloud API,
  Twilio, 360dialog, WATI, Infobip, Gupshup. No connector was implemented.
- Clarified built-in CRM capabilities, Supabase/FakeRest data providers, external
  AI/sending services, and the separate existing Postmark inbound capability.
- Recorded future administrator CRM name/logo/favicon/brand-color controls.
  Existing title and light/dark logo customization is reused; favicon/colors are
  not implemented. Premium/youthful/bold/professional design remains required;
  no final name/logo is chosen. Typography controls are an optional extension.
- Retained independent salesperson ratings, automatic HP/MP/LP, shared ownership,
  complete history, remembered combined filters, calls/notes/follow-up reminders,
  safe Google Place ID enrichment and secure Supabase permissions.
- Clarified one-current-rating averaging, validated thresholds/recalculation,
  no school sales-stage pipeline, the role/action contract and direct API tests.
- Corrected phase dependencies: secure ratings/ownership/basic school notes before
  the map; WhatsApp campaign/history foundations before exports and email; initial
  provider setup in its own approved phase rather than delayed until UI polish.
- Clarified French/MAD defaults, preserved explicit preferences and native date
  editor conventions. All original CSV columns/mappings, phone/city handling,
  AI cache/verification, unsubscribe/domain setup and UTF-8 BOM requirements remain.

Validation for this documentation-only update: strict typecheck and ESLint passed
(existing nonblocking .eslintignore warning). Changed-document Prettier and Git
whitespace checks passed. Reviewed the diff and verified both exact provider lists,
original CSV/export rules, phase order and Phase 0 commit reference. Only these
two documents are modified; nothing is staged, committed or pushed. No browser
or application regression suite was rerun for these documentation changes.
Phase 0 results below are historical; they do not imply the newly documented
features have been implemented or tested.

## Requirements implementation status

| Requirement                                                                          | Actual status                                                        | Approved future scope                                                                      |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| French defaults, DD/MM/YYYY display, MAD default                                     | Implemented in Phase 0; explicit preferences respected               | Preserve throughout future phases                                                          |
| CRM title and light/dark logos                                                       | Existing Atomic CRM administrator configuration                      | Reuse for branding; no final identity chosen                                               |
| Favicon/brand-color controls and design refinement                                   | Required, not implemented                                            | Phase 8; optional typography controls need an approved scope                               |
| School fields, Place ID enrichment/conflict review, remembered combined filters      | Specified, not implemented                                           | Phase 1, pending separate plan/approval                                                    |
| Unassigned pool, atomic ownership/history and independent ratings/automatic priority | Specified; current database does not enforce them                    | Secure foundations in Phase 1; map use in Phase 2; full assignment workflow in Phase 4     |
| Basic school notes and contact-independent follow-ups                                | Existing components reusable; school-specific behavior pending       | Basic school notes in Phase 1; calls/follow-ups/dashboard/reminders in Phase 4             |
| Clustered map/city panels                                                            | Specified, not implemented                                           | Phase 2                                                                                    |
| Mass targeting/search/all-page selection/exclusions/counts/preview                   | Required, not implemented                                            | Guided WhatsApp in Phase 6; email in Phase 5; later automated WhatsApp separately approved |
| Editable French templates/variables/reusable campaigns/history                       | Required, not implemented                                            | Shared guided campaign foundation in Phase 6; email extension in Phase 5                   |
| Product description, editable AI prompts, priority thresholds                        | app_settings specified, not created                                  | Nonsecret foundations/minimum settings UI in Phase 1 plan; AI calls only Phase 3           |
| Native queued provider sending and verified delivery events                          | Not implemented                                                      | Resend email in Phase 5; approved automated WhatsApp in later Phase 9                      |
| External marketing-platform sync and additional adapters                             | Optional future choices; none implemented                            | Phase 8/later, connector-specific approval required                                        |
| AI school info and campaign generation                                               | No built-in hosted AI selected; no integration implemented           | Approved Gemini/Vertex AI/OpenRouter integration in Phase 3                                |
| Exports                                                                              | Existing generic exporter; requested school/activity exports pending | Phase 7 for available data; email activity extension after Phase 5                         |
| Production/team permissions                                                          | Deployment blockers remain; documentation is not a fix               | Enforce in each relevant approved phase and review again in Phase 8                        |

## Phase 0

Scope approved by the owner: setup, specification, French defaults, date/currency
display, safe environment example, validation and local commit. No Phase 1 work.
Completed in local commit 4976a70. This reconciliation is a later, uncommitted
documentation update and does not change the completed Phase 0 implementation.

### Completed implementation

- Updated PROJECT_SPEC.md with the confirmed decisions available at Phase 0 while preserving the
  original CSV mappings, phone/city normalization, map requirements, AI caching,
  email queue/unsubscribe requirements, exports and optional later integrations.
- French defaults independently of browser language. Existing translation
  catalogs and explicit language preferences remain available.
- French default sector/stage/category/note/task labels; internal identifiers
  remain unchanged. Existing deals, contacts, notes and tasks are preserved.
- MAD default; money formatting follows the application locale rather than
  an English/browser locale. Stored amounts and administrator settings are not
  silently converted or overwritten.
- Absolute dates display DD/MM/YYYY. Date-only values retain their calendar day
  across timezones; recent activity retains useful French relative wording.
  Native date/time editors still store ISO values and use browser/Windows widgets.
- Translated the existing desktop theme menu and marked the HTML language French.
- Kept old English CSV option labels compatible with French defaults. This is
  compatibility for the existing importer, not the future schools CSV feature.
- Added placeholder-only .env.example. Existing environment/credential files
  were not printed, modified or staged.
- Made the existing pre-commit checks work without make: npm registry generation,
  local Prettier, local lint-staged, then the existing index refresh. Checks are
  not bypassed. Fixed Windows glob patterns and normalized registry paths;
  preserved existing registry ordering to avoid unrelated generated changes.
- No authentication/login, database schema, migration, RLS, package dependency,
  product settings feature, school workflow, map or integration implementation.

### Validation

- Initial typecheck and ESLint passed before changes.
- Frontend regression suite: 34 files passed; 272 tests passed; 1 existing skipped
  test. Includes locale, timezone/date display, MAD formatting, preserved custom
  currency, imports, contact status, notes and task creation.
- First test attempt could not launch because the pinned Playwright Chromium
  headless browser was missing. Installed that test browser and its supporting
  runtime from Playwright; no npm dependency/lockfile changes.
- Initial full run found three assertions expecting old English default labels;
  updated those assertions without removing their data/behavior checks.
- Two unchanged Gravatar tests failed inside the network sandbox and passed
  outside it. The final full frontend run with network access passed.
- Registry generation checked: 230 valid paths, 221 Atomic CRM component paths,
  no test/secret paths; generated registry content matches the original.
- Final strict typecheck and ESLint passed. Prettier checks passed for changed
  source files and both changed Markdown documents. Git diff/whitespace review
  passed; authentication, schemas, migrations, package/lockfile and existing
  credential files have no changes. Generated Vitest failure screenshots are
  ignored by Git, not delivered as source files.
- Local delivery uses the normal pre-commit hook after these checks, with no
  make dependency and no bypass. Nothing is pushed to GitHub.
- These results describe the Phase 0 commit, not a new application test run for
  this documentation reconciliation or proof that future features work.

### Real Supabase browser verification

- Existing local Supabase containers were already running; no backend restart,
  migration/reset, account creation or permission changes were performed.
- Tested the real app at http://localhost:5173, using src/App.tsx and the Supabase
  provider, not the FakeRest demo. The owner signed in personally.
- Protected dashboard, companies, deals and administrator settings opened in
  French. Settings showed MAD and French default choices. Light/dark mode worked.
- At 390px width, mobile contacts and tasks navigation/empty states worked in
  French. Restored the default viewport and original light theme after testing.
  Captured application console error count: zero. Left the real dashboard open.
- Current local business lists are empty: this verifies authenticated loading,
  navigation and empty states, not populated-list performance or a complete
  production CRM audit. Date/amount rendering is covered by browser regression
  tests without inserting test records into the owner's database.

## Architecture reference

| Area              | Files/resources                                                                                                   |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| App/routes        | src/App.tsx; src/components/atomic-crm/root/CRM.tsx                                                               |
| Schools later     | companies/CompanyList.tsx, CompanyListFilter.tsx, CompanyInputs.tsx, CompanyShow.tsx; companies/companies_summary |
| Existing pipeline | deals/DealList.tsx, DealColumn.tsx, DealCard.tsx; deals                                                           |
| Follow-ups        | tasks/TaskFormContent.tsx, TasksListByDueDate.tsx; tasks currently requires contact_id                            |
| Notes/activity    | notes/NoteInputs.tsx, activity/ActivityLog.tsx; contact_notes, deal_notes, activity_log                           |
| Dashboard         | dashboard/Dashboard.tsx, MobileDashboard.tsx, TasksList.tsx                                                       |
| Existing import   | dataImport/DataImportDialog.tsx, useCompanyImport.ts, parseCell.ts                                                |
| Localization      | providers/commons/i18nProvider.ts, frenchCrmMessages.ts; misc/RelativeDate.tsx                                    |
| Settings          | root/defaultConfiguration.ts, ConfigurationContext.tsx; settings/SettingsPage.tsx; configuration                  |
| Backend source    | supabase/schemas/01_tables.sql through 08_search.sql; providers/supabase/dataProvider.ts                          |

Relevant existing migrations: 20240730075029_init_db.sql,
20240730075425_init_triggers.sql, 20260108160722_task_default_sales.sql,
20260115150819_snake_case_renaming.sql, 20260127140209_imports.sql,
20260211194545_app_configuration.sql, 20260309112831_fix_security_warnings.sql,
20260314120000_activity_log_view.sql and 20261010054346_global_search.sql.
There are 28 existing migrations; Phase 0 adds none.

## Security blockers before real team deployment

- Authenticated users can currently update/delete every company. Owner-only
  release/transfer is not enforced. Company forms/imports and an INSERT trigger
  automatically assign the creator; there is no unassigned pool/atomic claim.
- Notes/tasks have broad mutation permissions. There is no protected ownership
  history, independent per-salesperson ratings or per-user filter table.
- Delete cascades can erase related activity. Later approved phases must enforce
  history preservation and actor attribution in the database and every API path.
- Review mobile offline data/browser store isolation between users, attachment
  deletion permissions, and existing MCP/Edge Function mutation paths.
- Existing tracked local/test environment and signing-key files must never be
  replaced with production credentials. No new integration secrets were added.
- RLS existing is not evidence that the new product permissions are safe. These
  blockers must be resolved and tested before real staff use; Phase 0 leaves
  database permissions unchanged as required.
- Required future checks include forged authors/owners, simultaneous claims,
  inactive assignees, another user's ratings/preferences, nonadmin settings writes,
  task/ownership-history preservation and direct API/MCP bypass attempts.
- Campaign phases must enforce final approved audiences/messages, applicable
  consent/unsubscribe/opt-in, server-only secrets/calls, safe retry/webhook handling
  and prevention of CRM/platform double sending. Imported addresses/numbers are
  not proof of consent. Initial wa.me cannot establish delivery/read status.
- Recipient unsubscribe endpoints must validate scoped tokens without requiring
  CRM login or granting anonymous business-data access. Provider callbacks use
  verified signatures; queue workers use restricted server authority.
- Campaign launch/sync/template-sharing permissions, metadata edits/archive and
  activity corrections require an explicit role matrix in their approved phase
  plan; general school visibility is not blanket mass-send authorization.

## Windows testing steps

1. Keep Docker Desktop and the existing local Supabase stack running. Phase 0
   does not reset it. If it is stopped, discuss startup separately because
   Supabase startup may apply outstanding migrations.
2. Open PowerShell:

    ```powershell
    Set-Location C:\dev\atomic-crm
    npm.cmd run dev
    ```

3. Open http://localhost:5173 (or the exact Local URL printed by Vite if the port
   is occupied). Sign in with your existing account. Do not use dev:demo as proof
   that Supabase works.
4. Check French dashboard/Contacts/Entreprises/Affaires. Open the avatar menu,
   Paramètres, then Affaires: Devise should be MAD and option labels French.
   Verify Clair/Sombre using the theme button. Narrow the browser to check mobile.
5. On existing records, check numeric dates such as 05/01/2024 and MAD amounts.
   Relative activity such as "hier" is intentional. On an empty database these
   displays are tested automatically rather than by adding business data.
6. Explicit saved language/currency/custom labels remain respected. If an older
   browser profile shows English or USD, select Français in Profil (or mobile
   Paramètres) and MAD in administrator Paramètres. Do not clear authentication
   storage or reset all settings to fix a display preference.

Validation commands:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run test:unit:app -- --run --project app
```

Tests require the pinned Playwright browser and network access for existing
Gravatar tests. To install only the missing test browser if needed:

```powershell
npx.cmd --no-install playwright install chromium --only-shell
```

Format/check only explicitly changed paths with node_modules/.bin/prettier.cmd.
The repository ignores Markdown in .prettierignore; explicitly check changed
PROJECT_SPEC.md/PROGRESS.md with `--ignore-path .gitignore`. Do not run a global
formatting write command. Nonblocking existing warnings concern .eslintignore
and Vite's future native config loader; no dependency upgrade is part of Phase 0.

## Pending phases and next steps

| Demo order | Status/scope                                                                                                                                                                                                    |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0          | Complete: automated checks and real Supabase browser verification; local-only delivery                                                                                                                          |
| 1          | Not started: schools/CSV enrichment/conflicts, remembered combined filters/photo, secure atomic ownership/history, rating/priority/basic-note and nonsecret settings foundations; separate plan approval needed |
| 2          | Not started: clustered map/city panels/cards using Phase 1 rating/note APIs; functional WhatsApp/AI buttons added only in Phases 6/3                                                                            |
| 4          | Not started: complete assignment interface, calls/history, contact-independent follow-ups, priority dashboard and in-app reminders                                                                              |
| 6          | Not started: guided wa.me campaigns, all-priority/individual targeting, recipient search/all-page exclusions/counts, French templates/variables/prompts, final preview and campaign/message history             |
| 7          | Not started: UTF-8 BOM exports of schools, calls and available WhatsApp history; email extension after Phase 5                                                                                                  |
| 3          | Not started: selected server-side AI provider/setup, cached verified school info, editable app_settings prompts and optional campaign AI drafting                                                               |
| 5          | Not started: Resend setup/native queue/rate limits, full email targeting/templates/reusable campaigns/preview, consent/unsubscribes, delivery history and domain setup                                          |
| 8          | Not started: original design refinement, administrator favicon/colors using existing title/logos, provider management and security review; optional additional adapters/platform sync need separate approval    |
| 9          | Optional later: calls/recording and approved automated bulk WhatsApp with opt-in/templates, server queues/rate limits and delivery events; separate approval                                                    |

## Remaining decisions and reconciled boundaries

- No unresolved contradiction between the updated product requirements: preserved
  legacy deals are not a new school pipeline; Phase 2 ratings/notes depend on
  Phase 1 APIs; Phase 7 exports only data already available; provider configuration
  belongs to its integration phase; wa.me is guided, not automated bulk delivery.
- Future phase plans still need exact schemas, permissions for campaign launches/
  sync/templates and metadata/activity editing, destination choices when several
  contacts exist, and provider/platform sync scope/capabilities. These are pending
  implementation decisions, not approval to build them now.
- Initial email remains Resend and initial WhatsApp remains guided wa.me. No
  extra email/WhatsApp connector or AI provider has been selected by this update.
- French/MAD defaults and existing explicit preferences coexist; deployment checks
  verify the intended French/MAD configuration without rewriting user data. Native
  date editor presentation remains browser/Windows-dependent.
- AGENTS.md still describes the upstream make-based hook and historical CRM
  pipeline/configuration API. It was not edited because this approval permits
  only the two documents. The Phase 0 code/PROGRESS.md describe the actual npm
  hook; future plans must inspect real code rather than treat upstream examples
  as implemented school features or existing color/favicon controls.
- The original "demo in 1 week" remains an original target, not a newly confirmed
  calendar deadline. No new release date is selected by this reconciliation.

Next action: wait for the owner's approval to PREPARE a Phase 1 plan. That plan
must specify files, exact tables/permissions, environment, tests and deployment
blockers, then receive an explicit "go" before coding. This documentation update
does not approve Phase 1 planning/implementation, staging, committing or pushing.
