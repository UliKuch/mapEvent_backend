import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    events: [Event!]!
    event(
      id: ID!,
    ): Event!
  }

  type Mutation {
    addEvent(
      coordinates: Coordinates,
      radius: Float,
      category: String, 
      title: String!,
      body: String,
      img: String,
    ): Event!
  }

  type Event {
    id: ID!
    geometry: GeoJSONPoint!
    # TODO: research on radius and MongoDB
    radius: Float
    category: String
    title: String!
    body: String
    img: String
    # createdBy: User!
    creationDate: Date!
    comments: [Comment!]
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
    type: String!
    coordinates: Coordinates!
  }

  scalar Coordinates

  scalar Date
`;

module.exports = typeDefs;