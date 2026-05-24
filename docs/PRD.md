# ClaudeScope: Claude Code Trend Reporter
## Product Requirements Document

---

## 1. Overview

**ClaudeScope** is a lightweight CLI tool that surfaces the latest trends in the Claude Code ecosystem—skills, plugins, MCP servers, and settings. It uses GitHub API to research trending and recently-updated repositories, aggregates insights, and generates a beautiful HTML report automatically opened in the user's default browser.

**Project Name:** claude-code-trend-reporter  
**Stack:** Node.js + TypeScript + Commander.js + axios + cheerio + open  
**Version:** 0.1.0

---

## 2. Purpose & Value Proposition

### The Problem
Claude Code power users lack a centralized way to discover what's new in the ecosystem—which skills are trending, which MCP servers are being actively maintained, and which plugins are emerging. Manually browsing GitHub for updates is time-consuming and scattered.

### The Solution
A single CLI command (`claudescope research`) that:
- Gathers intelligence on trending Claude Code ecosystem components
- Aggregates data from public GitHub repositories
- Generates a shareable, visually-rich HTML report
- Requires zero configuration (works offline with fallback data)

### Target Users
- **Primary:** Claude Code active users (developers, researchers, power users)
- **Secondary:** Claude Code community maintainers, ecosystem contributors

---

## 3. Key Features (Must-Have)

### 3.1 Research Command: `claudescope research`
**Purpose:** Execute GitHub API research across four key categories.

**Categories:**
1. **Skills** — Community-created skills (`.omc/skills/`, global user skills)
2. **MCP Servers** — Model Context Protocol integrations (MCP Server Pattern)
3. **Plugins** — ClaudeCode extensions and plugins
4. **Settings** — Configuration and settings patterns

**Behavior:**
- Queries GitHub API (unauthenticated, ~60 req/hr rate limit)
- For each category, searches:
  - Recent repositories (updated in last 30 days)
  - Most-starred repositories (top 10)
  - Topics: `claude-code-skill`, `mcp-server`, `claude-plugin`, `claude-settings`
- Aggregates results into JSON structure
- Falls back to mock data if API is unavailable

**Output (JSON):**
```json
{
  "timestamp": "2026-05-24T15:30:00Z",
  "categories": {
    "skills": [
      {
        "name": "skill-name",
        "url": "https://github.com/owner/skill-name",
        "stars": 42,
        "description": "What it does",
        "language": "TypeScript",
        "lastUpdated": "2026-05-20T10:00:00Z",
        "trend": "growing|stable|declining"
      }
    ],
    "mcp_servers": [...],
    "plugins": [...],
    "settings": [...]
  }
}
```

### 3.2 HTML Report Generation
**Output Format:** `[YYYYMMDD_HHmmss]_report.html`  
**Example:** `20260524_153045_report.html`

**Design Requirements:**
- **Layout:** Card-based grid (CSS Grid / Flexbox)
- **Theme:** Dark mode by default (optional light mode toggle)
- **Sections:**
  1. Header (timestamp, research scope)
  2. Summary stats (total items per category, trending indicators)
  3. Four category sections (Skills, MCP Servers, Plugins, Settings)
  4. Each item as a clickable card showing:
     - Name + GitHub link
     - Star count + trend indicator
     - Description
     - Language / Technology stack
     - Last updated date
     - "View on GitHub" button
- **Interactivity:**
  - Click cards to open in GitHub
  - Responsive design (mobile-friendly)
  - Smooth animations/transitions

**Template Engine:** Use vanilla HTML/CSS (no build-time template compilation required) or simple string interpolation with cheerio for dynamic insertion.

### 3.3 Automatic Browser Launch
**Behavior:**
- After report generation, automatically open the HTML file in the user's default browser
- Use `open` npm package (cross-platform: macOS, Linux, Windows)
- Fallback: Log file path if `open` fails

---

## 4. Non-Functional Requirements

### 4.1 Offline Resilience
- If GitHub API is unreachable:
  - Log a warning
  - Fall back to pre-cached mock data (`src/data/mock-data.json`)
  - Still generate report with mock data
  - Display notice in HTML: "Report generated from cached data (offline mode)"

### 4.2 Error Handling
- **HTTP Errors (API):** Retry up to 2 times with exponential backoff (500ms, 1000ms)
- **Timeouts:** 10-second global timeout for all API calls
- **User-Friendly Messages:**
  - "Network unavailable — using cached data"
  - "GitHub API rate limit reached — try again in 1 hour"
  - "Invalid output directory — using current directory"
- **Silent Failures:** Never crash; always generate a report (even if empty)

### 4.3 Performance
- Research phase: max 15 seconds (API calls + aggregation)
- Report generation: <500ms
- Total CLI execution: <20 seconds

### 4.4 Security
- No hardcoded secrets (GitHub token optional, not required)
- No data persistence beyond the HTML file
- No analytics or tracking
- All requests use HTTPS

---

## 5. Scope (Out of Scope)

### NOT Included
- Dashboard / web UI (CLI + static HTML only)
- User authentication (unauthenticated GitHub API)
- Database or persistent storage
- Real-time monitoring or scheduled jobs
- Custom theme editor
- Export formats (JSON, CSV, etc.)

---

## 6. Success Criteria

- [ ] `claudescope research` command runs successfully
- [ ] Generates valid HTML report with all 4 categories populated
- [ ] Report opens automatically in browser
- [ ] Works offline with mock data fallback
- [ ] All error messages are user-friendly
- [ ] CLI completes in <20 seconds
- [ ] HTML report renders correctly on desktop + mobile
- [ ] 80%+ unit test coverage
- [ ] README documentation complete

---

## 7. Technical Constraints

- **Runtime:** Node.js 18+
- **Package Manager:** npm
- **TypeScript:** Strict mode enabled
- **Linting:** ESLint (optional, for code review)
- **Testing:** Jest or Vitest
- **No external UI frameworks** (vanilla HTML/CSS for report)

---

## 8. Timeline & Milestones

| Sprint | Phase | Duration | Deliverable |
|--------|-------|----------|-------------|
| 0 | Setup | 1 day | package.json, tsconfig.json, .gitignore, folder structure |
| 1 | Types | 1 day | `types.ts` (all interfaces and types) |
| 2 | Research | 2 days | GitHub API module + aggregation logic |
| 3 | Report | 2 days | HTML template + CSS + report generator |
| 4 | CLI | 1 day | Commander.js CLI, entry point, integration |
| 5 | Testing | 2 days | Unit + integration tests, 80%+ coverage |
| 6 | Polish | 1 day | README, GitHub push, final QA |

**Total: 10 days (2 weeks)**

---

## 9. Acceptance Criteria

### For "research" Command
- [x] Queries GitHub API for each category
- [x] Returns structured JSON with >=3 items per category
- [x] Handles API errors gracefully
- [x] Falls back to mock data if offline

### For HTML Report
- [x] Valid HTML5 output (validates at w3c.org)
- [x] Renders correctly in Chrome, Safari, Firefox
- [x] Dark mode readable (WCAG AA contrast ratio)
- [x] All links clickable and working
- [x] Report file size <2MB

### For CLI
- [x] `claudescope research` works with zero arguments
- [x] `--output <dir>` flag supports custom directory
- [x] `--help` displays usage
- [x] Exit code 0 on success, 1 on error
- [x] No console errors or warnings

---

## 10. Glossary

| Term | Definition |
|------|-----------|
| **Skill** | Custom Claude Code functionality (`.omc/skills/`) |
| **MCP Server** | Model Context Protocol integration for extending Claude |
| **Plugin** | Third-party extension for Claude Code IDE |
| **Settings** | Configuration patterns and best practices |
| **Rate Limit** | GitHub API allows ~60 unauthenticated requests/hour |
| **Trend** | Categorization: `growing` (recent activity), `stable` (consistent), `declining` (last update >60 days ago) |
| **Mock Data** | Pre-cached fallback data used when API is unavailable |

---

## 11. Appendix: API Research Strategy

### GitHub API Queries (Pseudocode)
```
FOR each category:
  SEARCH repositories WITH:
    - topic: [category-specific-topic]
    - sort: stars
    - order: desc
    - per_page: 10
  
  SEARCH repositories WITH:
    - topic: [category-specific-topic]
    - sort: updated
    - order: desc
    - per_page: 10
  
  AGGREGATE results, remove duplicates, RANK by (stars + recency)
```

### Mock Data Structure
Pre-populate `src/data/mock-data.json` with 30-40 representative projects across all categories. Used when API is unavailable.

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-24  
**Status:** READY FOR DEVELOPMENT
