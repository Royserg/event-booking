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

const transformEvent = event => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date)
  };
};

const bookingResolvers = {
  Query: {
    bookings: async (parent, args, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!');
      }

      try {
        const bookings = await Booking.find({ user: req.userId });
        return bookings.map(booking => transformBooking(booking));
      } catch (err) {
        throw err;
      }
    }
  },

  Mutation: {
    bookEvent: async (parent, args, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!');
      }

      try {
        const booking = new Booking({
          user: req.userId,
          event: args.eventId
        });

        const result = await booking.save();
        return transformBooking(result);
      } catch (err) {
        throw err;
      }
    },
    cancelBooking: async (parent, args, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!');
      }

      try {
        // find whole booking object
        const booking = await Booking.findById(args.bookingId);
        // get Event object
        const event = await Event.findById(booking.event);
        // delete booking
        await booking.remove();
        // send back information about the canelled event
        return transformEvent(event);
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

module.exports = bookingResolvers;
