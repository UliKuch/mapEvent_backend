import mongoose, { Schema, Model } from 'mongoose';

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
    id: {
      type: String,
      required: true,
    },
    // geometry: {
    //   type: {
    //     type: String!,
    //     required: true,
    //   },
    //   latitude: {
    //     type: Number,
    //     required: true,
    //   },
    //   longitude: {
    //     type: Number,
    //     required: true,
    //   }
    // },
    // radius: Number,
    // category: String,
    // title: {
    //   type: String,
    //   required: true,
    // },
    // body: String,
    // img: String,
    // creationDate: Date,
    // comments: [{
    //   id: {
    //     type: String,
    //     required: true,
    //   },
    //   user: {
    //     id: {
    //       type: String,
    //       required: true,
    //     },
    //     email: {
    //       type: String,
    //       required: true,
    //       unique: true,
    //     },
    //     username: {
    //       type: String,
    //       unique: true,
    //     },
    //     firstName: {
    //       type: String,
    //       required: true,
    //     },
    //     middleName: String,
    //     lastName: {
    //       type: String,
    //       required: true,
    //     },
    //   },
    //   message: {
    //     type: String,
    //     required: true,
    //   },
    //   postedOn: {
    //     type: Date,
    //     required: true,
    //   }
    // }]
  }]
})

const User: Model<IUserDocument> = mongoose.model('user', userSchema);

export default User;