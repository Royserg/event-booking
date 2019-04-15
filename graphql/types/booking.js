const gql = require('graphql-tag');

const User = require('../../models/user');
const Event = require('../../models/event');
const Booking = require('../../models/booking');

const { dateToString } = require('../../helpers/date.js');

/**
 * Function that return event object with
 * better formatted data
 */
const transformBooking = booking => {
  return {
    ...booking._doc,
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};

const BookingType = gql`
  extend type Query {
    bookings: [Booking]
  }

  type Booking {
    _id: ID!
    user: User
    event: Event
    createdAt: String
    updatedAt: String
  }
`;

const bookingResolver = {
  Query: {
    bookings: async () => {
      try {
        const bookings = await Booking.find({});
        return bookings.map(booking => transformBooking(booking));
      } catch (err) {
        throw err;
      }
    }
  },

  Booking: {
    user: booking => User.findById(booking.user),
    event: booking => Event.findById(booking.event)
  }
};

module.exports = { BookingType, bookingResolver };
