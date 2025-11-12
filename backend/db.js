import { Schema, model, mongoose } from 'mongoose';

mongoose.connect("mongodb://localhost:27017/paytm");

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

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
    type: Schema.Types.ObjectId,
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

export {
  Account,
    User
}