import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { Repository } from './repository';

@Injectable()
export class GithubService {
  constructor() {
    dotenv.config();
  }

  // To store all repositories of the org
  repositories: Repository[] = [];

  // Stores All repositories of an Organization along with their newest contributors
  //Not using this function as I am saving the data in memory and it takes alot of time. Would be usefull if data is being stored in the Database
  async getRepositories(orgName: string): Promise<any> {
    try {
      //Initializing authorization token for Github API
      const headers = {
        Authorization: `token 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`,
      };
      //Requesting for Data for all the repositories of the org
      const response = await axios.get(
        `https://api.github.com/orgs/${orgName}/repos`,
        { headers },
      );

      for (let i = 0; i < response.data.length; i++) {
        let repo = new Repository();
        repo.name = response.data[i].name;

        //Requesting for Data for all the commits for the given repository
        const response2 = await axios.get(
          `https://api.github.com/repos/${orgName}/${response.data[i].name}/commits`,
          { headers },
        );
        //Filtering all of the first time contribution maker
        if (response2) {
          let newCommitters = [];
          let allCommits = response2.data.map((commit) => commit.commit.author);
          for (let i = allCommits.length - 1; i > -1; i--) {
            let exists = false;
            for (let j = 0; j < newCommitters.length; j++) {
              if (allCommits[i].email === newCommitters[j].email) {
                exists = true;
                break;
              }
            }
            if (exists === false) {
              newCommitters.push(allCommits[i]);
            }
          }

          repo.committers = newCommitters;
          //Pushing the repository name and its committers in the memory
          this.repositories.push(repo);
        }
      }

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUniqueRepositoryCommitsInYear(
    orgName: string,
    repoName: string,
    year: string,
  ): Promise<any> {
    try {
      //Initializing authorization token for Github API
      const headers = {
        Authorization: `token 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`,
      };
      //Requesting for Data for all the commits for the given repository
      const response = await axios.get(
        `https://api.github.com/repos/${orgName}/${repoName}/commits`,
        { headers },
      );

      //To filter out the First Time Committors
      let newCommitters = [];

      let allCommits = response.data.map((commit) => commit.commit.author);

      for (let i = allCommits.length - 1; i > -1; i--) {
        let exists = false;
        for (let j = 0; j < newCommitters.length; j++) {
          if (allCommits[i].email === newCommitters[j].email) {
            exists = true;
            break;
          }
        }
        if (exists === false) {
          newCommitters.push(allCommits[i]);
        }
      }

      //Filtering the new committors for the exact year
      let filteredCommits = [];
      newCommitters.forEach((commit) => {
        if (commit.date.substring(0, 4) === year) {
          filteredCommits.push(commit);
        }
      });
      const resp = {
        Org: orgName,
        Repository: repoName,
        Year: year,
        'New Contributors': filteredCommits,
      };
      return resp;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUniqueRepositoryCommitsInYearAndMonth(
    orgName: string,
    repoName: string,
    year: string,
    month: string,
  ): Promise<any> {
    try {
      //Initializing authorization token for Github API
      const headers = {
        Authorization: `token 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`,
      };
      //Requesting for Data for all the commits for the given repository
      const response = await axios.get(
        `https://api.github.com/repos/${orgName}/${repoName}/commits`,
        { headers },
      );

      //To filter out the First Time Committors
      let newCommitters = [];

      let allCommits = response.data.map((commit) => commit.commit.author);

      for (let i = allCommits.length - 1; i > -1; i--) {
        let exists = false;
        for (let j = 0; j < newCommitters.length; j++) {
          if (allCommits[i].email === newCommitters[j].email) {
            exists = true;
            break;
          }
        }
        if (exists === false) {
          newCommitters.push(allCommits[i]);
        }
      }
      //Filtering the new committors for the exact year and month
      let filteredCommits = [];
      newCommitters.forEach((commit) => {
        if (
          commit.date.substring(0, 4) === year &&
          commit.date.substring(5, 7) === month
        ) {
          filteredCommits.push(commit);
        }
      });
      
      const resp = {
        Org: orgName,
        Repository: repoName,
        Year: year,
        Month: month,
        'New Contributors': filteredCommits,
      };
      return resp;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
