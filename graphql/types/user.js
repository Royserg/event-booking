const Event = require('../../models/event');
const User = require('../../models/user');
const gql = require('graphql-tag');

const UserType = gql`
  extend type Query {
    users: [User]
  }

  type User {
    _id: ID!
    email: String!
    events: [Event]
  }
`;

const userResolver = {
  Query: {
    users: async () => await User.find({})
  },

  User: {
    events: user => Event.find({ creatorId: user._id })
  }
};

module.exports = { UserType, userResolver };
