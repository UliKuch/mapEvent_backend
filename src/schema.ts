const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    info: String!
    event: Event!
  }

  type Mutation {
    postEvent(
      geometry: Point!,
      category: String!, 
      title: String!,
      body: String,
      img: String,
      properties: [Property!]
    ): Event!
  }

  type Event {
    geometry: Point!
    id: ID!
    category: String!
    title: String!
    body: String
    img: String
    properties: [Property!]
    postedBy: User
  }

  type User {
    id: ID!
    name: String!
    email: String!
    events: [Event!]!
  }

  type Point {
    id: ID!
  }

  type Property {
    id: ID!
  }
`;

module.exports = typeDefs;