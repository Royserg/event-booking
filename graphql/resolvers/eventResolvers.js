const gql = require('graphql-tag');

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

const eventResolvers = {
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

  Mutation: {
    createEvent: async (parent, args, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!');
      }

      const event = new Event({
        title: args.title,
        description: args.description,
        price: args.price,
        date: new Date(args.date),
        creatorId: req.userId
      });
      // holds info about the event
      let createdEvent;
      try {
        // save new event to db
        const result = await event.save();
        createdEvent = transformEvent(result);
        // hard coded user => add event to his array
        const user = await User.findById(req.userId);

        if (!user) {
          throw new Error('User not found');
        }
        // save event to user array of events
        user.createdEvents.push(event);
        // update user info in db (added new event)
        await user.save();

        return createdEvent;
      } catch (err) {
        throw err;
      }
    },
    deleteEvent: async (parent, args, req) => {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!');
      }

      const res = await Event.deleteOne({ _id: args.eventId });
      // deletedCount should return 1, will give 0 if nothing was deleted (converted to false)
      return res.deletedCount;
    }
  },

  Event: {
    creator: event => User.findById(event.creatorId)
  }
};

module.exports = eventResolvers;
