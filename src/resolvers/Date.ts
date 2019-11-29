import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

// custom date scalar
// from https://www.apollographql.com/docs/graphql-tools/scalars/
export const Date = new GraphQLScalarType({
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
