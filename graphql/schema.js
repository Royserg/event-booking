const bcrypt = require('bcryptjs');
const { makeExecutableSchema } = require('graphql-tools');

const { merge } = require('lodash');

const Event = require('../models/event');
const User = require('../models/user');
const Booking = require('../models/booking');

// TODO: move and convert mutations into separate files
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
