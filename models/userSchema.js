import { model, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
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
  password: {
    type: String,
    minLength: [8, 'Password must contain atleast 8 Characters '],
    required: true,
    select: false, // by default it will not fetch when user is fetched
  },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'Patient', 'Doctor'],
  },
  doctorDepartment: {
    type: String,
  },
  docAvatar: {
    public_id: String,
    url: String,
  },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const User = model('User', userSchema);

export default User;
