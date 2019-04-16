const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

const userResolvers = {
  Query: {
    users: async () => await User.find({})
  },
  Mutation: {
    createUser: async (parent, args) => {
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
        // return { ...result._doc, _id: result.id, password: null };
        return result;
      } catch (err) {
        throw err;
      }
    }
  },

  User: {
    events: user => Event.find({ creatorId: user._id })
  }
};

module.exports = userResolvers;
