import { Request, Response, NextFunction } from 'express';

export const validateParams = (req: Request, res: Response, next: NextFunction) => {
  const { org, repo, year, month } = req.params;

  // Validate org
  if (!org?.trim()) {
    return res.status(400).json({ error: 'Organization name is required' });
  }

  // Validate repo
  if (!repo?.trim()) {
    return res.status(400).json({ error: 'Repository name is required' });
  }

  // Validate year
  const yearNum = parseInt(year);
  const currentYear = new Date().getFullYear();
  if (isNaN(yearNum) || yearNum < 2008 || yearNum > currentYear) {
    return res.status(400).json({ error: `Year must be between 2008 and ${currentYear}` });
  }

  // Validate month if provided
  if (month) {
    const monthNum = parseInt(month);
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ error: 'Month must be between 1 and 12' });
    }
  }

  next();
};