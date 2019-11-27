import mongoose, { Schema, Model } from 'mongoose';

// import Typescript interfaces
import { IUserDocument } from '../interfaces';

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: String,
  lastName: {
    type: String,
    required: true,
  },
  events: [{
    type: Schema.Types.ObjectId,
    ref: 'event',
  }]
})

const User: Model<IUserDocument> = mongoose.model('user', userSchema);

export default User;