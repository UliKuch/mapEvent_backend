import { GraphQLScalarType } from 'graphql';

// custom coordinates scalar
export const Coordinates = new GraphQLScalarType({
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
