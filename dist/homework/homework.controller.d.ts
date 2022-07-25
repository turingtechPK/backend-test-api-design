import { HomeworkService } from './homework.service';
export declare class HomeworkController {
    private homeworkService;
    constructor(homeworkService: HomeworkService);
    getContibutors(org: string, repo: string): Promise<any>;
    getNewContributors(org: string, repo: string, year: string, month?: string): Promise<{
        organization: string;
        repository: string;
        year: string;
        month: string;
        contributors: any[];
    }>;
    ValidateRequest(params: any): void;
}
