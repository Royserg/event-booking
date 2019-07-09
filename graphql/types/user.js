const gql = require('graphql-tag');

const UserType = gql`
  type User {
    _id: ID!
    email: String!
    events: [Event]
  }

  extend type Query {
    users: [User]
    login(email: String!, password: String!): AuthData!
  }

  extend type Mutation {
    createUser(email: String!, password: String!): User
  }
`;

module.exports = UserType;
