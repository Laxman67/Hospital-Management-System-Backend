import { model, Schema } from 'mongoose';
import validator from 'validator';

const messageSchema = new Schema({
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
  message: {
    type: String,
    required: true,
    minLength: [10, 'Message must contain atleast 10 Characters !'],
  },
});

const Message = model('Message', messageSchema);

export default Message;
