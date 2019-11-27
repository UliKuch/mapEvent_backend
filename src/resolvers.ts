import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { AuthenticationError } from 'apollo-server-express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import Event from './model/eventModel';
import User from './model/userModel';

import { IEventDocument, IUserDocument } from './interfaces';

// enable reading from .env file
require('dotenv').config();

const secret: jwt.Secret = process.env.JWT_SECRET;

// custom coordinates scalar
const CoordinatesType = new GraphQLScalarType({
  name: 'Coordinates',
  description: 'A set of coordinates. x, y',
  serialize(value) {
    return isCoordinate(value)
  },
  parseValue(value) {
    return isCoordinate(value)
  },
  parseLiteral(ast: any) {
    return isCoordinate(ast.value);
  },
});

// helper function for coordinates scalar
function isCoordinate(value: number[]) {
  if (value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number') {
    return value;
  }
  return null;
}


module.exports = {
  Query: {
    events: async (parent, args, context, info) => {
      return await Event.find({}).populate('user');
    },
    event: async (parent, args, { id }, info) => {
      return await Event.findOne({ id: id}).populate('user');
    },
  },
  Mutation: {
    addEvent: async (parent, args, context, info) => {

      const user = await User.findById(context.user.userId);

      if (!user) {
        throw new AuthenticationError('You are not logged in.');
      }

      const now: Date = new Date();

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
        createdBy: user._id,
        creationDate: now,
        comments: [],
      })

      return await newEvent.save();
    },
    signup: async (parent, args, context, info) => {

      const userExists = await User.findOne({ email: args.email });

      if (userExists) {
        throw new Error('A user with this email address already exists.');
      }

      const password = await bcrypt.hash(args.password, 10);

      const newUser: IUserDocument = new User({
        email: args.email,
        username: args.username,
        firstName: args.firstName,
        middleName: args.middleName,
        lastName: args.lastName,  
        password: password,      
      })

      await newUser.save();

      // create JWT payload
      const payload = {
        id: newUser._id,
      };
      const options: jwt.SignOptions = {expiresIn: "2 days"};

      // sign token
      const token: string = jwt.sign(payload, secret, options);

      console.log(token);

      return token;
    },
    login: async (parent, args, context, info) => {
      const password = await bcrypt.hash(args.password, 10);

      const user = await User.findOne({ email: args.email });

      if (!user) {
        throw new AuthenticationError('No user with this email address.')
      }

      if (!bcrypt.compare(password, user.password)) {
        throw new AuthenticationError('Password incorrect.')
      }

      // create JWT payload
      const payload = {
        id: user._id,
      };
      const options: jwt.SignOptions = {expiresIn: "2 days"};

      // sign token
      const token: string = jwt.sign(payload, secret, options);

      console.log(token);

      return token
    },
  },
  Event: {
  },
  User: {
    events: (parent, args, context, info) => {
      return null
    },
  },
  Comment: {
    user: (parent, args, context, info) => {
      return null
    },
  },
  GeoJSONPoint: {
    type: () => 'Point',
  },
  Coordinates: () => CoordinatesType,
  // from https://www.apollographql.com/docs/graphql-tools/scalars/
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Custom date scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast: any) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  })
}