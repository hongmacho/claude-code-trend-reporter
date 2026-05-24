# ClaudeScope: Development Roadmap

---

## Overview

This document outlines the sprint-by-sprint development plan for **ClaudeScope** (claude-code-trend-reporter). Each sprint is designed to be independently testable and incrementally builds toward a fully-functional CLI tool.

**Total Duration:** ~10 working days (2 weeks)  
**Methodology:** TDD (Test-Driven Development) with unit + integration tests

---

## Sprint 0: Project Setup (Day 1)

### Objective
Initialize the Node.js + TypeScript project with all build tooling, dependencies, and folder structure.

### Tasks

#### 0.1 Initialize npm Project
- **Command:** `npm init -y`
- **Acceptance Criteria:**
  - `package.json` created with project metadata
  - Version set to `0.1.0`
  - Author set to user email

#### 0.2 Install Core Dependencies
**Dependencies:**
- `typescript` — TypeScript compiler
- `commander` — CLI argument parsing
- `axios` — HTTP client for GitHub API
- `cheerio` — HTML templating and parsing
- `open` — Cross-platform browser launcher

**Dev Dependencies:**
- `@types/node` — Node.js type definitions
- `ts-node` — TypeScript execution without build step
- `jest` — Unit testing framework
- `@types/jest` — Jest type definitions
- `ts-jest` — Jest + TypeScript integration
- `@typescript-eslint/eslint-plugin` — (optional) TypeScript linting

**Command:**
```bash
npm install commander axios cheerio open
npm install --save-dev typescript @types/node ts-node jest @types/jest ts-jest
```

**Acceptance Criteria:**
- All packages installed successfully
- `package-lock.json` generated
- No peer dependency warnings

#### 0.3 Initialize TypeScript Configuration
**File:** `tsconfig.json`

**Configuration:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

**Acceptance Criteria:**
- File exists and is valid JSON
- TypeScript compiler recognizes it (`tsc --version` works)

#### 0.4 Initialize Jest Configuration
**File:** `jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts' // Entry point
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

**Acceptance Criteria:**
- Jest can discover and run tests
- Coverage reporting configured

#### 0.5 Create Folder Structure
```
claude-code-trend-reporter/
├── src/
│   ├── index.ts                 (CLI entry point)
│   ├── types.ts                 (TypeScript interfaces)
│   ├── research/
│   │   ├── github.ts            (GitHub API client)
│   │   └── aggregator.ts        (Data aggregation)
│   ├── report/
│   │   ├── generator.ts         (HTML report builder)
│   │   └── template.ts          (HTML template)
│   ├── utils/
│   │   ├── logger.ts            (Logging utility)
│   │   ├── errors.ts            (Custom error types)
│   │   └── retry.ts             (Retry logic)
│   └── data/
│       └── mock-data.json       (Fallback data)
├── __tests__/
│   ├── research.test.ts
│   ├── report.test.ts
│   ├── cli.test.ts
│   └── integration.test.ts
├── docs/
│   ├── PRD.md                   (Product requirements)
│   └── ROADMAP.md               (This file)
├── .gitignore
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

**Acceptance Criteria:**
- All directories exist
- Can run `tsc --noEmit` without errors

#### 0.6 Create .gitignore
```
node_modules/
dist/
*.log
.DS_Store
*.js
*.map
!jest.config.js
coverage/
.env
.env.local
*.html
```

**Acceptance Criteria:**
- File created and valid

#### 0.7 Update package.json Scripts
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts"
  }
}
```

**Acceptance Criteria:**
- Scripts runnable: `npm run build`, `npm test`, etc.

---

## Sprint 1: Type Definitions (Day 2)

### Objective
Define all TypeScript interfaces and types used across the project.

### Tasks

#### 1.1 Create types.ts
**File:** `src/types.ts`

**Contents:**
```typescript
// GitHub API Response Types
export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
}

export interface GitHubSearchResponse {
  items: GitHubRepository[];
  total_count: number;
  incomplete_results: boolean;
}

// Research Result Types
export interface TrendItem {
  name: string;
  url: string;
  stars: number;
  description: string;
  language: string | null;
  lastUpdated: string;
  trend: 'growing' | 'stable' | 'declining';
}

export interface ResearchResult {
  timestamp: string;
  categories: {
    skills: TrendItem[];
    mcp_servers: TrendItem[];
    plugins: TrendItem[];
    settings: TrendItem[];
  };
}

// HTML Report Types
export interface ReportConfig {
  outputDir: string;
  timestamp: string;
  isOfflineMode: boolean;
}

export interface ReportMetadata {
  generatedAt: string;
  itemCount: number;
  categoryCounts: {
    skills: number;
    mcp_servers: number;
    plugins: number;
    settings: number;
  };
  dataSource: 'live' | 'cached';
}

// CLI Configuration
export interface CLIOptions {
  output?: string;
  mock?: boolean;
}

// Error Types
export class APIError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export class ReportGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReportGenerationError';
  }
}
```

**Acceptance Criteria:**
- `tsc --noEmit` passes (no type errors)
- All interfaces exported
- Used consistently throughout project

#### 1.2 Unit Tests for Type Definitions
**File:** `src/__tests__/types.test.ts`

**Test Cases:**
- Verify TrendItem structure
- Verify ResearchResult structure
- Verify custom error classes

**Acceptance Criteria:**
- Tests pass
- TypeScript compilation succeeds

---

## Sprint 2: GitHub API & Research Module (Days 3-4)

### Objective
Implement GitHub API client and data aggregation logic.

### Tasks

#### 2.1 GitHub API Client
**File:** `src/research/github.ts`

**Functions:**
- `searchRepositories(query, sort, per_page)` — Query GitHub API
- `getRepositoryDetails(owner, repo)` — Fetch single repo info
- `searchByTopic(topic)` — Search by GitHub topic
- `retryWithBackoff(fn, maxRetries)` — Exponential backoff retry

**Acceptance Criteria:**
- All functions return correct types
- API errors are caught and logged
- Retry logic works (tested with mock API)
- Rate limit info extracted from headers
- Timeout after 10 seconds

#### 2.2 Research Aggregator
**File:** `src/research/aggregator.ts`

**Functions:**
- `searchCategory(category)` — Aggregate results for one category
- `aggregateAllCategories()` — Run all 4 searches in parallel
- `calculateTrend(repository)` — Determine trend (growing/stable/declining)
- `sortAndLimit(items, limit)` — Sort by stars + recency, limit results
- `formatResult(repository)` — Transform GitHub response to TrendItem

**Acceptance Criteria:**
- Returns structured `ResearchResult`
- Handles empty results gracefully
- Parallel requests (not sequential)
- Deduplication works
- Trend calculation correct

#### 2.3 Mock Data Fallback
**File:** `src/data/mock-data.json`

**Contents:**
- 30-40 realistic projects across 4 categories
- Matches TrendItem structure
- Diverse languages, star counts, update dates

**Acceptance Criteria:**
- Valid JSON structure
- Can be loaded by aggregator
- Covers all 4 categories with >=3 items each

#### 2.4 Logger Utility
**File:** `src/utils/logger.ts`

**Functions:**
- `log(message)` — Info level
- `warn(message)` — Warn level
- `error(message, error?)` — Error level
- `debug(message)` — Debug level (env-controlled)

**Acceptance Criteria:**
- Colorized console output (optional)
- No dependencies on external logger libraries

#### 2.5 Error Utility
**File:** `src/utils/errors.ts`

**Functions:**
- `handleAPIError(error)` — Format API errors
- `handleNetworkError(error)` — Format network errors
- `isFallbackRequired(error)` — Determine if mock data should be used

**Acceptance Criteria:**
- User-friendly error messages
- Proper error classification

#### 2.6 Research Module Tests
**File:** `src/__tests__/research.test.ts`

**Test Cases:**
- `test('searchCategory returns array of TrendItems')`
- `test('aggregateAllCategories returns 4 categories')`
- `test('calculateTrend returns correct status')`
- `test('fallback to mock data when API fails')`
- `test('handles rate limit gracefully')`
- `test('retry logic works with exponential backoff')`
- `test('parallel requests complete in <15s')`

**Acceptance Criteria:**
- All tests pass
- 80%+ code coverage for research module
- Mock API responses used for testing

---

## Sprint 3: HTML Report Generator (Days 5-6)

### Objective
Create HTML template and report generation logic.

### Tasks

#### 3.1 HTML Template
**File:** `src/report/template.ts`

**Structure:**
- Header with timestamp and metadata
- Summary stats section
- Four category sections (Skills, MCP Servers, Plugins, Settings)
- Card grid layout for each item
- Dark mode CSS
- Responsive design

**Template Language:** Vanilla HTML + inline CSS + vanilla JavaScript

**Acceptance Criteria:**
- Valid HTML5 output
- Mobile-responsive (works on 320px+ screens)
- Dark mode WCAG AA compliant
- All links functional
- File size <2MB

#### 3.2 Report Generator
**File:** `src/report/generator.ts`

**Functions:**
- `generateReport(researchResult, config)` — Main report builder
- `formatTimestamp(date)` — Format timestamp for filename and display
- `renderCategorySection(category, items)` — HTML for one category
- `renderCard(item)` — HTML for single item card
- `writeToDisk(html, outputDir)` — Save HTML file

**Naming Convention:** `[YYYYMMDD_HHmmss]_report.html`  
**Example:** `20260524_153045_report.html`

**Acceptance Criteria:**
- Report filename follows convention
- HTML is valid and renders correctly
- All data from ResearchResult is included
- Offline mode notice appears when needed
- File written to correct directory

#### 3.3 Browser Launcher
**File:** `src/utils/browser.ts`

**Functions:**
- `openInBrowser(filePath)` — Use `open` package to launch browser
- `handleOpenError(error)` — Graceful error handling

**Acceptance Criteria:**
- Works on macOS, Linux, Windows
- Logs filepath if `open` fails
- Never crashes the application

#### 3.4 Report Module Tests
**File:** `src/__tests__/report.test.ts`

**Test Cases:**
- `test('generateReport returns valid HTML')`
- `test('filename follows YYYYMMDD_HHmmss format')`
- `test('report includes all 4 categories')`
- `test('offline notice appears when isOfflineMode=true')`
- `test('HTML renders without errors')`

**Acceptance Criteria:**
- All tests pass
- 80%+ code coverage for report module
- HTML validation passes (no structural errors)

---

## Sprint 4: CLI Integration (Day 7)

### Objective
Implement Command.js CLI and integrate all modules.

### Tasks

#### 4.1 CLI Entry Point
**File:** `src/index.ts`

**Structure:**
```typescript
import { program } from 'commander';
import { research } from './commands/research';

program
  .name('claudescope')
  .description('Claude Code ecosystem trend reporter')
  .version('0.1.0');

program
  .command('research')
  .description('Research latest trends in Claude Code ecosystem')
  .option('-o, --output <dir>', 'Output directory for report', '.')
  .option('-m, --mock', 'Use mock data (offline mode)')
  .action(research);

program.parse(process.argv);
```

**Acceptance Criteria:**
- `claudescope --help` displays usage
- `claudescope --version` shows version
- `claudescope research` runs without arguments
- `claudescope research --output /tmp` works
- Proper exit codes (0 success, 1 error)

#### 4.2 Research Command
**File:** `src/commands/research.ts`

**Flow:**
1. Parse CLI options
2. Log "Researching Claude Code ecosystem..."
3. Call `aggregateAllCategories()`
4. If error and not mock: fall back to mock data
5. Log "Generating report..."
6. Call `generateReport()`
7. Log "Opening in browser..."
8. Call `openInBrowser()`
9. Log "Done!"

**Acceptance Criteria:**
- All steps execute in order
- Progress messages displayed
- Error handling graceful
- Total execution <20 seconds

#### 4.3 CLI Tests
**File:** `src/__tests__/cli.test.ts`

**Test Cases:**
- `test('--help displays usage')`
- `test('--version shows version')`
- `test('research command runs')`
- `test('--output flag works')`
- `test('--mock flag forces mock data')`

**Acceptance Criteria:**
- All tests pass
- Coverage includes CLI argument parsing

---

## Sprint 5: Testing & QA (Days 8-9)

### Objective
Comprehensive testing, coverage validation, and quality assurance.

### Tasks

#### 5.1 Unit Test Coverage
**Target:** 80%+ across all modules

**Modules to Test:**
- `types.ts` — Type validation
- `research/github.ts` — API client
- `research/aggregator.ts` — Aggregation logic
- `report/generator.ts` — Report generation
- `utils/logger.ts`, `errors.ts`, `browser.ts` — Utilities

**Acceptance Criteria:**
- `npm run test:coverage` shows 80%+ overall
- All critical paths tested
- No uncovered branches in core logic

#### 5.2 Integration Tests
**File:** `src/__tests__/integration.test.ts`

**Test Cases:**
- `test('full CLI flow: research → report → open')`
- `test('fallback to mock data when API fails')`
- `test('report file created with correct name')`
- `test('report contains data from all 4 categories')`

**Acceptance Criteria:**
- End-to-end flow tested
- Mock API used for integration tests
- Report file verified on disk

#### 5.3 Manual QA
**Checklist:**
- [ ] Run `npm run build` — compiles without errors
- [ ] Run `npm test` — all tests pass
- [ ] Run `npm run dev -- research` — generates report, opens browser
- [ ] Report HTML opens in browser without errors
- [ ] Report displays all 4 categories with items
- [ ] Dark mode is readable
- [ ] GitHub links in report are clickable
- [ ] Works offline with `--mock` flag
- [ ] Error messages are user-friendly
- [ ] No console warnings or errors

#### 5.4 Performance Validation
**Benchmarks:**
- Research phase: <15 seconds
- Report generation: <500ms
- Total CLI execution: <20 seconds

**Acceptance Criteria:**
- Measurements recorded
- Performance acceptable

---

## Sprint 6: Documentation & Release (Day 10)

### Objective
Complete documentation, final polish, and push to GitHub.

### Tasks

#### 6.1 README.md
**Sections:**
- Overview & features
- Installation
- Quick start (`claudescope research`)
- Options (`--output`, `--mock`)
- Output format (HTML report)
- Troubleshooting
- Development (how to contribute)
- License

**Acceptance Criteria:**
- Clear, concise, complete
- All commands documented
- Examples included

#### 6.2 Final Code Review
**Checklist:**
- [ ] No hardcoded secrets
- [ ] Error messages user-friendly
- [ ] Code style consistent
- [ ] No console.log or debug statements
- [ ] Comments on complex logic
- [ ] TypeScript strict mode enforced
- [ ] No linting warnings

**Acceptance Criteria:**
- All items checked
- Code ready for production

#### 6.3 Git Push
**Steps:**
1. `git init`
2. `git add .`
3. `git commit -m "feat: initial ClaudeScope release (0.1.0)"`
4. Create GitHub repository
5. `git remote add origin https://github.com/user/claude-code-trend-reporter`
6. `git push -u origin main`

**Acceptance Criteria:**
- Repository on GitHub
- All code committed
- README visible on GitHub

#### 6.4 npm Package (Optional)
**If Desired:**
- Publish to npm registry
- Update package.json with npm name

**Acceptance Criteria:**
- Package available via `npm install`

---

## Testing Strategy

### Test Pyramid
```
        /\
       /  \        E2E / Integration
      /____\       (10%)
     /      \
    /        \     Unit Tests
   /          \    (70%)
  /__________\    

  Mock APIs & Fixtures (20%)
```

### Mock Strategy
- **GitHub API:** Mock axios responses for all API calls
- **File System:** Real file I/O tested with temp directories
- **Browser:** Don't actually open browser in tests; mock `open` package

### Coverage Goals
| Module | Coverage |
|--------|----------|
| research/ | 85%+ |
| report/ | 90%+ |
| utils/ | 80%+ |
| commands/ | 75%+ |
| **Overall** | **80%+** |

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| GitHub API rate limit | Fall back to mock data; document rate limit in README |
| Network timeout | Implement timeout + retry logic; test with mock API |
| Large report file | Limit results to ~10 per category; compress CSS/JS if needed |
| TypeScript complexity | Keep types simple; use `any` sparingly with `// @ts-ignore` comments |
| Cross-platform issues | Test on macOS + Linux in CI/CD; use `open` package for browser launch |

---

## Definition of Done (DoD)

A sprint is complete when:
- [ ] All tasks completed
- [ ] Tests written and passing (80%+ coverage)
- [ ] Code reviewed and approved
- [ ] Integration tests pass
- [ ] Manual QA checklist completed
- [ ] Documentation updated
- [ ] Changes committed to git

---

## Timeline Summary

| Sprint | Focus | Duration | Cumulative |
|--------|-------|----------|-----------|
| 0 | Setup | 1 day | 1 day |
| 1 | Types | 1 day | 2 days |
| 2 | Research | 2 days | 4 days |
| 3 | Report | 2 days | 6 days |
| 4 | CLI | 1 day | 7 days |
| 5 | Testing | 2 days | 9 days |
| 6 | Release | 1 day | 10 days |

**Total: 10 working days (2 calendar weeks)**

---

## Next Steps (Post-Launch)

- [ ] Gather user feedback
- [ ] Publish npm package
- [ ] Create GitHub discussions
- [ ] Add web dashboard (future feature)
- [ ] Integrate with Claude Code marketplace
- [ ] Schedule API research (background job)

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-24  
**Status:** READY FOR DEVELOPMENT
