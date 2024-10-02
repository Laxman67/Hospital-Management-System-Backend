import catchAsyncErrors from '../middleware/catchAsyncError.js';
import { ErrorHandler } from '../middleware/errorHandler.js';
import User from '../models/userSchema.js';

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password ||
    !role
  ) {
    return next(new ErrorHandler('Please Fill Full Form', 400));
  }

  //   Find by Email Id
  let user = await User.findOne({ email });

  if (user) {
    return next(new ErrorHandler('User Already Registered', 400));
  }

  user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role,
  });

  res.status(201).json({
    success: true,
    message: 'User Registered !',
  });
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;

  // Checking all Expected Fields
  if (!email || !password || !confirmPassword || !role) {
    return next(new ErrorHandler('Please Provide All Details', 400));
  }

  // After getting all deatils => check for password and confirm
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler('Password and Confirm Password Do not Match', 400)
    );
  }

  // Now Checking for user existence
  let user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorHandler('Invalid Email or Password', 400));
  }

  //matched password entered by user and password in DB
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid Email or Password', 400));
  }

  // Checking for Role
  if (role !== user.role) {
    return next(new ErrorHandler('User with this role not found', 400));
  }

  res.status(201).json({
    success: true,
    message: 'User Logged In Successfully !',
  });
});
