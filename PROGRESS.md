# Morocco Private Schools Sales CRM — Progress

Last updated: 13/10/2026 (owner's timezone).

## Phase 0

Scope approved by the owner: setup, specification, French defaults, date/currency
display, safe environment example, validation and local commit. No Phase 1 work.

### Completed implementation

- Updated PROJECT_SPEC.md with all confirmed decisions while preserving the
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

| Demo order | Status/scope                                                                                                                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0          | Complete: automated checks and real Supabase browser verification; local-only delivery                                                                                                    |
| 1          | Not started: schools model, safe CSV enrichment/conflicts, combined remembered filters, photo and rating/ownership/settings foundations; security blockers addressed in its approved plan |
| 2          | Not started: clustered map, city panels, mobile cards, independent ratings                                                                                                                |
| 4          | Not started: shared pool and assignment actions, calls/history, priority views, follow-up dashboard/reminders                                                                             |
| 6          | Not started: wa.me and configurable French templates; honest opened/sent logging                                                                                                          |
| 7          | Not started: UTF-8 BOM exports                                                                                                                                                            |
| 3          | Not started: selected server-side AI provider, cached verified school info                                                                                                                |
| 5          | Not started: Resend, queue, unsubscribe/opt-outs and domain setup                                                                                                                         |
| 8          | Not started: original design refinement, integration settings/security review                                                                                                             |
| 9          | Optional later: calls/recording and official WhatsApp provider; separate approval                                                                                                         |

Next action after Phase 0: present a short Phase 1 plan (files, exact tables,
permissions, environment, tests) and wait for the owner's explicit "go". Do not
start another phase or push this work automatically.
