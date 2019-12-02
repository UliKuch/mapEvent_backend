import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    event(
      id: ID!,
    ): Event!
    events: [Event!]!
    eventsInRadius (
      radius: Int!,
      location: GeoJSONPointInput!
      category: String
    ): [Event!]!
  }

  type Mutation {
    signup(
      email: String!,
      username: String,
      firstName: String!,
      middleName: String,
      lastName: String!,
      password: String!,
    ): String!
    login(email: String!, password: String!): String!
    addEvent(
      coordinates: Coordinates,
      category: String, 
      title: String!,
      body: String,
      img: String,
    ): Event!
    addComment(message: String!, eventId: ID!): Comment!
  }

  type Event {
    id: ID!
    geometry: GeoJSONPoint!
    category: String
    title: String!
    body: String
    img: String
    createdBy: User!
    creationDate: Date!
    comments: [Comment!]!
  }

  type User {
    id: ID!
    email: String!
    username: String
    firstName: String!
    middleName: String
    lastName: String!
    events: [Event!]!
  }

  type Comment {
    id: ID!
    user: User!
    message: String!
    postedOn: Date!
  }

  type GeoJSONPoint {
    type: GeoJSONPointType
    coordinates: Coordinates!
  }

  input GeoJSONPointInput {
    type: GeoJSONPointType
    coordinates: Coordinates!
  }

  enum GeoJSONPointType {
    Point
  }

  scalar Coordinates

  scalar Date
`;

module.exports = typeDefs;