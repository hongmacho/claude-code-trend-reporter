import { RepoItem } from '../types';
export declare function searchRepos(query: string): Promise<RepoItem[] | null>;
export declare function fetchAllTrends(): Promise<{
    results: Map<string, RepoItem[]>;
    success: boolean;
}>;
//# sourceMappingURL=github.d.ts.map