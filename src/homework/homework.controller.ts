import { Controller, Get, Param } from '@nestjs/common';

import { HomeworkService } from './homework.service';

@Controller('/')

export class HomeworkController {
    constructor(private homeworkService:HomeworkService) {}

    @Get('/contributors/:org/:repo')
    public async getContibutors( @Param("org") org: string,
    @Param("repo") repo: string
    ){
        return await this.homeworkService.getAllContributors(org,repo);
    }

    @Get("/:org/:repo/:year/:month?")
	public async getNewContributors(
        @Param("org") org: string,
        @Param("repo") repo: string,
        @Param("year") year: string,
        @Param("month") month?: string)  {
            var req = {
                org: org,
                repo: repo,
                year: year,
                month: month?month:"01",
            }
            this.ValidateRequest(req); 
		return await this.homeworkService.getNewContributors(org,repo, year, month);
	}

    public ValidateRequest(params:any)  {

        if(!params.org || !params.repo || !params.year ) {
            throw new Error("Invalid request");
        }
        function isValidYear(year:string) {
            if (year.length != 4) {
                return false;
            }
            var year_ = parseInt(year);
            if (year_ < 2013 || year_ > 2022) {
                return false;
            }
            return true;
        }
        function isValidMonth(month:string) {
            var months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
            return months.includes(month);
        }
        if(!isValidMonth(params.month)) {
            throw new Error("Invalid month");
        }        
        if (params.month && !isValidYear(params.year)) {
            throw new Error("Invalid year");
        }

       
    }
}
