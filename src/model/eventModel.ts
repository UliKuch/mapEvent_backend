import mongoose, { Schema, Model } from 'mongoose';

import { IEventDocument } from '../interfaces';

const eventSchema: Schema = new Schema({
  geometry: {
    type: {
      type: String,
      required: true,
    },
    coordinates: {
      longitude: {
        type: Number,
        required: true,
      },
      latitude: {
        type: Number,
        required: true,
      },
    }
  },
  radius: Number,
  category: String,
  title: {
    type: String,
    required: true,
  },
  body: String,
  img: String,
  createdBy: {
    id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    username: String,
    firstName: {
      type: String,
      required: true,
    },
    middleName: String,
    lastName: {
      type: String,
      required: true,
    },
  },
  creationDate: {
    type: Date,
    required: true,
  },
  comments: [{
    id: {
      type: String,
      required: true,
    },
    user: {
      id: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      username: String,
      firstName: {
        type: String,
        required: true,
      },
      middleName: String,
      lastName: {
        type: String,
        required: true,
      },  
    },
    message: {
      type: String,
      required: true,
    },
    postedOn: {
      type: Date,
      required: true,
    }
  }]
})

const eventModel: Model<IEventDocument> = mongoose.model('event', eventSchema);

export default eventModel;