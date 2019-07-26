const gql = require('graphql-tag');

const EventType = gql`
  type Event {
    _id: ID
    title: String
    description: String
    price: Float
    date: String
    creator: User
  }

  extend type Query {
    events: [Event!]!
  }

  extend type Mutation {
    createEvent(
      title: String!
      description: String!
      price: Float!
      date: String!
    ): Event
  }
`;

module.exports = EventType;
