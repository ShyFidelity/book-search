const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
        me: async (parent, args, context) => {
          if (context.user) {
            return User.findOne({ _id: context.user._id })
              .populate('savedBooks')
              .select('-password');
          }
          throw new AuthenticationError('You need to be logged in!');
        },
      },


    Mutation: {
      addUser: async (parent, {username, email, password}) => {
        const newUser= await User.create({username, email, password});
        const token = signToken(newUser);
        return {token, newUser}
      }
    }
}