// treat file as module to avoid "cannot redeclare block-scoped variable" error
export {};

// enable reading from .env file
require('dotenv').config();

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

interface IauthObj {
  // specify authUser object in detail when token structure is determined
  authUser?: object
}

// partly inspired by https://www.toptal.com/graphql/creating-your-first-graphql-api
const auth = ({ req }) => {
  const authObj: IauthObj = {};

  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.replace('Bearer ', '') : undefined;
  authObj.authUser = token ? jwt.verify(token, secret) : undefined;

  return authObj;
}

module.exports = auth;