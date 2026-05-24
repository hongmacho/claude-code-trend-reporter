import { RepoItem, TrendItem, TrendCategory, ResearchResult } from '../types';

// mock 데이터 (오프라인/API 실패 시 폴백)
const MOCK_DATA: Record<TrendCategory, TrendItem[]> = {
  skills: [
    {
      name: 'feature-dev',
      description: 'Official Anthropic plugin with 7-phase structured workflow for feature development',
      whyPopular: '89,000+ installs — discovery to QA automated in one command',
      howToInstall: 'claude mcp add feature-dev',
      url: 'https://github.com/anthropics/claude-code',
      stars: 89000,
      category: 'skills',
    },
    {
      name: 'oh-my-claudecode ultrawork',
      description: 'Parallel execution engine for multi-agent orchestration',
      whyPopular: '3-5x faster via parallel agent execution, smart model routing',
      howToInstall: 'claude mcp add oh-my-claudecode',
      url: 'https://github.com/getfounded/oh-my-claudecode',
      stars: 12000,
      category: 'skills',
    },
    {
      name: 'caveman',
      description: 'Reduces output tokens by ~75% while maintaining technical accuracy',
      whyPopular: 'Significant cost savings on high-volume usage',
      howToInstall: 'Add to CLAUDE.md or install via marketplace',
      url: 'https://github.com/example/caveman',
      stars: 8500,
      category: 'skills',
    },
  ],
  'mcp-servers': [
    {
      name: 'GitHub MCP',
      description: 'Manage PRs, issues, and code search directly from Claude Code',
      whyPopular: 'Highest-impact MCP — eliminates context-switching to GitHub web UI',
      howToInstall: 'claude mcp add github',
      url: 'https://github.com/github/github-mcp-server',
      stars: 45000,
      category: 'mcp-servers',
    },
    {
      name: 'Playwright MCP',
      description: 'Browser automation, E2E testing, and screenshot capture',
      whyPopular: 'Essential for web testing workflows and UI verification',
      howToInstall: 'claude mcp add playwright',
      url: 'https://github.com/microsoft/playwright-mcp',
      stars: 32000,
      category: 'mcp-servers',
    },
    {
      name: 'Figma MCP',
      description: 'Read Figma designs, extract tokens, generate code from layouts',
      whyPopular: 'Turns design handoffs from guesswork into structured code generation',
      howToInstall: 'claude mcp add figma',
      url: 'https://github.com/figma/figma-developer-mcp',
      stars: 28000,
      category: 'mcp-servers',
    },
  ],
  plugins: [
    {
      name: 'everything-claude-code',
      description: '300+ specialized skills covering all development domains',
      whyPopular: 'One-stop plugin for enterprise-grade AI engineering workflows',
      howToInstall: 'claude mcp add everything-claude-code',
      url: 'https://github.com/everything-claude-code/ecc',
      stars: 15000,
      category: 'plugins',
    },
    {
      name: 'Supabase MCP',
      description: 'Full Supabase project management from Claude Code',
      whyPopular: 'Database + auth + storage — all manageable in one chat',
      howToInstall: 'claude mcp add supabase',
      url: 'https://github.com/supabase/supabase-mcp',
      stars: 22000,
      category: 'plugins',
    },
  ],
  settings: [
    {
      name: 'Async Hooks (2026)',
      description: 'Background hooks that run without blocking Claude execution',
      whyPopular: 'Released Jan 2026 — auto-test runs and logging without slowdown',
      howToInstall: 'Configure in ~/.claude/settings.json under hooks.async',
      url: 'https://code.claude.com/docs/en/hooks',
      stars: 0,
      category: 'settings',
    },
    {
      name: 'CLAUDE.md Optimization',
      description: 'Keep CLAUDE.md under 500 tokens with only essential context',
      whyPopular: 'Reduces noise, improves response quality, saves tokens per request',
      howToInstall: 'Edit ~/.claude/CLAUDE.md — focus on coding style + project context',
      url: 'https://code.claude.com/docs/en/memory',
      stars: 0,
      category: 'settings',
    },
    {
      name: 'SessionStart Hook',
      description: 'Auto-inject project context at the start of each session',
      whyPopular: 'Loads recent issues, git status, and environment info automatically',
      howToInstall: 'Add sessionStart hook in ~/.claude/settings.json',
      url: 'https://code.claude.com/docs/en/hooks',
      stars: 0,
      category: 'settings',
    },
  ],
};

function classifyRepo(repo: RepoItem): TrendCategory {
  const name = repo.name.toLowerCase();
  const desc = repo.description.toLowerCase();
  if (name.includes('mcp') || desc.includes('mcp server') || desc.includes('model context protocol')) {
    return 'mcp-servers';
  }
  if (name.includes('plugin') || desc.includes('plugin')) return 'plugins';
  if (name.includes('skill') || desc.includes('skill')) return 'skills';
  return 'skills';
}

function repoToTrendItem(repo: RepoItem, category: TrendCategory): TrendItem {
  return {
    name: repo.name,
    description: repo.description,
    whyPopular: `${repo.stars.toLocaleString()} GitHub stars — community validated`,
    howToInstall: `Visit ${repo.url} for installation instructions`,
    url: repo.url,
    stars: repo.stars,
    category,
  };
}

export function aggregateResults(
  repoMap: Map<string, RepoItem[]>,
  usedMock: boolean
): ResearchResult {
  if (usedMock) {
    return {
      skills: MOCK_DATA.skills,
      mcpServers: MOCK_DATA['mcp-servers'],
      plugins: MOCK_DATA.plugins,
      settings: MOCK_DATA.settings,
      researchedAt: new Date().toISOString(),
      sources: ['Built-in curated data (offline mode)'],
      isMockData: true,
    };
  }

  const allRepos = Array.from(repoMap.values()).flat();
  const seen = new Set<string>();
  const unique = allRepos.filter(r => {
    if (seen.has(r.fullName)) return false;
    seen.add(r.fullName);
    return true;
  });
  const sorted = [...unique].sort((a, b) => b.stars - a.stars);

  const skills: TrendItem[] = [];
  const mcpServers: TrendItem[] = [];
  const plugins: TrendItem[] = [];

  for (const repo of sorted) {
    const cat = classifyRepo(repo);
    const item = repoToTrendItem(repo, cat);
    if (cat === 'mcp-servers') mcpServers.push(item);
    else if (cat === 'plugins') plugins.push(item);
    else skills.push(item);
  }

  return {
    skills: skills.slice(0, 6),
    mcpServers: mcpServers.slice(0, 6),
    plugins: plugins.slice(0, 4),
    settings: MOCK_DATA.settings,
    researchedAt: new Date().toISOString(),
    sources: [
      'https://api.github.com/search/repositories?q=claude+code+skills',
      'https://api.github.com/search/repositories?q=claude+code+mcp',
      'https://api.github.com/search/repositories?q=oh-my-claudecode',
      'https://api.github.com/search/repositories?q=topic:claude-code',
    ],
    isMockData: false,
  };
}

export { MOCK_DATA };
