const { makeExecutableSchema } = require('graphql-tools');

const { merge } = require('lodash');

const { UserType, EventType, BookingType, AuthDataType } = require('./types');
const {
  userResolvers,
  eventResolvers,
  bookingResolvers
} = require('./resolvers');

const QueryType = `
  type Query {
   _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

// keep for resolvers that don't fit in any file
const resolvers = {};

const schema = makeExecutableSchema({
  typeDefs: [QueryType, UserType, BookingType, EventType, AuthDataType],
  resolvers: merge(resolvers, userResolvers, eventResolvers, bookingResolvers)
});

module.exports = schema;
