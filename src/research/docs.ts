import { DocUpdate } from '../types';

const UPDATES: readonly DocUpdate[] = [
  {
    title: 'Hooks 시스템 — PreToolUse / PostToolUse / Stop / SessionStart',
    summary: '도구 실행 전후, 세션 시작·종료 시 쉘 커맨드를 자동 실행하는 이벤트 훅 시스템.',
    detail: 'settings.json의 hooks 섹션에서 설정. TypeScript 파일 저장 후 자동 tsc 검사, 커밋 전 lint 실행, 세션 시작 시 git status 주입 등을 코드 없이 자동화할 수 있습니다. 훅 실패 피드백이 Claude에게 전달되어 스스로 오류를 수정합니다.',
    docUrl: 'https://docs.anthropic.com/en/docs/claude-code/hooks',
    category: 'new-feature',
    date: '2025-05',
  },
  {
    title: 'Sub-agents & Task 도구 — 멀티에이전트 병렬 실행',
    summary: '독립적인 작업을 별도 에이전트에게 위임해 병렬로 실행하는 Task 도구.',
    detail: 'Task 도구로 하위 에이전트를 생성하면 현재 컨텍스트와 독립된 샌드박스에서 실행됩니다. run_in_background 옵션으로 빌드·테스트를 백그라운드에서 돌리면서 다른 작업을 동시에 진행할 수 있습니다. 복잡한 기능 구현을 planner → executor → reviewer로 나눠 병렬 실행하는 패턴이 주목받고 있습니다.',
    docUrl: 'https://docs.anthropic.com/en/docs/claude-code/sub-agents',
    category: 'new-feature',
    date: '2025-06',
  },
  {
    title: 'MCP 서버 통합 — 외부 도구를 Claude에 연결',
    summary: 'Model Context Protocol로 GitHub, Figma, Supabase 등 외부 서비스를 Claude 도구로 직접 연결.',
    detail: '`claude mcp add <서버명>` 한 줄로 설치. 로컬·원격·Docker 세 가지 방식을 지원합니다. 프로젝트별 MCP 설정을 .claude/settings.json에 저장해 팀 전체가 동일한 도구를 자동으로 사용할 수 있습니다. 현재 300개 이상의 서드파티 MCP 서버가 커뮤니티에 공개되어 있습니다.',
    docUrl: 'https://docs.anthropic.com/en/docs/claude-code/mcp',
    category: 'new-feature',
    date: '2025-04',
  },
  {
    title: 'Extended Thinking — 복잡한 문제의 깊은 추론',
    summary: '응답 전 최대 31,999 토큰의 내부 추론 과정을 거쳐 더 정확한 결과를 도출하는 기능.',
    detail: 'Option+T(macOS)/Alt+T(Windows)로 토글. settings.json의 alwaysThinkingEnabled로 기본값 설정 가능. MAX_THINKING_TOKENS 환경변수로 예산 상한 조정. 아키텍처 설계, 보안 감사, 복잡한 버그 추적에서 체감 품질이 크게 향상됩니다.',
    docUrl: 'https://docs.anthropic.com/en/docs/claude-code/settings',
    category: 'improvement',
    date: '2025-07',
  },
  {
    title: 'Plan Mode — 실행 전 계획 검토',
    summary: '코드를 작성하기 전 구현 계획을 사람이 검토·승인하는 단계를 강제하는 모드.',
    detail: '/plan 명령 또는 Shift+Tab으로 활성화. Claude가 변경할 파일 목록, 접근 방식, 예상 결과를 먼저 제시하고 승인을 받은 후에만 실행합니다. 대규모 리팩토링이나 프로덕션 배포 전 안전 게이트로 활용할 수 있습니다.',
    docUrl: 'https://docs.anthropic.com/en/docs/claude-code/plan-mode',
    category: 'new-feature',
    date: '2025-06',
  },
  {
    title: 'Git Worktree 격리 — 에이전트별 독립 작업 환경',
    summary: '에이전트 작업을 별도 git worktree에서 실행해 메인 브랜치 오염을 원천 차단.',
    detail: 'isolation: "worktree" 옵션으로 에이전트를 임시 worktree에 격리. 변경사항이 없으면 자동 정리되고, 변경이 있으면 브랜치 경로를 반환합니다. 여러 에이전트가 동시에 다른 기능을 개발할 때 충돌 없이 병렬 실행이 가능합니다.',
    docUrl: 'https://docs.anthropic.com/en/docs/claude-code/worktrees',
    category: 'new-feature',
    date: '2025-08',
  },
  {
    title: 'CLAUDE.md 계층형 메모리 — 프로젝트·폴더·전역 규칙 분리',
    summary: '~/.claude/CLAUDE.md(전역), 프로젝트 루트, 서브디렉토리까지 계층적으로 로드되는 규칙 파일.',
    detail: '더 구체적인(깊은) 경로의 CLAUDE.md가 상위 규칙을 오버라이드합니다. 전역에는 코딩 스타일, 프로젝트에는 아키텍처 규칙, 서브디렉토리에는 모듈별 제약을 분리해 관리하세요. 500토큰 이하로 유지할수록 컨텍스트 효율이 높아집니다.',
    docUrl: 'https://docs.anthropic.com/en/docs/claude-code/memory',
    category: 'tip',
    date: '2025-05',
  },
  {
    title: '/compact — 컨텍스트 윈도우 최적화',
    summary: '대화 이력을 요약해 컨텍스트 창을 절약하면서 핵심 정보는 유지하는 명령.',
    detail: '긴 세션에서 컨텍스트가 80%를 넘기 전 /compact를 실행하면 이전 대화를 압축 요약으로 교체합니다. --summary 옵션으로 요약 내용을 직접 지정할 수 있으며, 자동 컴팩션 임계값은 settings.json에서 조정 가능합니다.',
    docUrl: 'https://docs.anthropic.com/en/docs/claude-code/context-management',
    category: 'tip',
    date: '2025-04',
  },
  {
    title: 'IDE 통합 — VS Code & JetBrains 확장',
    summary: 'Claude Code를 VS Code와 JetBrains IDE에 내장해 에디터를 벗어나지 않고 AI 코딩 가능.',
    detail: 'VS Code 마켓플레이스에서 "Claude Code" 검색 후 설치. 인라인 diff 보기, 사이드패널 채팅, 터미널 통합이 지원됩니다. JetBrains 플러그인은 IntelliJ·PyCharm·WebStorm 등 전 제품군을 지원하며 코드베이스 인덱싱이 에디터와 공유됩니다.',
    docUrl: 'https://docs.anthropic.com/en/docs/claude-code/ide-integrations',
    category: 'improvement',
    date: '2025-07',
  },
  {
    title: '병렬 도구 호출 — 독립 작업 동시 실행 팁',
    summary: '의존성 없는 작업은 단일 응답에 여러 도구를 동시에 호출해 속도를 극대화.',
    detail: 'Claude는 독립적인 파일 읽기, 검색, API 호출을 하나의 응답에서 병렬로 실행합니다. 직접 지시할 때 "동시에", "병렬로" 같은 키워드를 사용하면 순차 실행을 방지할 수 있습니다. 3개 이상의 독립 작업에서 2~5배 속도 향상이 보고됩니다.',
    docUrl: 'https://docs.anthropic.com/en/docs/claude-code/best-practices',
    category: 'tip',
    date: '2025-06',
  },
];

export function getDocUpdates(): readonly DocUpdate[] {
  return UPDATES;
}
