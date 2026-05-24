# ClaudeScope

> CLI tool that researches trending Claude Code skills, plugins & MCP servers and generates an HTML report

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js >= 20](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)

## Features

- **Automatic research** — queries GitHub API for trending Claude Code repositories (skills, MCP servers, plugins)
- **Categorized report** — groups findings into Skills, MCP Servers, Plugins, and Settings/Tips
- **Beautiful HTML report** — dark/light mode, card layout, sticky navigation, auto-opens in browser
- **Offline fallback** — built-in curated mock data when GitHub API is unavailable

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20+ |
| Language | TypeScript 5.5 |
| CLI framework | Commander.js 12 |
| HTTP client | axios |
| Spinner | ora |
| Browser launch | open |

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 9

### Installation

```bash
npm install
npm run build
```

### Usage

```bash
# Research and generate report (opens browser automatically)
node dist/index.js research

# Specify output directory
node dist/index.js research --output ~/reports

# Disable auto-open
node dist/index.js research --no-open

# Help
node dist/index.js --help
```

### Global install

```bash
npm install -g .
claudescope research
```

## Report Output

Running `research` generates a `[YYYYMMDD_HHmmss]_report.html` file with:

- **Skills** — popular Claude Code skill workflows
- **MCP Servers** — trending Model Context Protocol integrations
- **Plugins** — community plugins and extensions
- **Settings & Tips** — recommended configuration patterns

## Development

```bash
npm run build      # compile TypeScript
npm run lint       # ESLint check
npm run lint:fix   # auto-fix lint issues
```

## Project Structure

```
src/
├── index.ts              — CLI entry point (Commander.js)
├── research/
│   ├── github.ts         — GitHub API client (4 parallel queries)
│   └── aggregator.ts     — data aggregation & category classification
├── report/
│   └── generator.ts      — HTML report generator
└── types.ts              — shared TypeScript interfaces
```

## License

MIT
