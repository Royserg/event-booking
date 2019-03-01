const graphql = require('graphql');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLSchema
} = graphql;

/* dummy data */
const users = [
  {
    id: 1,
    name: 'Jake Jon'
  },
  {
    id: 2,
    name: 'Mike Mo'
  },
  {
    id: 3,
    name: 'Lerns Lorn'
  }
];

/* Types */
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString }
  })
});

/* Queries */
const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return users;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
