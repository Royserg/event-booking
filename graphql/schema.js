const graphql = require('graphql');
const bcrypt = require('bcryptjs');

const Event = require('../models/event');
const User = require('../models/user');

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLFloat
} = graphql;

/* Types */
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: { type: GraphQLID },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    createdEvents: {
      type: new GraphQLList(EventType),
      resolve(parent, args) {
        return Event.find({ creatorId: parent._id });
      }
    }
  })
});

const EventType = new GraphQLObjectType({
  name: 'Event',
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    price: { type: GraphQLFloat },
    date: { type: GraphQLString },
    creator: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.creatorId);
      }
    }
  })
});

/* Queries */
const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({});
      }
    },
    events: {
      type: new GraphQLList(EventType),
      async resolve(parent, args) {
        try {
          const events = await Event.find({});
          return events.map(event => {
            return {
              ...event._doc,
              date: new Date(event._doc.date).toISOString()
            };
          });
        } catch (err) {
          throw err;
        }
      }
    }
  }
});

/* Mutations */
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createEvent: {
      type: EventType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLFloat) },
        date: { type: new GraphQLNonNull(GraphQLString) }
        // creator: { type: new GraphQLNonNull(GraphQLID) }
      },
      async resolve(parent, args) {
        const event = new Event({
          title: args.title,
          description: args.description,
          price: args.price,
          date: new Date(args.date),
          creatorId: '5c884b9189805707508b76b2'
        });
        // holds info about the event
        let createdEvent;
        try {
          // save new event to db
          const result = await event.save();
          createdEvent = { ...result._doc };
          // hard coded user => add event to his array
          const user = await User.findById('5c884b9189805707508b76b2');

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
      }
    },
    createUser: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        try {
          const existingUser = await User.findOne({ email: args.email });

          if (existingUser) {
            throw new Error('User already exists!');
          }
          // hash password and create new user
          const hashedPassword = await bcrypt.hash(args.password, 12);
          const user = new User({
            email: args.email,
            password: hashedPassword
          });

          const result = await user.save();
          return { ...result._doc, _id: result.id, password: null };
        } catch (err) {
          throw err;
        }
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
