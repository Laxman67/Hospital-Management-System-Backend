import catchAsyncError from '../middleware/catchAsyncError.js';
import { ErrorHandler } from '../middleware/errorHandler.js';

import Appointment from '../models/appointmentSchema.js';
import User from '../models/userSchema.js';

export const postAppointment = catchAsyncError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    address,
    hasVisited,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address
  ) {
    return next(new ErrorHandler('Please Provide All Details', 400));
  }

  //   Find doctor from userModel and check for conflict
  const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: 'Doctor',
    doctorDepartment: department,
  });

  if (isConflict.length === 0) {
    return next(new ErrorHandler('Doctor Not Found', 404));
  }

  if (isConflict.length > 1) {
    return next(
      new ErrorHandler(
        'Doctors Conflict! Please Contact through Email or Phone',
        404
      )
    );
  }

  const doctorId = isConflict[0]._id;
  const patientId = req.user._id;
  Boolean(hasVisited);

  try {
    await Appointment.create({
      firstName,
      lastName,
      email,
      phone,
      nic,
      dob,
      gender,
      appointment_date,
      department,
      doctor: {
        firstName: doctor_firstName,
        lastName: doctor_firstName,
      },
      address,
      hasVisited,
      doctorId,
      patientId,
    });

    res.status(201).json({
      success: true,
      message: 'Appointment Sent Successfully!',
    });
  } catch (error) {
    // TODO there might get error
    return next(new ErrorHandler(error.message, 404));
  }
});

export const getAllAppointments = catchAsyncError(async (req, res, next) => {
  const appointments = await Appointment.find();

  res.status(200).json({
    sucsess: true,
    appointments,
  });
});
