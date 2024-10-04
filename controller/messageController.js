import { ErrorHandler } from '../middleware/errorHandler.js';
import Message from '../models/messageSchema.js';
import catchAsyncErrors from '../middleware/catchAsyncError.js';

export const sentMessage = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, message } = req.body;

  if (!firstName || !lastName || !email || !phone || !message) {
    return next(new ErrorHandler('Please Provide All Fields ', 404));
  }

  await Message.create({
    firstName,
    lastName,
    email,
    phone,
    message,
  });

  res.status(201).json({
    success: true,
    message: 'Message Sent Successfully !',
  });
});

export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await Message.find();

  res.status(200).json({
    success: true,
    messages,
  });
});
