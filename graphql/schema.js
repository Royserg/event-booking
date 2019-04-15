const bcrypt = require('bcryptjs');
const { gql, makeExecutableSchema } = require('graphql-tools');

const { merge } = require('lodash');

const Event = require('../models/event');
const User = require('../models/user');
const Booking = require('../models/booking');

const { dateToString } = require('../helpers/date.js');

// const {
//   GraphQLObjectType,
//   GraphQLID,
//   GraphQLString,
//   GraphQLList,
//   GraphQLSchema,
//   GraphQLNonNull,
//   GraphQLFloat
// } = require('graphql');

/* Types */
// const BookingType = new GraphQLObjectType({
//   name: 'Booking',
//   fields: () => ({
//     _id: { type: GraphQLID },
//     event: {
//       type: EventType,
//       resolve(parent, args) {
//         return Event.findById(parent.event);
//       }
//     },
//     user: {
//       type: UserType,
//       resolve(parent, args) {
//         return User.findById(parent.user);
//       }
//     },
//     createdAt: { type: GraphQLString },
//     updatedAt: { type: GraphQLString }
//   })
// });

// const UserType = new GraphQLObjectType({
//   name: 'User',
//   fields: () => ({
//     _id: { type: GraphQLID },
//     email: { type: GraphQLString },
//     // password: { type: GraphQLString },
//     createdEvents: {
//       type: new GraphQLList(EventType),
//       resolve(parent, args) {
//         return Event.find({ creatorId: parent._id });
//       }
//     }
//   })
// });

// const EventType = new GraphQLObjectType({
//   name: 'Event',
//   fields: () => ({
//     _id: { type: GraphQLID },
//     title: { type: new GraphQLNonNull(GraphQLString) },
//     description: { type: new GraphQLNonNull(GraphQLString) },
//     price: { type: GraphQLFloat },
//     date: { type: GraphQLString },
//     creator: {
//       type: UserType,
//       resolve(parent, args) {
//         return User.findById(parent.creatorId);
//       }
//     }
//   })
// });

/* Queries */
// const RootQuery = new GraphQLObjectType({
//   name: 'RootQuery',
//   fields: () => ({
//     users: {
//       type: new GraphQLList(UserType),
//       resolve: (parent, args) => {
//         return User.find({});
//       }
//     },
//     events: {
//       type: new GraphQLList(EventType),
//       async resolve(parent, args) {
//         try {
//           const events = await Event.find({});
//           return events.map(event => transformEvent(event));
//         } catch (err) {
//           throw err;
//         }
//       }
//     },
//     bookings: {
//       type: GraphQLList(BookingType),
//       async resolve(parent, args) {
//         try {
//           const bookings = await Booking.find({});
//           return bookings.map(booking => {
//             return transformBooking(booking);
//           });
//         } catch (err) {
//           throw err;
//         }
//       }
//     }
//   })
// });

/* Mutations */
// const Mutation = new GraphQLObjectType({
//   name: 'Mutation',
//   fields: {
//     createEvent: {
//       type: EventType,
//       args: {
//         title: { type: new GraphQLNonNull(GraphQLString) },
//         description: { type: new GraphQLNonNull(GraphQLString) },
//         price: { type: new GraphQLNonNull(GraphQLFloat) },
//         date: { type: new GraphQLNonNull(GraphQLString) }
//         // creator: { type: new GraphQLNonNull(GraphQLID) }
//       },
//       async resolve(parent, args) {
//         const event = new Event({
//           title: args.title,
//           description: args.description,
//           price: args.price,
//           date: new Date(args.date),
//           creatorId: '5c884b9189805707508b76b2'
//         });
//         // holds info about the event
//         let createdEvent;
//         try {
//           // save new event to db
//           const result = await event.save();
//           createdEvent = transformEvent(result);
//           // hard coded user => add event to his array
//           const user = await User.findById('5c884b9189805707508b76b2');

//           if (!user) {
//             throw new Error('User not found');
//           }
//           // save event to user array of events
//           user.createdEvents.push(event);
//           // update user info in db (added new event)
//           await user.save();

//           return createdEvent;
//         } catch (err) {
//           throw err;
//         }
//       }
//     },
//     createUser: {
//       type: UserType,
//       args: {
//         email: { type: new GraphQLNonNull(GraphQLString) },
//         password: { type: new GraphQLNonNull(GraphQLString) }
//       },
//       async resolve(parent, args) {
//         try {
//           const existingUser = await User.findOne({ email: args.email });

//           if (existingUser) {
//             throw new Error('User already exists!');
//           }
//           // hash password and create new user
//           const hashedPassword = await bcrypt.hash(args.password, 12);
//           const user = new User({
//             email: args.email,
//             password: hashedPassword
//           });

//           const result = await user.save();
//           // return { ...result._doc, _id: result.id, password: null };
//           return result;
//         } catch (err) {
//           throw err;
//         }
//       }
//     },
//     bookEvent: {
//       type: BookingType,
//       args: {
//         eventId: { type: new GraphQLNonNull(GraphQLID) }
//       },
//       async resolve(parent, args) {
//         try {
//           const booking = new Booking({
//             user: '5c884b9189805707508b76b2',
//             event: args.eventId
//           });

//           const result = await booking.save();
//           return transformBooking(result);
//         } catch (err) {
//           throw err;
//         }
//       }
//     },
//     cancelBooking: {
//       type: EventType,
//       args: {
//         bookingId: { type: new GraphQLNonNull(GraphQLID) }
//       },
//       async resolve(parent, args) {
//         try {
//           // find whole booking object
//           const booking = await Booking.findById(args.bookingId);
//           // get Event object
//           const event = await Event.findById(booking.event);
//           // delete booking
//           await booking.remove();
//           // send back information about the canelled event
//           return transformEvent(event);
//         } catch (err) {
//           throw err;
//         }
//       }
//     }
//   }
// });

// const schema = new GraphQLSchema({
//   query: RootQuery,
//   mutation: Mutation
// });

// module.exports = schema;

const { UserType, userResolver } = require('./types/user');
const { EventType, eventResolver } = require('./types/event');
const { BookingType, bookingResolver } = require('./types/booking');

const QueryType = `
  type Query {
   _empty: String
  }
`;

const resolvers = {};

const schema = makeExecutableSchema({
  typeDefs: [QueryType, UserType, BookingType, EventType],
  resolvers: merge(resolvers, userResolver, eventResolver, bookingResolver)
});

module.exports = schema;
