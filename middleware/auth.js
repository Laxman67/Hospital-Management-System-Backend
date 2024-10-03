import catchAsyncErrors from './catchAsyncError.js';
import { ErrorHandler } from '../middleware/errorHandler.js';
import JWT from 'jsonwebtoken';
import User from '../models/userSchema.js';

export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // get cookies with 'adminToken':"xyz...." name
  const token = req.cookies.adminToken;

  if (!token) {
    return next(new ErrorHandler('Admin not Authenticated', 400));
  }

  //   Get id from token
  const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);

  //   After getting id => get user role from user schema
  req.user = await User.findById(decoded.id);

  //   Now check for role if it's admin or patient -> if not then Throw Error
  if (req.user.role !== 'Admin') {
    return next(
      new ErrorHandler(`${req.user.role} not authorised for this resource`, 403)
    );
  }

  //   if all conditions match -> Admin is Requesting
  next();
});
export const isPatientAuthenticated = catchAsyncErrors(
  async (req, res, next) => {
    // get cookies with 'adminToken':"xyz...." name
    const token = req.cookies.patientToken;

    if (!token) {
      return next(new ErrorHandler('Patient not Authenticated', 400));
    }

    //   Get id from token
    const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);

    //   After getting id => get user role from user schema
    req.user = await User.findById(decoded.id);

    //   Now check for role if it's admin or patient -> if not then Throw Error
    if (req.user.role !== 'Patient') {
      return next(
        new ErrorHandler(
          `${req.user.role} not authorised for this resource`,
          403
        )
      );
    }

    //   if all conditions match -> Admin is Requesting
    next();
  }
);
