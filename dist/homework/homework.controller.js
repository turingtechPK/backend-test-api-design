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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeworkController = void 0;
const common_1 = require("@nestjs/common");
const homework_service_1 = require("./homework.service");
let HomeworkController = class HomeworkController {
    constructor(homeworkService) {
        this.homeworkService = homeworkService;
    }
    async getContibutors(org, repo) {
        return await this.homeworkService.getAllContributors(org, repo);
    }
    async getNewContributors(org, repo, year, month) {
        var req = {
            org: org,
            repo: repo,
            year: year,
            month: month ? month : "01",
        };
        this.ValidateRequest(req);
        return await this.homeworkService.getNewContributors(org, repo, year, month);
    }
    ValidateRequest(params) {
        if (!params.org || !params.repo || !params.year) {
            throw new Error("Invalid request");
        }
        function isValidYear(year) {
            if (year.length != 4) {
                return false;
            }
            var year_ = parseInt(year);
            if (year_ < 2013 || year_ > 2022) {
                return false;
            }
            return true;
        }
        function isValidMonth(month) {
            var months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
            return months.includes(month);
        }
        if (!isValidMonth(params.month)) {
            throw new Error("Invalid month");
        }
        if (params.month && !isValidYear(params.year)) {
            throw new Error("Invalid year");
        }
    }
};
__decorate([
    (0, common_1.Get)('/contributors/:org/:repo'),
    __param(0, (0, common_1.Param)("org")),
    __param(1, (0, common_1.Param)("repo")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HomeworkController.prototype, "getContibutors", null);
__decorate([
    (0, common_1.Get)("/:org/:repo/:year/:month?"),
    __param(0, (0, common_1.Param)("org")),
    __param(1, (0, common_1.Param)("repo")),
    __param(2, (0, common_1.Param)("year")),
    __param(3, (0, common_1.Param)("month")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], HomeworkController.prototype, "getNewContributors", null);
HomeworkController = __decorate([
    (0, common_1.Controller)('/'),
    __metadata("design:paramtypes", [homework_service_1.HomeworkService])
], HomeworkController);
exports.HomeworkController = HomeworkController;
//# sourceMappingURL=homework.controller.js.map