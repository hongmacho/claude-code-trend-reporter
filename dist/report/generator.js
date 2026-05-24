"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHtml = generateHtml;
exports.writeReport = writeReport;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const open_1 = __importDefault(require("open"));
function formatDate(isoString) {
    return new Date(isoString).toLocaleString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
}
function getTimestampForFilename() {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
function renderCard(item) {
    const starsHtml = item.stars > 0
        ? `<span class="stars">⭐ ${item.stars.toLocaleString()}</span>`
        : '';
    const linkLabel = item.url.includes('github.com') ? '🔗 GitHub에서 보기' : '🔗 자세히 보기';
    const officialBadge = item.url.includes('docs.anthropic.com')
        ? '<span class="doc-badge new-feature" style="margin-bottom:.3rem">공식 문서</span> '
        : '';
    return `
    <div class="card">
      ${officialBadge ? `<div>${officialBadge}</div>` : ''}
      <div class="card-header">
        <h3 class="card-title">${escapeHtml(item.name)}</h3>
        ${starsHtml}
      </div>
      <p class="card-desc">${escapeHtml(item.description)}</p>
      <div class="card-meta">
        <div class="meta-item">
          <span class="meta-label">💡 왜 인기인가</span>
          <span>${escapeHtml(item.whyPopular)}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">🛠 설치/사용법</span>
          <code>${escapeHtml(item.howToInstall)}</code>
        </div>
      </div>
      <a class="card-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">${linkLabel} →</a>
    </div>`;
}
const DOC_BADGE_LABELS = {
    'new-feature': '새 기능',
    'improvement': '개선',
    'tip': '팁',
};
function renderDocCard(item) {
    const badgeLabel = DOC_BADGE_LABELS[item.category];
    const dateHtml = item.date ? `<p class="doc-date">📅 ${escapeHtml(item.date)}</p>` : '';
    return `
    <div class="card">
      <span class="doc-badge ${escapeHtml(item.category)}">${badgeLabel}</span>
      <div class="card-header">
        <h3 class="card-title">${escapeHtml(item.title)}</h3>
      </div>
      <p class="card-desc">${escapeHtml(item.summary)}</p>
      <p class="doc-detail">${escapeHtml(item.detail)}</p>
      ${dateHtml}
      <a class="card-link" href="${escapeHtml(item.docUrl)}" target="_blank" rel="noopener">📄 공식 문서 보기 →</a>
    </div>`;
}
function renderDocSection(items) {
    if (items.length === 0)
        return '';
    return `
    <section class="section" id="doc_updates">
      <h2>📋 공식 문서 업데이트 & 팁</h2>
      <div class="cards">
        ${items.map(renderDocCard).join('')}
      </div>
    </section>`;
}
function renderSection(title, emoji, items, category) {
    if (items.length === 0)
        return '';
    const id = category.replace('-', '_');
    return `
    <section class="section" id="${id}">
      <h2>${emoji} ${escapeHtml(title)}</h2>
      <div class="cards">
        ${items.map(renderCard).join('')}
      </div>
    </section>`;
}
function generateHtml(result) {
    const css = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0f0f0f; --surface: #1a1a1a; --surface2: #242424;
      --text: #e0e0e0; --text-muted: #888; --accent: #f97316;
      --accent2: #3b82f6; --border: #333; --radius: 12px;
    }
    @media (prefers-color-scheme: light) {
      :root { --bg: #f5f5f5; --surface: #fff; --surface2: #f0f0f0; --text: #111; --text-muted: #555; --border: #ddd; }
    }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
    header { background: linear-gradient(135deg, #1a0a00 0%, #0a0a1a 100%); border-bottom: 1px solid var(--border); padding: 2rem 0; }
    .header-inner { max-width: 1100px; margin: 0 auto; padding: 0 2rem; }
    header h1 { font-size: 2.2rem; font-weight: 800; background: linear-gradient(90deg, #f97316, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    header p { color: var(--text-muted); margin-top: .5rem; }
    .badge { display: inline-block; background: var(--accent); color: white; font-size: .7rem; padding: .2rem .5rem; border-radius: 99px; margin-left: .5rem; vertical-align: middle; }
    .badge.mock { background: #6366f1; }
    nav { background: var(--surface); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 10; }
    nav ul { max-width: 1100px; margin: 0 auto; padding: 0 2rem; list-style: none; display: flex; gap: 1.5rem; overflow-x: auto; }
    nav a { display: block; padding: .8rem 0; color: var(--text-muted); text-decoration: none; font-size: .9rem; white-space: nowrap; border-bottom: 2px solid transparent; transition: all .2s; }
    nav a:hover { color: var(--accent); border-color: var(--accent); }
    main { max-width: 1100px; margin: 0 auto; padding: 2rem; }
    .section { margin-bottom: 3rem; }
    .section h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 1.2rem; padding-bottom: .5rem; border-bottom: 2px solid var(--border); }
    .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem; transition: border-color .2s, transform .2s; }
    .card:hover { border-color: var(--accent); transform: translateY(-2px); }
    .card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: .5rem; margin-bottom: .5rem; }
    .card-title { font-size: 1rem; font-weight: 700; }
    .card-title a { color: var(--accent); text-decoration: none; }
    .card-title a:hover { text-decoration: underline; }
    .stars { font-size: .8rem; color: var(--text-muted); white-space: nowrap; padding-top: .1rem; }
    .card-desc { font-size: .9rem; color: var(--text-muted); margin-bottom: .8rem; }
    .card-meta { display: flex; flex-direction: column; gap: .5rem; font-size: .82rem; }
    .meta-item { display: flex; flex-direction: column; gap: .1rem; }
    .meta-label { font-weight: 600; color: var(--accent2); }
    code { background: var(--surface2); border: 1px solid var(--border); border-radius: 4px; padding: .15rem .4rem; font-family: 'Fira Code', monospace; font-size: .8rem; word-break: break-all; }
    .sources { margin-top: 1rem; font-size: .8rem; color: var(--text-muted); }
    .sources a { color: var(--accent2); }
    .doc-badge { display: inline-block; font-size: .7rem; font-weight: 700; padding: .15rem .5rem; border-radius: 99px; margin-bottom: .5rem; }
    .doc-badge.new-feature { background: #14532d; color: #4ade80; }
    .doc-badge.improvement { background: #431407; color: #fb923c; }
    .doc-badge.tip { background: #1e3a5f; color: #60a5fa; }
    @media (prefers-color-scheme: light) {
      .doc-badge.new-feature { background: #dcfce7; color: #166534; }
      .doc-badge.improvement { background: #ffedd5; color: #9a3412; }
      .doc-badge.tip { background: #dbeafe; color: #1d4ed8; }
    }
    .doc-detail { font-size: .82rem; color: var(--text-muted); margin-top: .5rem; line-height: 1.6; }
    .doc-date { font-size: .75rem; color: var(--text-muted); margin-top: .8rem; }
    .card-link { display: inline-block; margin-top: 1rem; padding: .4rem .9rem; background: var(--surface2); border: 1px solid var(--border); border-radius: 6px; color: var(--accent); font-size: .82rem; font-weight: 600; text-decoration: none; transition: background .2s, border-color .2s; }
    .card-link:hover { background: var(--accent); color: #fff; border-color: var(--accent); }
    footer { text-align: center; padding: 2rem; color: var(--text-muted); font-size: .85rem; border-top: 1px solid var(--border); }
  `;
    const mockBadge = result.isMockData
        ? '<span class="badge mock">오프라인 모드</span>'
        : '<span class="badge">실시간 데이터</span>';
    const navItems = [
        result.skills.length > 0 ? '<li><a href="#skills">🎯 Skills</a></li>' : '',
        result.mcpServers.length > 0 ? '<li><a href="#mcp_servers">🔌 MCP Servers</a></li>' : '',
        result.plugins.length > 0 ? '<li><a href="#plugins">🧩 Plugins</a></li>' : '',
        result.settings.length > 0 ? '<li><a href="#settings">⚙️ Settings</a></li>' : '',
        result.docUpdates.length > 0 ? '<li><a href="#doc_updates">📋 공식 업데이트</a></li>' : '',
    ].filter(Boolean).join('');
    const sections = [
        renderSection('인기 스킬 (Skills)', '🎯', result.skills, 'skills'),
        renderSection('MCP 서버', '🔌', result.mcpServers, 'mcp-servers'),
        renderSection('플러그인', '🧩', result.plugins, 'plugins'),
        renderSection('설정 & 팁', '⚙️', result.settings, 'settings'),
        renderDocSection(result.docUpdates),
    ].join('');
    const sourcesHtml = result.sources
        .map(s => `<a href="${escapeHtml(s)}" target="_blank" rel="noopener">${escapeHtml(s)}</a>`)
        .join('<br>');
    return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ClaudeScope Report — ${escapeHtml(formatDate(result.researchedAt))}</title>
  <style>${css}</style>
</head>
<body>
  <header>
    <div class="header-inner">
      <h1>🔭 ClaudeScope</h1>
      <p>Claude Code 생태계 트렌드 리포트 ${mockBadge}</p>
      <p style="margin-top:.3rem;font-size:.85rem;color:#666">생성: ${escapeHtml(formatDate(result.researchedAt))}</p>
    </div>
  </header>
  <nav><ul>${navItems}</ul></nav>
  <main>
    ${sections}
    <div class="sources">
      <strong>데이터 소스:</strong><br>${sourcesHtml}
    </div>
  </main>
  <footer>Generated by ClaudeScope v1.0.0 · <a href="https://github.com/hongpaul/claude-code-trend-reporter" style="color:var(--accent2)">GitHub</a></footer>
</body>
</html>`;
}
async function writeReport(result, outputDir = process.cwd(), autoOpen = true) {
    const filename = `${getTimestampForFilename()}_report.html`;
    const filepath = path.join(outputDir, filename);
    const html = generateHtml(result);
    fs.writeFileSync(filepath, html, 'utf-8');
    if (autoOpen) {
        await (0, open_1.default)(filepath);
    }
    return filepath;
}
//# sourceMappingURL=generator.js.map