"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRepos = searchRepos;
exports.fetchAllTrends = fetchAllTrends;
const axios_1 = __importDefault(require("axios"));
const GITHUB_API_BASE = 'https://api.github.com';
const SEARCH_QUERIES = [
    { q: 'claude+code+skills', label: 'skills' },
    { q: 'claude+code+mcp', label: 'mcp' },
    { q: 'oh-my-claudecode', label: 'omc' },
    { q: 'topic:claude-code', label: 'ecosystem' },
];
// GitHub API로 레포 검색 (실패 시 null 반환)
async function searchRepos(query) {
    try {
        const url = `${GITHUB_API_BASE}/search/repositories?q=${query}&sort=stars&order=desc&per_page=10`;
        const response = await axios_1.default.get(url, {
            headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'ClaudeScope/1.0' },
            timeout: 10000,
        });
        return response.data.items.map(repo => ({
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description ?? 'No description available',
            stars: repo.stargazers_count,
            url: repo.html_url,
            topics: repo.topics ?? [],
            language: repo.language,
            updatedAt: repo.updated_at,
        }));
    }
    catch {
        return null;
    }
}
// 모든 쿼리 병렬 실행
async function fetchAllTrends() {
    const entries = await Promise.all(SEARCH_QUERIES.map(async ({ q, label }) => {
        const repos = await searchRepos(q);
        return [label, repos ?? []];
    }));
    const results = new Map(entries);
    const success = entries.some(([, repos]) => repos.length > 0);
    return { results, success };
}
//# sourceMappingURL=github.js.map