import { AuthenticationError } from 'apollo-server-express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// mongoose models
import Event from '../model/eventModel';
import User from '../model/userModel';

// interfaces for mongoose documents
import { IEventDocument, IUserDocument, IComment } from '../interfaces';

// enable reading from .env file
require('dotenv').config();

// jwt secret
const secret: jwt.Secret = process.env.JWT_SECRET;


// *************** signup mutation ***************

export async function signup(parent, args, context, info) {
  
  // check if user's email already exists in db
  const userExists = await User.findOne({ email: args.email });
  if (userExists) {
    throw new Error('A user with this email address already exists.');
  }

  // hash password
  const password = await bcrypt.hash(args.password, 10);

  // create new user mongoose document
  const newUser: IUserDocument = new User({
    email: args.email,
    username: args.username,
    firstName: args.firstName,
    middleName: args.middleName,
    lastName: args.lastName,
    password: password,
  })

  // save new user to db
  await newUser.save();

  // create jwt payload
  const payload = {
    userId: newUser._id,
  };
  const options: jwt.SignOptions = {expiresIn: "2 days"};

  // sign token
  const token: string = jwt.sign(payload, secret, options);

  return token;
}


// *************** login mutation ***************

export async function login(parent, args, context, info) {

  // hash password
  const password = await bcrypt.hash(args.password, 10);

  // find user in db
  const user = await User.findOne({ email: args.email });

  // throw error if user does not exist
  if (!user) {
    throw new AuthenticationError('No user with this email address.')
  }

  // throw error if password is incorrect
  if (!bcrypt.compare(password, user.password)) {
    throw new AuthenticationError('Password incorrect.')
  }

  // create jwt payload
  const payload = {
    userId: user._id,
  };
  const options: jwt.SignOptions = {expiresIn: "2 days"};

  // sign token
  const token: string = jwt.sign(payload, secret, options);

  return token
}


// *************** addEvent mutation ***************

export async function addEvent(parent, args, context, info) {

  // find user in db
  const user = await User.findById(context.user.userId);

  // throw error if user is not found in db
  if (!user) {
    throw new AuthenticationError('You are not logged in or user does not exist.');
  }

  const long = args.coordinates[0];
  const lat = args.coordinates[1];

  // only allow valid coordinates
  if (long < -180 || long > 180 || lat < -90 || lat > 90) {
    throw new Error('Coordinates need to have the form [<longitude>, <latitude>]. Valid longitude values are between -180 and 180, valid latitude value are between -90 and 90.');
  }

  const now: Date = new Date();

  // create new event mongoose document
  const newEvent: IEventDocument = new Event({
    geometry: {
      type: "Point",
      coordinates: args.coordinates,
    },
    category: args.category,
    title: args.title,
    body: args.body,
    img: args.img,
    // user instead of user._id to enable requesting createdBy in GraphQL on addEvent
    createdBy: user,
    creationDate: now,
    comments: [],
  })

  // store new event id in user's events array
  user.events.push(newEvent._id);
  
  // save user and event to db
  await newEvent.save();
  await user.save();

  return newEvent;
}


// *************** addComment mutation ***************

export async function addComment(parent, { message, eventId }, context, info) {

  // find user in db
  const user = await User.findById(context.user.userId);

  // throw error if user is not found in db
  if (!user) {
    throw new AuthenticationError('You are not logged in or user does not exist.');
  }
  
  const now: Date = new Date();

  // create new comment object
  const newComment: IComment = {
    user: context.user.userId,
    message: message,
    postedOn: now,    
  }

  // find corresponding event in db
  const event = await Event.findById(eventId);

  // throw error if event is not found in db
  if (!event) {
    throw new Error('Event not found in database.')
  }

  // add new comment to event's comment array
  event.comments.push(newComment);
  
  // save updated event to db
  await event.save();

  // return newly added comment from event document
  // (newComment does not have an id yet)
  return event.comments[event.comments.length - 1]
}
