import { Injectable} from '@nestjs/common';


@Injectable()

export class HomeworkService {


    constructor() {}

    public async getAllContributors( org: string, repo:string) {
        const url = "https://api.github.com/repos/"+org+"/"+repo+"/contributors"
        const response = await fetch(url);
        const data = await response.json();
        return data.map(contributor => contributor.login);;  
      
    }
    public async getNewContributors(org: string, repo:string ,year: string, month: string) {
      
        var commits = await getCommitsInRange(org, repo, year,month);   
        var contributors = [];
        console.log(typeof commits);
        for (let i = 0; i < commits.length; i++) {
            if(!contributors.includes(commits[i].commit.author.email)){
                contributors.push(commits[i].commit.author.email);
            }
        };
        return {
            organization: org,
            repository: repo,
            year: year,
            month: month,
            contributors: contributors,
        };
    }
}


async function getCommitsInRange(username, repo, year, month) {

    //console.log(year+"-"+month+"-01T14:48:00.000Z");
    var url = "https://api.github.com/repos/"+username+"/"+repo+"/commits?since="+year+"-"+month+"-01T14:48:00.000Z";
    const response = await fetch(url);
    const data = await response.json();
    return data; 
}

