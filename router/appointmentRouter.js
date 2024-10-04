import express from 'express';
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from '../middleware/auth.js';
import {
  getAllAppointments,
  postAppointment,
} from '../controller/appointmentController.js';

const appointmentRouter = express.Router();

appointmentRouter.post('/post', isPatientAuthenticated, postAppointment);
appointmentRouter.get('/getall', isAdminAuthenticated, getAllAppointments);

export default appointmentRouter;
