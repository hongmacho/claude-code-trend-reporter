import axios from 'axios';
import { GitHubSearchResponse, RepoItem } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';
const SEARCH_QUERIES = [
  { q: 'claude+code+skills+in:name,description', label: 'skills' },
  { q: 'claude+code+mcp+in:name,description', label: 'mcp' },
  { q: 'oh-my-claudecode', label: 'omc' },
  { q: 'topic:claude-code', label: 'ecosystem' },
  { q: 'github-mcp-server', label: 'github-mcp' },
  { q: 'playwright-mcp', label: 'playwright-mcp' },
  { q: 'context7+mcp', label: 'context7' },
  { q: 'awesome-claude-code', label: 'awesome' },
];

// GitHub API로 레포 검색 (실패 시 null 반환)
export async function searchRepos(query: string): Promise<RepoItem[] | null> {
  try {
    const url = `${GITHUB_API_BASE}/search/repositories?q=${query}&sort=stars&order=desc&per_page=10`;
    const response = await axios.get<GitHubSearchResponse>(url, {
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
  } catch {
    return null;
  }
}

// 모든 쿼리 병렬 실행
export async function fetchAllTrends(): Promise<{ results: Map<string, RepoItem[]>, success: boolean }> {
  const entries = await Promise.all(
    SEARCH_QUERIES.map(async ({ q, label }) => {
      const repos = await searchRepos(q);
      return [label, repos ?? []] as [string, RepoItem[]];
    })
  );
  const results = new Map(entries);
  const success = entries.some(([, repos]) => repos.length > 0);
  return { results, success };
}
