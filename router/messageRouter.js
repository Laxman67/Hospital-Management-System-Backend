import express from 'express';
import {
  getAllMessages,
  sentMessage,
} from '../controller/messageController.js';
import { isAdminAuthenticated } from '../middleware/auth.js';

const messageRouter = express.Router();

messageRouter.post('/send', sentMessage);
messageRouter.get('/getall', isAdminAuthenticated, getAllMessages);

export default messageRouter;
