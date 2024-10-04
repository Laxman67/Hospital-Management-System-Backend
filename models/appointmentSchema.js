import mongoose, { model, Schema } from 'mongoose';
import validator from 'validator';

const appointmentSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [3, 'First name must contain atleast 3 Character !'],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [3, 'Last name must contain atleast 3 Character !'],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, 'Please Provide a Valid Email !'],
  },
  phone: {
    type: String,
    required: true,
    minLength: [11, 'Phone number must contain exact 11 Digits !'],
    maxLength: [11, 'Phone number must contain exact 11 Digits !'],
  },
  nic: {
    type: String,
    required: true,
    minLength: [12, 'NIC number must contain exact 12 Digits !'],
    maxLength: [12, 'NIC number must contain exact 12 Digits !'],
  },
  dob: {
    type: Date,
    required: [true, 'DOB is Required'],
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Others'],
  },
  appointment_date: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  doctor: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },

  hasVisited: {
    type: Boolean,
    default: false,
  },
  doctorId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  patientId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending',
  },
});

const Appointment = model('Appointment', appointmentSchema);

export default Appointment;
