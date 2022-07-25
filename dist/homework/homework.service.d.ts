export declare class HomeworkService {
    constructor();
    getAllContributors(org: string, repo: string): Promise<any>;
    getNewContributors(org: string, repo: string, year: string, month: string): Promise<{
        organization: string;
        repository: string;
        year: string;
        month: string;
        contributors: any[];
    }>;
}
