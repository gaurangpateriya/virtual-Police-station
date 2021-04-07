import { Router } from 'express';
import EmployeeController from '../controllers/EmployeeController';
import UserController from '../controllers/UserController';

const router = Router();

router.post('/user/register', UserController.register);
router.post('/user/login', UserController.login);
router.post('/employee/register', EmployeeController.register);
router.post('/employee/login', EmployeeController.login);
router.post('/user/forgot-password', UserController.forgotPassword);
router.post('/user/reset-password', UserController.resetPassword);

export default router;
