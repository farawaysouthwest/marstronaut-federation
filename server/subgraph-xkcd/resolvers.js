const { AuthenticationError } = require("apollo-server");

const resolvers = {
  Query: {
    // returns xkcd comic info based on comic number
    Comic: (_, {comic_number}, {dataSources, user}) => {
      console.log(user);
      return dataSources.xkcdAPI.getXkcd(comic_number);
    },
    totally: async (_, __, context) => {
      return context.dataSources.totallySource.getTotally();
 
    },
  },
  totally: {
    __resolveReference: ({id}, {dataSources}) => {
      return dataSources.totallySource.getTotally(id);
    }
  }

};

module.exports = resolvers;