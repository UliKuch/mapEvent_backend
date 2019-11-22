// treat file as module to avoid "cannot redeclare block-scoped variable" error
export {};

const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const app = express();
const port = process.env.PORT || 5000;

const typeDefs = require('./schema');

const resolvers = {
  Query: {
    info: () => 'This is an info.',
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.applyMiddleware({ app });

app.get('/', (req, res) => {
  res.send('I am a serving server');
});

app.listen(port, () => {
  return console.log(`GraphQL API server on ${port}${server.graphqlPath}`);
});