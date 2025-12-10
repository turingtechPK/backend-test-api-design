export interface GitHubCommit {
  sha: string;
  author: {
    login: string;
    date: string;
  } | null;
  committer: {
    login: string;
    date: string;
  } | null;
}

export interface GitHubRepository {
  name: string;
  full_name: string;
  created_at: string;
  updated_at: string;
}

export interface ContributorStats {
  org: string;
  repository: string;
  year: string;
  month?: string;
  newContributors: number;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasNext: boolean;
  nextPage?: number;
}