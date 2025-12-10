import { Request, Response } from 'express';
import { getStats } from '../services/contributor.service';

export const getYearlyContributors = async (req: Request, res: Response) => {
  try {
    const { org, repo, year } = req.params;
    const { page, limit } = req.query;
    const token = process.env.GITHUB_TOKEN;
    
    const pageNum = page ? parseInt(page as string) : 1;
    const limitNum = limit ? parseInt(limit as string) : 10;
    
    const stats = await getStats(org, repo, parseInt(year), undefined, token, pageNum, limitNum);
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getMonthlyContributors = async (req: Request, res: Response) => {
  try {
    const { org, repo, year, month } = req.params;
    const { page, limit } = req.query;
    const token = process.env.GITHUB_TOKEN;
    
    const pageNum = page ? parseInt(page as string) : 1;
    const limitNum = limit ? parseInt(limit as string) : 10;
    
    const stats = await getStats(org, repo, parseInt(year), parseInt(month), token, pageNum, limitNum);
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};