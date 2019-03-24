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
    password: { type: GraphQLString }
  })
});

const EventType = new GraphQLObjectType({
  name: 'Event',
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    price: { type: GraphQLFloat },
    date: { type: GraphQLString }
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
      resolve(parent, args) {
        return Event.find({});
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
      },
      resolve(parent, args) {
        const event = new Event({
          title: args.title,
          description: args.description,
          price: args.price,
          date: new Date(args.date)
        });

        return event
          .save()
          .then(result => {
            console.log(result);
            return { ...result._doc };
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      }
    },
    createUser: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        return bcrypt
          .hash(args.password, 12)
          .then(hashedPassword => {
            const user = new User({
              email: args.email,
              password: hashedPassword
            });
            return user.save();
          })
          .then(result => {
            return { ...result._doc, _id: result.id, password: null };
          })
          .catch(err => {
            throw err;
          });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

/* dummy data */
const users = [
  {
    id: 1,
    name: 'Jake Jon'
  },
  {
    id: 2,
    name: 'Mike Mo'
  },
  {
    id: 3,
    name: 'Lerns Lorn'
  }
];

// const events = [
//   {
//     _id: 1,
//     title: 'Event 1',
//     description: 'Programming',
//     price: 200.0,
//     date: 19 - 09 - 2018
//   },
//   {
//     _id: 2,
//     title: 'Event 2',
//     description: 'Conference',
//     price: 571.0,
//     date: 21 - 11 - 2019
//   },
//   {
//     _id: 3,
//     title: 'Event 3',
//     description: 'Online Gaming',
//     price: 10.0,
//     date: 03 - 03 - 2019
//   }
// ];
