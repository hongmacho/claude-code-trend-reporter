import { RepoItem, TrendItem, TrendCategory, ResearchResult } from '../types';
import { getDocUpdates } from './docs';
import { getInstalledSlugs } from './installed';

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

type KoInfo = { description: string; whyPopular: string; howToInstall: string };

// 주요 저장소의 한국어 설명 룩업 (fullName 또는 name 패턴 매핑)
const KNOWN_REPOS_KO: Array<{ match: RegExp; info: KoInfo }> = [
  {
    match: /anthropics?\/claude-code/i,
    info: {
      description: 'Anthropic 공식 Claude Code CLI. 터미널에서 Claude와 페어 프로그래밍하며 전체 코드베이스를 이해·수정·테스트할 수 있는 AI 개발 도구입니다.',
      whyPopular: '공식 도구라 업데이트가 즉각 반영되고 가장 안정적입니다. 코드베이스 전체를 컨텍스트로 활용해 단순 자동완성을 넘어 실제 엔지니어 수준의 작업을 수행합니다.',
      howToInstall: 'npm install -g @anthropic-ai/claude-code  # 또는 공식 사이트에서 설치',
    },
  },
  {
    match: /oh-my-claudecode/i,
    info: {
      description: '멀티 에이전트 오케스트레이션 레이어. ultrawork·ralph·autopilot 등 수십 개의 전문 스킬로 Claude Code를 자율 실행 시스템으로 확장합니다.',
      whyPopular: 'planner·architect·executor가 병렬로 동작해 기획→구현→QA를 사람 개입 없이 완료합니다. 특히 ralph 스킬은 실패 시 자동 디버깅·재시도까지 수행해 야간 자율 개발이 가능합니다.',
      howToInstall: 'claude mcp add oh-my-claudecode  # ~/.claude/CLAUDE.md에 지시 추가로 활성화',
    },
  },
  {
    match: /github.*mcp|mcp.*github/i,
    info: {
      description: 'GitHub PR·이슈·코드 검색을 Claude Code 채팅창에서 직접 제어하는 MCP 서버. 브라우저 전환 없이 전체 GitHub 워크플로우를 자연어로 처리합니다.',
      whyPopular: '개발자의 컨텍스트 스위칭을 90% 줄여줍니다. "이 PR 보안 리뷰해서 approve해줘"가 한 문장으로 끝나며, 2025년 MCP 서버 설치율 1위를 기록하고 있습니다.',
      howToInstall: 'claude mcp add github  # GITHUB_TOKEN 환경변수 필요',
    },
  },
  {
    match: /playwright.*mcp|mcp.*playwright/i,
    info: {
      description: '헤드리스 브라우저 자동화와 E2E 테스트를 Claude Code에서 직접 수행. 화면을 보면서 UI 버그를 진단하고 테스트 코드를 생성합니다.',
      whyPopular: '"로그인 버튼 클릭하면 어떻게 되는지 확인해줘"라고 말하면 Claude가 실제 브라우저를 조작합니다. 프론트엔드 디버깅과 QA 자동화 시간을 수 시간에서 수 분으로 줄여줍니다.',
      howToInstall: 'claude mcp add playwright  # Node.js 20+ 필요',
    },
  },
  {
    match: /figma.*mcp|mcp.*figma/i,
    info: {
      description: 'Figma 디자인에서 레이아웃·색상·컴포넌트 명세를 추출해 코드로 변환. 디자인 핸드오프를 자동화합니다.',
      whyPopular: '"이 Figma 프레임 기반으로 React 컴포넌트 만들어줘"가 실제로 동작합니다. 디자인-개발 사이클을 수 시간에서 수 분으로 단축하며, 디자인 변경 시 코드 동기화도 자동화할 수 있습니다.',
      howToInstall: 'claude mcp add figma  # FIGMA_API_KEY 필요',
    },
  },
  {
    match: /supabase.*mcp|mcp.*supabase/i,
    info: {
      description: 'Supabase DB 스키마 수정, RLS 정책, Edge Function 배포를 Claude Code에서 자연어로 제어합니다.',
      whyPopular: '풀스택 솔로 개발자에게 특히 강력합니다. "users 테이블에 last_login 추가하고 인덱스도 걸어줘" 한 마디로 마이그레이션까지 완료됩니다. Supabase 공식 지원으로 안정성이 보장됩니다.',
      howToInstall: 'claude mcp add supabase  # SUPABASE_URL, SUPABASE_SERVICE_KEY 필요',
    },
  },
  {
    match: /context7|upstash.*context/i,
    info: {
      description: '10,000개 이상 라이브러리의 최신 공식 문서를 실시간으로 가져와 Claude에게 주입. 할루시네이션 없는 정확한 API 사용법을 제안합니다.',
      whyPopular: '오래된 학습 데이터로 인한 "없는 API를 자신 있게 알려주는" 문제를 해결합니다. Next.js·shadcn 같이 빠르게 변하는 생태계에서 항상 최신 패턴으로 코딩할 수 있어 신뢰도가 높습니다.',
      howToInstall: 'claude mcp add context7',
    },
  },
  {
    match: /everything.claude.code|^ecc$/i,
    info: {
      description: '300개 이상의 전문 스킬을 담은 올인원 플러그인. 언어별 코드 리뷰어, 보안 감사, 성능 최적화, DB 설계, E2E 테스트 등 전 도메인 커버.',
      whyPopular: '플러그인 하나로 엔터프라이즈 수준의 AI 엔지니어링 워크플로우를 즉시 구축할 수 있습니다. 레거시 코드베이스 현대화 프로젝트에서 팀 생산성을 2~3배 끌어올린 사례가 다수 보고됩니다.',
      howToInstall: 'claude mcp add everything-claude-code',
    },
  },
  {
    match: /n8n.mcp|mcp.n8n/i,
    info: {
      description: 'n8n 자동화 워크플로우를 MCP 서버로 노출해 Claude Code에서 직접 n8n 워크플로우를 트리거·관리할 수 있는 브릿지 서버입니다.',
      whyPopular: 'n8n의 1,000개 이상 인테그레이션을 Claude Code에서 자연어로 제어할 수 있게 됩니다. "슬랙 메시지 오면 GitHub 이슈 자동 생성해줘" 같은 복잡한 자동화를 코드 없이 구성할 수 있어 DevOps·마케팅 팀 모두에게 인기입니다.',
      howToInstall: 'npx @czlonkowski/n8n-mcp  # N8N_API_URL, N8N_API_KEY 환경변수 필요',
    },
  },
  {
    match: /awesome.claude.code/i,
    info: {
      description: 'Claude Code 생태계의 유용한 도구, 스킬, MCP 서버, 팁을 엄선해 정리한 커뮤니티 큐레이션 목록입니다.',
      whyPopular: 'Claude Code를 처음 접하거나 생태계를 한눈에 파악하고 싶을 때 가장 먼저 찾게 되는 레퍼런스입니다. 커뮤니티가 직접 검증한 도구만 등재되어 노이즈 없이 핵심만 빠르게 파악할 수 있습니다.',
      howToInstall: 'https://github.com/hesreallyhim/awesome-claude-code 에서 목록 확인',
    },
  },
  {
    match: /claude.plugins.official|anthropics\/claude-plugins/i,
    info: {
      description: 'Anthropic 공식 Claude Code 플러그인 모음. feature-dev, code-review, security-audit 등 검증된 워크플로우 플러그인을 제공합니다.',
      whyPopular: '공식 지원이라 Claude Code 업데이트에 즉시 반영되고, 안정성이 보장됩니다. 신규 개발자도 시니어 수준의 워크플로우를 바로 따를 수 있어 팀 온보딩 비용을 크게 줄여줍니다.',
      howToInstall: 'claude plugin install <plugin-name>  # 공식 마켓플레이스에서 검색',
    },
  },
  {
    match: /claude.mem|claudemem/i,
    info: {
      description: 'Claude Code의 대화 간 기억을 영구 저장하고 검색하는 메모리 관리 도구. 프로젝트 컨텍스트, 결정사항, 패턴을 자동으로 기억합니다.',
      whyPopular: '"지난번에 왜 이렇게 구현했지?"를 Claude가 스스로 기억하게 됩니다. 장기 프로젝트에서 컨텍스트 유지가 가장 큰 고충이었는데, 이를 해결하는 실용적인 도구로 빠르게 주목받고 있습니다.',
      howToInstall: 'claude mcp add claude-mem  # ~/.claude/memory 디렉토리 자동 생성',
    },
  },
  {
    match: /cc.switch/i,
    info: {
      description: 'Claude Code·Codex·Gemini CLI·OpenCode·OpenClaw 5개 AI CLI 도구를 한 곳에서 관리하는 크로스플랫폼 데스크톱 앱 (Tauri 2 + SQLite). API 프로바이더 전환, MCP 서버·Skills 통합 관리, 시스템 트레이 빠른 전환을 시각적 GUI로 제공합니다.',
      whyPopular: 'AI CLI 도구가 다양해지면서 각 도구마다 다른 형식의 설정 파일(JSON/TOML/.env)을 손으로 편집해야 했던 고통을 완전히 해결했습니다. 50개 이상의 API 프로바이더 프리셋과 원클릭 전환, SQLite 원자적 쓰기로 설정 손상 방지까지 — 커뮤니티에서 "없어서는 안 될 도구"로 평가받으며 79k 스타를 달성했습니다.',
      howToInstall: 'ccswitch.io 공식 사이트에서 Windows·macOS·Linux 설치 파일 다운로드',
    },
  },
  {
    match: /karpathy.skill|andrej.karpathy/i,
    info: {
      description: 'Andrej Karpathy의 AI/ML 강의 스타일에서 영감받은 Claude Code 스킬 모음. 딥러닝 코드 분석, 논문 구현, 수학적 설명을 전문으로 합니다.',
      whyPopular: 'AI 연구자와 ML 엔지니어 사이에서 "드디어 내 코드를 제대로 이해하는 AI"라는 평가를 받고 있습니다. 복잡한 신경망 구조와 최적화 알고리즘을 직관적으로 설명하는 능력이 독보적입니다.',
      howToInstall: 'CLAUDE.md에 스킬 파일 경로 추가  # 저장소 README 참조',
    },
  },
  {
    match: /ui.ux.pro.max|nextlevelbuilder\/ui/i,
    info: {
      description: 'Claude Code·Cursor·Codex·Copilot 등 모든 AI 코딩 도구에 디자인 지능을 추가하는 스킬. 161개 산업별 추론 규칙과 67개 UI 스타일 라이브러리를 바탕으로, 업종을 분석해 색상·폰트·레이아웃·금기 패턴을 포함한 완전한 디자인 시스템을 자동 생성합니다.',
      whyPopular: 'AI가 UI 코드를 짜면 항상 "무난하지만 밋밋한" 결과물이 나왔습니다. 이 스킬은 코드 작성 전에 먼저 161개 업종 규칙으로 최적 디자인 시스템을 결정하고 구현합니다. "뷰티 스파 랜딩 → Soft Pink + Cormorant Garamond + 네온 금지" 같은 업종 맞춤 설계가 자동으로 이뤄져, 백엔드 개발자도 디자이너 없이 전문적인 UI를 만들 수 있게 됐다는 평이 퍼지며 82k 스타를 달성했습니다.',
      howToInstall: 'npx uipro-cli install  # 또는 uupm.cc에서 설치 가이드 확인',
    },
  },
  {
    match: /hermes.agent|nousresearch.*hermes/i,
    info: {
      description: 'NousResearch의 고성능 에이전트 프레임워크. 도구 사용, 함수 호출, 다단계 추론을 최적화한 Claude Code 에이전트 스킬입니다.',
      whyPopular: '복잡한 멀티스텝 작업에서 다른 에이전트 대비 높은 완료율을 보입니다. 특히 코드베이스 전체를 탐색하며 버그를 추적하는 디버깅 시나리오에서 탁월한 성능으로 연구자들의 주목을 받고 있습니다.',
      howToInstall: 'CLAUDE.md에 에이전트 설정 추가  # 저장소 README 참조',
    },
  },
  {
    match: /oh.my.droid/i,
    info: {
      description: 'Android·iOS 모바일 앱 개발에 특화된 Claude Code 스킬 모음. React Native·Flutter·Kotlin·Swift 코드 생성 및 리뷰를 전문으로 합니다.',
      whyPopular: '모바일 개발자들이 "웹처럼 빠르게 앱을 만들 수 있게 됐다"고 평가합니다. 플랫폼별 네이티브 관용구를 지켜주며, Play Store·App Store 출시에 필요한 설정까지 자동으로 처리해줍니다.',
      howToInstall: 'claude mcp add oh-my-droid  # 저장소 README 참조',
    },
  },
  {
    match: /wshobson\/agents|claude.code.agents/i,
    info: {
      description: 'Claude Code 에이전트 구성 예제와 프로덕션 검증 패턴 모음. 실전 멀티에이전트 오케스트레이션 레시피를 제공합니다.',
      whyPopular: '에이전트 설계에서 시행착오를 줄여주는 실전 레퍼런스입니다. "이 패턴이 실제 프로덕션에서 동작한다"는 보장과 함께 바로 복사해 쓸 수 있는 설정 파일을 제공해 커뮤니티 신뢰도가 높습니다.',
      howToInstall: '저장소 클론 후 원하는 에이전트 설정을 ~/.claude/agents/에 복사',
    },
  },
  {
    match: /pal.mcp.server|beehive.*pal/i,
    info: {
      description: '개인 비서(PAL) 역할을 하는 MCP 서버. 일정 관리, 알림, 파일 시스템 작업을 Claude Code에서 자연어로 제어합니다.',
      whyPopular: '복잡한 설정 없이 macOS 캘린더·알림·파일 시스템에 접근할 수 있어 일상 업무 자동화에 실용적입니다. 개인 생산성 도구로서 Claude Code를 비서처럼 활용하려는 사용자들에게 호평받고 있습니다.',
      howToInstall: 'claude mcp add pal-mcp-server  # 저장소 README 참조',
    },
  },
  {
    match: /^git-mcp$|idosal\/git.mcp/i,
    info: {
      description: 'Git 저장소를 MCP 서버로 노출해 Claude Code에서 git log, diff, blame을 자연어로 질의할 수 있게 합니다.',
      whyPopular: '"왜 이 코드가 이렇게 바뀌었지?"를 자연어로 물으면 git 히스토리를 분석해 설명해줍니다. 레거시 코드 파악, 버그 추적, 코드 리뷰 준비 등 git 작업 전반을 가속화합니다.',
      howToInstall: 'npx git-mcp  # 또는 claude mcp add git-mcp',
    },
  },
  {
    match: /tweetclaw|xquik/i,
    info: {
      description: 'Claude Code에서 Twitter/X 게시물을 작성·예약·분석하는 소셜 미디어 자동화 스킬. 기술 콘텐츠 생성에 특화되어 있습니다.',
      whyPopular: '개발자가 빌드한 내용을 Twitter로 공유하는 "BuildInPublic" 문화와 맞물려 주목받고 있습니다. 코드 변경사항을 트윗으로 자동 변환하거나 주간 빌드 업데이트를 자동으로 작성하는 워크플로우가 인기입니다.',
      howToInstall: 'CLAUDE.md에 스킬 지시 추가  # 저장소 README 참조',
    },
  },
];

function isInstalledItem(item: TrendItem, installedSlugs: Set<string>): boolean {
  const nameLower = item.name.toLowerCase();
  const urlLower = item.url.toLowerCase();
  for (const slug of installedSlugs) {
    if (nameLower.includes(slug) || urlLower.includes(slug)) return true;
  }
  return false;
}

function findKoInfo(repo: RepoItem): KoInfo | null {
  for (const entry of KNOWN_REPOS_KO) {
    if (entry.match.test(repo.fullName) || entry.match.test(repo.name)) {
      return entry.info;
    }
  }
  return null;
}

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
  const ko = findKoInfo(repo);
  return {
    name: repo.name,
    description: ko?.description ?? repo.description,
    whyPopular: ko?.whyPopular ?? `GitHub 스타 ${repo.stars.toLocaleString()}개 — 커뮤니티 검증 완료`,
    howToInstall: ko?.howToInstall ?? `${repo.url} 에서 설치 방법 확인`,
    url: repo.url,
    stars: repo.stars,
    category,
  };
}

export function aggregateResults(
  repoMap: Map<string, RepoItem[]>,
  usedMock: boolean
): ResearchResult {
  const installed = getInstalledSlugs();
  const notInstalled = (item: TrendItem) => !isInstalledItem(item, installed);

  if (usedMock) {
    return {
      skills: MOCK_DATA.skills.filter(notInstalled),
      mcpServers: MOCK_DATA['mcp-servers'].filter(notInstalled),
      plugins: MOCK_DATA.plugins.filter(notInstalled),
      settings: MOCK_DATA.settings,
      docUpdates: getDocUpdates(),
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

  const MIN_STARS = 1000;
  const hasEnoughStars = (item: TrendItem) => item.stars >= MIN_STARS;

  return {
    skills: skills.filter(notInstalled).filter(hasEnoughStars),
    mcpServers: mcpServers.filter(notInstalled).filter(hasEnoughStars),
    plugins: plugins.filter(notInstalled).filter(hasEnoughStars),
    settings: MOCK_DATA.settings,
    docUpdates: getDocUpdates(),
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
