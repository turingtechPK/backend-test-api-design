import express from 'express';
import * as contributorsController from '../controllers/contributorsController';

const router = express.Router();

router.get('/:org/:repository/:year', contributorsController.getContributorsByYear);
router.get('/:org/:repository/:year/:month', contributorsController.getContributorsByMonth);

export default router;
