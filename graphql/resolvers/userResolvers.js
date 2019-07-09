const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Event = require('../../models/event');
const User = require('../../models/user');

const userResolvers = {
  Query: {
    users: async () => await User.find({}),
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email: email });

      if (!user) {
        throw new Error('User does not exist');
      }
      // Compare incoming password with stored password
      const isEqual = await bcrypt.compare(password, user.password);

      // User exists but password's incorrect
      if (!isEqual) {
        throw new Error('Password is incorrect');
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        'somesecretkey',
        { expiresIn: '1h' }
      );

      return { userId: user.id, token: token, tokenExpiration: 1 };
    }
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
