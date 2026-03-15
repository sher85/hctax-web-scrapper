# Harris County Tax Sale Scraper

Typed Node.js CLI for scraping Harris County tax sale listings, storing a local snapshot in SQLite, and recording field-level changes over time.

## Highlights

- TypeScript codebase with a clean `src/` layout
- SQLite bootstrap and lightweight schema migration on startup
- Change tracking in `property_history`
- Optional email summaries through Gmail SMTP credentials
- Parser tests with Vitest
- Conventional-commit releases with changelog generation

## Requirements

- Node.js 22 or newer
- npm 10 or newer

Node 24 is the recommended runtime target for long-term maintenance.

## Setup

```bash
npm install
cp .env.example .env
```

Environment variables:

- `EMAIL_USERNAME`: Gmail username for summary emails
- `EMAIL_PASSWORD`: Gmail app password
- `EMAIL_RECIPIENT`: destination address for summaries
- `EMAIL_SERVICE`: optional mail service name, defaults to `gmail`

If the email variables are not present, the scraper still runs and logs that email delivery was skipped.

## Usage

Run the scraper directly in TypeScript during development:

```bash
npm run scrape
```

Build and run the compiled CLI:

```bash
npm run build
npm run start
```

## Scripts

- `npm run scrape`: execute the scraper from source
- `npm run build`: compile TypeScript to `dist/`
- `npm run typecheck`: run the TypeScript compiler without emitting files
- `npm run test`: run the Vitest suite once
- `npm run check`: run typecheck, tests, and build
- `npm run commitlint`: lint a commit range against the Conventional Commits spec
- `npm run release`: create a local versioned release with `release-it`
- `npm run release:dry-run`: preview the next release without writing changes

## Data Model

The scraper stores current listings in `database/properties.db`.

- `properties`: latest known value for each account
- `property_history`: JSON change log for updates

The startup path is migration-safe for the existing local database file in this repo and will add any missing columns it needs.

## Project Structure

- `src/index.ts`: CLI entrypoint
- `src/app.ts`: scrape orchestration
- `src/scraper/`: fetch and parse logic
- `src/database/`: SQLite client, schema setup, and repository logic
- `src/notifications/`: email delivery

## Release Flow

Commit messages should follow Conventional Commits, for example:

```text
feat: add parcel detail scraping
fix: handle listings without adjudged value
chore: update CI release flow
```

The repo includes a Husky `commit-msg` hook plus `commitlint` config to enforce that format locally after `npm install`.

To preview the next release:

```bash
npm run release:dry-run
```

To create a local version tag and update the changelog:

```bash
npm run release
```

This runs `npm run check`, bumps `package.json`, updates [CHANGELOG.md](CHANGELOG.md), creates a release commit, and tags it as `vX.Y.Z`. NPM publishing is disabled by design.

For GitHub-hosted releases, the repo also includes:

- `.github/workflows/ci.yml`: validates commits and runs checks on pushes and pull requests
- `.github/workflows/release.yml`: manual release workflow that creates a git tag and GitHub Release using `GITHUB_TOKEN`
