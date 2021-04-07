import { Router } from 'express';
import EmployeeController from '../controllers/EmployeeController';
import empAuthMiddleWare from '../../middlewares/empAuthMiddleWare';
import FIRController from '../controllers/FIRController';
import SosController from '../controllers/SosController';

const router = Router();

router.post('/update/:employeeId', empAuthMiddleWare, EmployeeController.updateEmployeeDetails);
router.get('/get', empAuthMiddleWare, EmployeeController.getEmployeeDetails);

router.get('/get-active-sos', empAuthMiddleWare, SosController.getEmployeeActiveSos);
router.get('/get-a-sos', empAuthMiddleWare, SosController.getASos);
router.get('/get-sos-employee-location', empAuthMiddleWare, SosController.getActiveSosEmployeeLocation);
router.post('/update-sos-current-location', empAuthMiddleWare, SosController.updateCurrentLocation);
router.post('/add-sos-feedback', empAuthMiddleWare, SosController.addSosFeedBack);
router.post('/end-sos-signal', empAuthMiddleWare, SosController.endSosSignal);
router.get('/get-sos-history', empAuthMiddleWare, SosController.getAllSos)

// FIR related routes
router.post('/fir/update', empAuthMiddleWare, FIRController.updateFir);
router.get('/fir/get', empAuthMiddleWare, FIRController.getAllFIR);


export default router;
