import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

import eventModel from './model/eventModel';
import userModel from './model/userModel';

import { IEventDocument, IUserDocument } from './interfaces';

module.exports = {
  Query: {
    event: async (parent, args, context, info) => {
      return null
    },
  },
  Mutation: {
    addEvent: async (parent, args, context, info) => {

      const now: Date = new Date();

      const newEvent: IEventDocument = new eventModel({
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
        // createdBy: context.xxx,
        creationDate: now,
        comments: [],
      })

      return await newEvent.save();
    },
  },
  Event: {
    // geometry: (parent, args, context, info) => {
    //   return null
    // },
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
    // coordinates: (parent, args, context, info) => {
    //   return null
    // },
  },
  Coordinates: new GraphQLScalarType({
    name: 'Coordinates',
    description: 'A set of coordinates. x, y',
    parseValue(value) {
      return value;
    },
    serialize(value) {
      return value;
    },
    parseLiteral(ast: any) {
      return ast.value;
    },
  }),
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