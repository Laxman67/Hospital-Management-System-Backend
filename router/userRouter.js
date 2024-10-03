import express from 'express';
import {
  addNewAdmin,
  addNewDoctor,
  getAllDoctors,
  getUserDetails,
  login,
  logoutAdmin,
  logoutPatient,
  patientRegister,
} from '../controller/userController.js';

import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/patient/register', patientRegister);
userRouter.post('/login', login);
userRouter.post('/admin/register', isAdminAuthenticated, addNewAdmin);
userRouter.get('/doctors', isAdminAuthenticated, getAllDoctors);
userRouter.get('/admin/me', isAdminAuthenticated, getUserDetails);
userRouter.get('/patient/me', isPatientAuthenticated, getUserDetails);
userRouter.get('/admin/logout', isAdminAuthenticated, logoutAdmin);
userRouter.get('/patient/logout', isPatientAuthenticated, logoutPatient);
userRouter.post('/doctor/register', addNewDoctor);

export default userRouter;
