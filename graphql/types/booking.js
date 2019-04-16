const gql = require('graphql-tag');

const BookingType = gql`
  type Booking {
    _id: ID!
    user: User
    event: Event
    createdAt: String
    updatedAt: String
  }

  extend type Query {
    bookings: [Booking]
  }

  extend type Mutation {
    bookEvent(eventId: ID!): Booking
    cancelBooking(bookingId: ID!): Event
  }
`;

module.exports = BookingType;
