const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    geometry: {


      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
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
    creationDate: Date,
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
  }]
})

module.exports = mongoose.model('user', userSchema);