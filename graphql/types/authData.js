const gql = require('graphql-tag');

const AuthDataType = gql`
  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }
`;

module.exports = AuthDataType;
