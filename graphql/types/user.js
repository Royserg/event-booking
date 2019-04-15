const Event = require('../../models/event');
const User = require('../../models/user');

const UserType = `
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
