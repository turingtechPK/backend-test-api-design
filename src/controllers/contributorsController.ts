import { Request, Response } from 'express';
import * as githubService from '../services/githubService';
import * as contributorService from '../services/contributorsService';
import { isString, isInteger } from '../helpers/utils';

export const getContributorsByYear = async (req: Request, res: Response) => {
  try {
    const { org, repository, year } = req.params;
    
    const parsedYear = parseInt(year);
    const currentYear = new Date().getFullYear();

    if (!isString(org) || !isString(repository) || !isInteger(parsedYear) || parsedYear > currentYear) {
      return res.status(400).json({ error: 'Invalid input parameters' });
    }

    let newContributors;

    const existingData = await contributorService.findContributors(org, repository, parseInt(year));

    if (existingData) {
      newContributors = existingData.newContributors;
    } else {
      newContributors = await githubService.getNewContributors(org, repository, parseInt(year));
      await contributorService.saveContributors(org, repository, parseInt(year), undefined, newContributors);
    }
    res.json({ org, repository, year, newContributors });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

export const getContributorsByMonth = async (req: Request, res: Response) => {
    try {
      const { org, repository, year, month } = req.params;
      
      const currentYear = new Date().getFullYear();

      if (!isString(org) || !isString(repository) || !isInteger(parseInt(year)) || parseInt(year) > currentYear
          || !isInteger(parseInt(month)) || parseInt(month) < 1 || parseInt(month) > 12) {
        return res.status(400).json({ error: 'Invalid input parameters' });
      }

      let newContributors;

      const existingData = await contributorService.findContributors(org, repository, parseInt(year), parseInt(month));

      if (existingData) {
        newContributors = existingData.newContributors;
      } else {
        newContributors = await githubService.getNewContributors(org, repository, parseInt(year), parseInt(month));
        await contributorService.saveContributors(org, repository, parseInt(year), parseInt(month), newContributors);
      }
      res.json({ org, repository, year, month, newContributors });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};