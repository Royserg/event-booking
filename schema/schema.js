const graphql = require('graphql');

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
    id: { type: GraphQLID },
    name: { type: GraphQLString }
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
        return users;
      }
    },
    events: {
      type: new GraphQLList(EventType),
      resolve(parent, args) {
        return events;
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
        let event = {
          _id: events.length + 1,
          title: args.title,
          description: args.description,
          price: args.price,
          date: args.date
        };

        events.push(event);
        return event;
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

const events = [
  {
    _id: 1,
    title: 'Event 1',
    description: 'Programming',
    price: 200.0,
    date: 19 - 09 - 2018
  },
  {
    _id: 2,
    title: 'Event 2',
    description: 'Conference',
    price: 571.0,
    date: 21 - 11 - 2019
  },
  {
    _id: 3,
    title: 'Event 3',
    description: 'Online Gaming',
    price: 10.0,
    date: 03 - 03 - 2019
  }
];
