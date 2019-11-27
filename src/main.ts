// treat file as module to avoid "cannot redeclare block-scoped variable" error
export {};

const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');

// enable reading from .env file
require('dotenv').config();

// express
const app = express();
const port = process.env.PORT || 5000;

// db
const db = process.env.MONGO_URI;

// GraphQL
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const readTokenFromHeader = require('./utils');

// Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: readTokenFromHeader,
});

server.applyMiddleware({ app });

app.get('/', (req, res) => {
  res.send('I am a serving server');
});

app.listen(port, () => {
  return console.log(`GraphQL API server on ${port}${server.graphqlPath}`);
});

// connecting to db
mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log("Connection to Mongo DB established"))
  .catch(err => console.log(err));