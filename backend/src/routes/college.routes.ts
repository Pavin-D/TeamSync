import { Router } from 'express';
import { getColleges, getCollegeDepartments } from '../controllers/college.controller';

const router = Router();

router.get('/colleges', getColleges);
router.get('/departments/:collegeId', getCollegeDepartments);

export default router;
