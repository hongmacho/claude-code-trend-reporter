export interface RepoItem {
    readonly name: string;
    readonly fullName: string;
    readonly description: string;
    readonly stars: number;
    readonly url: string;
    readonly topics: readonly string[];
    readonly language: string | null;
    readonly updatedAt: string;
}
export interface TrendItem {
    readonly name: string;
    readonly description: string;
    readonly whyPopular: string;
    readonly howToInstall: string;
    readonly url: string;
    readonly stars: number;
    readonly category: TrendCategory;
}
export type TrendCategory = 'skills' | 'mcp-servers' | 'plugins' | 'settings';
export interface ResearchResult {
    readonly skills: readonly TrendItem[];
    readonly mcpServers: readonly TrendItem[];
    readonly plugins: readonly TrendItem[];
    readonly settings: readonly TrendItem[];
    readonly researchedAt: string;
    readonly sources: readonly string[];
    readonly isMockData: boolean;
}
export interface GitHubSearchResponse {
    readonly total_count: number;
    readonly items: readonly GitHubRepo[];
}
export interface GitHubRepo {
    readonly id: number;
    readonly name: string;
    readonly full_name: string;
    readonly description: string | null;
    readonly html_url: string;
    readonly stargazers_count: number;
    readonly topics: readonly string[];
    readonly language: string | null;
    readonly updated_at: string;
}
//# sourceMappingURL=types.d.ts.map