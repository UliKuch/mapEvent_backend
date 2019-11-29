import mongoose, { Schema, Model } from 'mongoose';

// import Typescript interfaces
import { IEventDocument } from '../interfaces';

const eventSchema: Schema = new Schema({
  geometry: {
    type: {
      type: String,
      required: true,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      required: true,
    }
  },
  category: String,
  title: {
    type: String,
    required: true,
  },
  body: String,
  img: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  creationDate: {
    type: Date,
    required: true,
  },
  comments: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
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

const Event: Model<IEventDocument> = mongoose.model('event', eventSchema);

export default Event;