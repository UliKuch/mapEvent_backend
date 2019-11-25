import { GraphQLScalarType } from 'graphql';

module.exports = {
  Query: {
    event: async (parent, args, context, info) => {
      return null
    },
  },
  Mutation: {
    addEvent: (parent, args, context, info) => {
      return null
    },
  },
  Event: {
    geometry: (parent, args, context, info) => {
      return null
    },
    coordinates: (parent, args, context, info) => {
      return null
    },
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
    coordinates: (parent, args, context, info) => {
      return null
    },
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
    parseLiteral(ast) {
      return ast.kind;
    },
  }),
}