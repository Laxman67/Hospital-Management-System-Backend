import express from 'express';
import { login, patientRegister } from '../controller/userController.js';

const userRouter = express.Router();

userRouter.post('/patient/register', patientRegister);
userRouter.post('/login', login);

export default userRouter;
