import { validateParams } from '../middleware/validation';

describe('Simple validation test', () => {
  it('should validate correct parameters', () => {
    const req = {
      params: { org: 'facebook', repo: 'react', year: '2019' }
    } as any;
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as any;
    
    const next = jest.fn();
    
    validateParams(req, res, next);
    
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});