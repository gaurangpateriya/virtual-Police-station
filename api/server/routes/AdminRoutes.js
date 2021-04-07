import { Router } from 'express';

import isAdminMiddleware from '../../middlewares/isAdminMiddleWare';
import EmployeeController from '../controllers/EmployeeController';
import FIRController from '../controllers/FIRController';
import SosController from '../controllers/SosController';
// controllers

const router = Router();

// to register a new employee
router.post('/employee/add', isAdminMiddleware, EmployeeController.register);
router.post('/employee/update/:employeeId', isAdminMiddleware, EmployeeController.updateEmployeeDetails);
router.post('/employee/delete/:employeeId', isAdminMiddleware, EmployeeController.deleteEmployee);
router.get('/employee/overview', isAdminMiddleware, EmployeeController.getEmployeeOverView);

// to get all the registered employee in the  dadmin
router.get('/employee/get', isAdminMiddleware, EmployeeController.getAllEmployees);
router.get('/fir/get', isAdminMiddleware, FIRController.getAllFIR);
router.post('/fir/update', isAdminMiddleware, FIRController.updateFir);
router.get('/fir/overview', isAdminMiddleware, FIRController.getFirOverView);

router.get('/sos/get', isAdminMiddleware, SosController.getAllSos);
router.post('/sos/update', isAdminMiddleware, SosController.updateSos);
router.get('/sos/overview', isAdminMiddleware, SosController.getSosOverView);


export default router;
