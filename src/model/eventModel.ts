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

// create 2dsphere index at GeoJSON point for querying events in a radius
eventSchema.index({ geometry: '2dsphere' });

const Event: Model<IEventDocument> = mongoose.model('event', eventSchema);

// // sends creteIndex commenad to db. not necassary as soon as index exists in db
// // commented out because not recommended for production (performance issue)
// // see https://mongoosejs.com/docs/api.html#model_Model.ensureIndexes
// Event.on('index', function (err) {
//   if (err) console.error(err);
// })

export default Event;