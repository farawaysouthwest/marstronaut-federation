const {ApolloServer, gql} = require('apollo-server');
const {readFileSync} = require('fs');
const {buildSubgraphSchema} = require('@apollo/subgraph');

const typeDefs = gql(readFileSync('./accounts.graphql', {encoding: 'utf-8'}));
const resolvers = require('./resolvers');
const TotallySource = require('./datasources/totally');

const server = new ApolloServer({
  schema: buildSubgraphSchema({typeDefs, resolvers}),
  dataSources: () => {
    return {
      totallySource: new TotallySource()
    };
  },
  context: async ({req}) => {
    const token = req.headers.authorization || ''; // e.g., "Bearer user-1"
    // Get the user token after "Bearer "
    const id = token.split(' ')[1]; // e.g., "user-1"
    if (req.headers.userId) { // clean this up, assign userId to a var and start using real data
      return {user: {userId: id, userRole:"test"}}
    }
    //if (!id) throw new AuthenticationError('You must be logged in');
    else {
      return {userId: "nonce"}
    }
  }
});

const port = 4003;
const subgraphName = 'accounts';

server
  .listen({port})
  .then(({url}) => {
    console.log(`🚀 Subgraph ${subgraphName} running at ${url}`);
  })
  .catch(err => {
    console.error(err);
  });