const User = require('../../models/user');
const Event = require('../../models/event');

const { dateToString } = require('../../helpers/date.js');

/**
 * Function that return event object with
 * better formatted data
 */
const transformEvent = event => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date)
  };
};

const EventType = `
  extend type Query {
    events: [Event]
  }

  type Event {
    _id: ID
    title: String
    description: String
    price: Float
    date: String
    creator: User
  }
`;

const eventResolver = {
  Query: {
    events: async () => {
      try {
        const events = await Event.find({});
        return events.map(event => transformEvent(event));
      } catch (err) {
        throw err;
      }
    }
  },

  Event: {
    creator: event => User.findById(event.creatorId)
  }
};

module.exports = { EventType, eventResolver };
