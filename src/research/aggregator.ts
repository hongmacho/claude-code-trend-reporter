import { RepoItem, TrendItem, TrendCategory, ResearchResult } from '../types';

// mock 데이터 (오프라인/API 실패 시 폴백)
const MOCK_DATA: Record<TrendCategory, TrendItem[]> = {
  skills: [
    {
      name: 'oh-my-claudecode — ultrawork',
      description: '독립적인 작업을 병렬로 실행하는 멀티 에이전트 오케스트레이션 엔진. planner·architect·executor가 동시에 작동해 기획부터 구현·QA까지 한 번의 명령으로 완성합니다.',
      whyPopular: '순차 실행 대비 3~5배 빠른 속도. 단순 반복 작업을 자동화하고 Haiku·Sonnet·Opus를 비용에 맞게 자동 라우팅해 AI 사용 비용까지 절감합니다. 2025년 가장 많이 언급된 Claude Code 생산성 도구입니다.',
      howToInstall: 'claude mcp add oh-my-claudecode  # 또는 ~/.claude/CLAUDE.md에 /oh-my-claudecode:ultrawork 지시 추가',
      url: 'https://github.com/getfounded/oh-my-claudecode',
      stars: 12400,
      category: 'skills',
    },
    {
      name: 'ralph — 자율 실행 루프',
      description: '사람 개입 없이 PRD 작성 → 구현 → QA → GitHub push까지 전 과정을 자율 완료하는 워크플로우. 실패 시 스스로 디버깅하고 재시도합니다.',
      whyPopular: '개발자가 자리를 비운 사이에도 작업이 완료됩니다. "ralph로 로그인 기능 만들어줘" 한 마디로 테스트 통과한 코드가 GitHub에 push되는 경험은 한 번 써보면 돌아가기 힘들다는 평가가 지배적입니다.',
      howToInstall: '/oh-my-claudecode:ralph  # Claude Code 채팅창에서 바로 실행',
      url: 'https://github.com/getfounded/oh-my-claudecode',
      stars: 11800,
      category: 'skills',
    },
    {
      name: 'feature-dev — 7단계 피처 워크플로우',
      description: 'Anthropic 공식 플러그인. Discovery → Planning → TDD → Implementation → Review → QA → Ship의 7단계를 구조적으로 수행합니다.',
      whyPopular: '공식 지원인 만큼 Claude Code 업데이트에 즉시 반영됩니다. 팀 온보딩 비용을 줄이고 신규 개발자도 시니어 수준의 워크플로우를 따를 수 있게 해준다는 점이 가장 큰 강점입니다.',
      howToInstall: 'claude mcp add feature-dev  # 공식 마켓플레이스에서 설치',
      url: 'https://docs.anthropic.com/ko/docs/claude-code',
      stars: 89000,
      category: 'skills',
    },
    {
      name: 'caveman — 토큰 절약 스킬',
      description: '불필요한 설명과 반복 문구를 제거해 출력 토큰을 최대 75% 줄이는 프롬프트 최적화 스킬. 기술적 정확도는 그대로 유지합니다.',
      whyPopular: 'API 비용이 민감한 팀에서 월 수십만 원 절감 사례가 보고됩니다. 특히 대규모 코드베이스를 다루는 작업에서 context 낭비를 막아 응답 품질도 함께 올라가는 부수 효과가 있습니다.',
      howToInstall: 'CLAUDE.md 최상단에 "Use caveman style: terse, technical, no filler phrases" 추가',
      url: 'https://github.com/getfounded/oh-my-claudecode',
      stars: 8500,
      category: 'skills',
    },
  ],
  'mcp-servers': [
    {
      name: 'GitHub MCP Server',
      description: 'PR 생성·리뷰·머지, 이슈 관리, 코드 검색을 Claude Code 채팅창에서 직접 수행. GitHub 웹 UI로 전환할 필요가 없어집니다.',
      whyPopular: '개발자의 컨텍스트 스위칭을 90% 줄여줍니다. "이 PR에서 보안 취약점 찾아줘"부터 "develop 브랜치에 main 머지해줘"까지 자연어로 GitHub을 완전히 제어할 수 있어 2025년 MCP 서버 중 설치율 1위입니다.',
      howToInstall: 'claude mcp add github  # GITHUB_TOKEN 환경변수 설정 필요',
      url: 'https://github.com/github/github-mcp-server',
      stars: 45000,
      category: 'mcp-servers',
    },
    {
      name: 'Playwright MCP',
      description: '헤드리스 브라우저 자동화, E2E 테스트 실행, 스크린샷·녹화를 Claude Code에서 직접 수행. UI 버그를 눈으로 보면서 수정합니다.',
      whyPopular: '"이 버튼 클릭하면 어떻게 되는지 확인해줘"라고 말하면 Claude가 실제 브라우저를 조작하고 결과를 보고합니다. 프론트엔드 디버깅 시간이 극적으로 줄어들고, QA 엔지니어 없이도 회귀 테스트를 자동화할 수 있습니다.',
      howToInstall: 'claude mcp add playwright  # Node.js 20+ 환경에서 자동 설치',
      url: 'https://github.com/microsoft/playwright-mcp',
      stars: 32000,
      category: 'mcp-servers',
    },
    {
      name: 'Figma MCP',
      description: 'Figma 디자인 파일을 읽어 디자인 토큰·레이아웃 구조·컴포넌트 명세를 추출하고 실제 코드로 변환합니다.',
      whyPopular: '디자인 핸드오프에서 발생하는 "이 여백이 몇 px이었지?" 같은 소모적인 소통이 사라집니다. 디자이너가 Figma를 업데이트하면 Claude가 바로 코드를 반영하는 워크플로우가 가능해 디자인-개발 사이클이 수 시간에서 수 분으로 단축됩니다.',
      howToInstall: 'claude mcp add figma  # FIGMA_API_KEY 환경변수 설정 필요',
      url: 'https://github.com/figma/figma-developer-mcp',
      stars: 28000,
      category: 'mcp-servers',
    },
    {
      name: 'Supabase MCP',
      description: 'Supabase 프로젝트의 DB 스키마 수정, 데이터 조회, RLS 정책 설정, Edge Function 배포를 채팅으로 제어합니다.',
      whyPopular: '백엔드 대시보드 없이 "users 테이블에 last_login 컬럼 추가하고 RLS도 설정해줘" 한 마디로 끝납니다. 풀스택 솔로 개발자에게 특히 강력하며, Supabase 공식 지원으로 안정성이 보장됩니다.',
      howToInstall: 'claude mcp add supabase  # SUPABASE_URL, SUPABASE_SERVICE_KEY 필요',
      url: 'https://github.com/supabase/supabase-mcp',
      stars: 22000,
      category: 'mcp-servers',
    },
  ],
  plugins: [
    {
      name: 'everything-claude-code (ECC)',
      description: '300개 이상의 전문 스킬을 담은 올인원 플러그인. Python·Go·Rust·TypeScript 리뷰어, 보안 감사, 성능 최적화, DB 설계, E2E 테스트 등 전 도메인을 커버합니다.',
      whyPopular: '개별 스킬을 하나씩 설치할 필요 없이 이것 하나로 엔터프라이즈 수준의 AI 엔지니어링 워크플로우를 즉시 구축할 수 있습니다. 특히 레거시 코드베이스 현대화 프로젝트에서 팀 전체 생산성을 2~3배 끌어올린 사례가 다수 보고됩니다.',
      howToInstall: 'claude mcp add everything-claude-code',
      url: 'https://github.com/everything-claude-code/ecc',
      stars: 15000,
      category: 'plugins',
    },
    {
      name: 'Context7 MCP',
      description: '10,000개 이상 라이브러리의 최신 공식 문서를 실시간으로 가져와 Claude에게 주입. 할루시네이션 없이 정확한 API 사용법을 제안합니다.',
      whyPopular: '오래된 학습 데이터로 인한 "존재하지 않는 API를 자신 있게 알려주는" 문제를 근본적으로 해결합니다. Next.js·shadcn·Drizzle 등 빠르게 변하는 생태계에서 항상 최신 패턴으로 코딩할 수 있어 신뢰도가 높습니다.',
      howToInstall: 'claude mcp add context7',
      url: 'https://github.com/upstash/context7',
      stars: 18500,
      category: 'plugins',
    },
  ],
  settings: [
    {
      name: 'Async Hooks — 비동기 후처리 자동화',
      description: 'Claude 응답을 차단하지 않고 백그라운드에서 실행되는 훅. 파일 저장 시 자동 lint, 커밋 후 자동 테스트 실행 등을 설정합니다.',
      whyPopular: '2026년 1월 출시 후 "Claude가 코드를 쓰는 동안 테스트가 알아서 돌아간다"는 반응이 쏟아졌습니다. 응답 속도를 저해하지 않으면서 품질 게이트를 자동화할 수 있어 CI 비용까지 절감하는 효과가 있습니다.',
      howToInstall: '~/.claude/settings.json → hooks 섹션에 async: true 옵션과 실행 명령 추가',
      url: 'https://docs.anthropic.com/ko/docs/claude-code/hooks',
      stars: 0,
      category: 'settings',
    },
    {
      name: 'CLAUDE.md 최적화 — 500토큰 룰',
      description: 'CLAUDE.md를 500토큰 이하로 유지하되 코딩 스타일·프로젝트 맥락·금지 패턴만 담는 원칙. 매 요청마다 소비되는 비용을 줄이면서 응답 품질을 높입니다.',
      whyPopular: '긴 CLAUDE.md는 오히려 노이즈가 됩니다. 핵심 규칙만 압축하면 Claude가 일관된 스타일로 작업하고, 팀원이 규칙을 인지하기도 쉬워집니다. 실제로 300토큰 미만으로 줄인 팀에서 리뷰 지적 사항이 40% 감소한 사례가 있습니다.',
      howToInstall: '~/.claude/CLAUDE.md를 열고 코딩 스타일, 절대 금지 패턴, 프로젝트 구조 요약만 남기기. 주석 포함 500자 목표',
      url: 'https://docs.anthropic.com/ko/docs/claude-code/memory',
      stars: 0,
      category: 'settings',
    },
    {
      name: 'SessionStart Hook — 세션 자동 컨텍스트 주입',
      description: '새 Claude Code 세션이 시작될 때 git status·최근 이슈·환경 정보를 자동으로 주입하는 훅. 매번 "지금 어떤 상태야?"를 설명할 필요가 없어집니다.',
      whyPopular: '"이 프로젝트 어제 어디까지 했지?"를 Claude가 미리 파악하고 있어 대화의 워밍업 없이 바로 본론으로 들어갈 수 있습니다. 여러 프로젝트를 넘나드는 개발자일수록 체감 효과가 큽니다.',
      howToInstall: '~/.claude/settings.json → hooks.sessionStart에 "git status && git log --oneline -5" 명령 등록',
      url: 'https://docs.anthropic.com/ko/docs/claude-code/hooks',
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
