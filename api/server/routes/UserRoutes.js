import { Router } from 'express';
import EmployeeController from '../controllers/EmployeeController';
import userAuthMiddleware from '../../middlewares/userAuthMiddleware';
import SosController from '../controllers/SosController';
import FIRController from '../controllers/FIRController';

const router = Router();

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

export default router;
