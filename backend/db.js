import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
});

const accountSchema = new Schema({
  userid: {
    type: mongoose.Schema.Types.Objectid,
    ref: 'User',
    required: true
  },
  balance:{
    type: Number,
    required: true
  }
})


const Account = model('Account', accountSchema);
const User = model('User', userSchema);

export default {
  Account,
    User
}