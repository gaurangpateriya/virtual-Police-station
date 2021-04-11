import { Router } from 'express';
import EmployeeController from '../controllers/EmployeeController';
import userAuthMiddleware from '../../middlewares/userAuthMiddleware';
import SosController from '../controllers/SosController';
import FIRController from '../controllers/FIRController';
import UserRelativesController from '../controllers/UserRelativesController';
import UserController from '../controllers/UserController';

const router = Router();
router.get('/details', userAuthMiddleware, UserController.getUserDetails);
router.post('/details', userAuthMiddleware, UserController.updateUserDetals);

router.get('/get-available-employees', userAuthMiddleware, EmployeeController.getAvailableEmployee);
router.post('/add-sos', userAuthMiddleware, SosController.addSosSignal);
router.post('/end-sos-signal', userAuthMiddleware, SosController.endSosSignal);
router.get('/get-active-sos', userAuthMiddleware, SosController.getActiveSos);
router.get('/get-sos-employee-location', userAuthMiddleware, SosController.getActiveSosEmployeeLocation);
router.post('/update-sos-current-location', userAuthMiddleware, SosController.updateCurrentLocation);
router.post('/add-sos-feedback', userAuthMiddleware, SosController.addSosFeedBack);
router.get('/get-sos-history', userAuthMiddleware, SosController.getAllSos)

// FIR related routes
router.post('/fir/add', userAuthMiddleware, FIRController.addFIR);
router.get('/fir/get', userAuthMiddleware, FIRController.getAllFIR);

//USer Relative routes
router.post('/relative/add', userAuthMiddleware, UserRelativesController.addUserRelative);
router.post('/relative/update', userAuthMiddleware, UserRelativesController.updateUserRelative);
router.post('/relative/delete/:id', userAuthMiddleware, UserRelativesController.deleteUserRelative);

export default router;
