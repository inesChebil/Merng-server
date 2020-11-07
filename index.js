const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const { MONGODB } = require("./config");
const resolvers = require("./graphql/resolvers");

const pubsub = new PubSub();

const PORT = process.env.PORT || 5000;
// For each query, mutation or subscription, we have a corresponding resolver

// set up the apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // we passed the pubsub in here to be able to use it in the resolvers
  // subscribtion is used to inform all the subscribers that the post has been added
  context: ({ req }) => ({ req, pubsub }), //this will forward the request to the context, so that we can access the header and determine if the user is authentificated
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDb connected");
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`server is running at ${res.url}`);
  })
  .catch((err) => {
    console.error(err);
  });
