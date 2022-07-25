"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeworkService = void 0;
const common_1 = require("@nestjs/common");
let HomeworkService = class HomeworkService {
    constructor() { }
    async getAllContributors(org, repo) {
        const url = "https://api.github.com/repos/" + org + "/" + repo + "/contributors";
        const response = await fetch(url);
        const data = await response.json();
        return data.map(contributor => contributor.login);
        ;
    }
    async getNewContributors(org, repo, year, month) {
        var commits = await getCommitsInRange(org, repo, year, month);
        var contributors = [];
        console.log(typeof commits);
        for (let i = 0; i < commits.length; i++) {
            if (!contributors.includes(commits[i].commit.author.email)) {
                contributors.push(commits[i].commit.author.email);
            }
        }
        ;
        return {
            organization: org,
            repository: repo,
            year: year,
            month: month,
            contributors: contributors,
        };
    }
};
HomeworkService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], HomeworkService);
exports.HomeworkService = HomeworkService;
async function getCommitsInRange(username, repo, year, month) {
    var url = "https://api.github.com/repos/" + username + "/" + repo + "/commits?since=" + year + "-" + month + "-01T14:48:00.000Z";
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
//# sourceMappingURL=homework.service.js.map