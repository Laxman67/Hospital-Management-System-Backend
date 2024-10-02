import express from 'express';
import { sentMessage } from '../controller/messageController.js';

const messageRouter = express.Router();

messageRouter.post('/send', sentMessage);

export default messageRouter;
