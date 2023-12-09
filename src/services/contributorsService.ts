import Contributor from '../models/contributorModel';

export const findContributors = async (org: string, repo: string, year: number, month?: number) => {
  return await Contributor.findOne({ org, repository: repo, year, month });
};

export const saveContributors = async (org: string, repo: string, year: number, month: number | undefined, newContributors: string[]) => {
  const newRecord = new Contributor({ org, repository: repo, year, month, newContributors });
  await newRecord.save();
};
