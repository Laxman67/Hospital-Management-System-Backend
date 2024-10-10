import catchAsyncErrors from '../middleware/catchAsyncError.js';
import { ErrorHandler } from '../middleware/errorHandler.js';
import User from '../models/userSchema.js';
import { generateToken } from '../utils/jwtToken.js';
import cloudinary from 'cloudinary';

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

  generateToken(user, 'User Registered !', 201, res);
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

  generateToken(user, 'User Logged In Successfully !', 200, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, nic, dob, gender, password } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password
  ) {
    return next(new ErrorHandler('Please Fill Full Form', 400));
  }

  const isRegistered = await User.findOne({ email });

  if (isRegistered) {
    return next(
      new ErrorHandler(
        `${isRegistered.role}  with this Email Already Exists`,
        400
      )
    );
  }

  const admin = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: 'Admin',
  });

  res.status(201).json({
    success: true,
    message: 'New Admin Resgistered !',
  });
});

export const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: 'Doctor' });
  res.status(200).json({
    success: true,
    doctors,
  });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user; // comming for isAuthenticatedUser middleware
  res.status(200).json({
    success: true,
    user,
  });
});
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie('adminToken', '', {
      expires: new Date(Date.now()),
      httpOnly: true,
      //  sameSite: 'none', // removed this
    })
    .json({
      success: true,
      message: 'User Logged Out !',
    });
});

export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie('patientToken', '', {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: 'User Logged Out !',
    });
});

export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  // Check for the file
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler('Doctor Avatar Required'), 400);
  }

  // get the file with docAvatar name field
  const { docAvatar } = req.files;

  // Type of file mimetype to accept
  const allowedFormats = ['image/png', 'image/jpeg', 'image/webp'];

  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler('File Format Not Supported'), 400);
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    doctorDepartment,
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
    !doctorDepartment
  ) {
    return next(new ErrorHandler('Provide All Fields'), 400);
  }

  const isRegistered = await User.findOne({ email });

  if (isRegistered) {
    return next(
      new ErrorHandler(
        `${isRegistered.role} With This Email id Already Exists`
      ),
      400
    );
  }

  // Upload docAvatar to cloudinary
  let cloudinaryResponse;

  try {
    cloudinaryResponse = await cloudinary.uploader.upload(
      docAvatar.tempFilePath,
      { folder: 'DOCTORS' }
    );
  } catch (error) {
    return next(
      new ErrorHandler('Failed to Upload docAvatar  to Cloudinary', 500)
    );
  }

  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: 'Doctor',
    doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Doctor Registered Successfully',
    doctor,
  });
});
