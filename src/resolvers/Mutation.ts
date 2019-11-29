import { AuthenticationError } from 'apollo-server-express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

// mongoose models
import Event from '../model/eventModel';
import User from '../model/userModel';

// interfaces for mongoose documents
import { IEventDocument, IUserDocument } from '../interfaces';

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

  // throw error if user is not logged in
  if (!user) {
    throw new AuthenticationError('You are not logged in.');
  }

  // commented out because combination of coordinates is not unique yet
  // const eventExists = await Event.findOne({ coordinates: args.coordinates });
  // if (eventExists) {
  //   throw new Error('An event with these exact coordinates already exists.');
  // }

  const now: Date = new Date();

  // create new event mongoose document
  const newEvent: IEventDocument = new Event({
    geometry: {
      type: "Point",
      coordinates: args.coordinates,
    },
    radius: args.radius,
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


