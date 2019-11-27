import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

import Event from './model/eventModel';
import User from './model/userModel';

import { IEventDocument, IUserDocument } from './interfaces';

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
      return await Event.find({});
    },
    event: async (parent, args, { id }, info) => {
      return await Event.findOne({ id: id})
    },
  },
  Mutation: {
    addEvent: async (parent, args, context, info) => {

      // TODO: add authentication by searching context.userId in db

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
        // add after user authentication is implemented
        // createdBy: context.userId,
        creationDate: now,
        comments: [],
      })

      return await newEvent.save();
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