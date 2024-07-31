/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const mockUsers = [
  {
    id: "1",
    userName: "user1",
    email: "jane.doe@example.com",
  },
  {
    id: "2",
    userName: "user2",
    email: "john.doe@example.com",
  },
];

const typeDefs = `#graphql
  type User {
    id: ID!
    userName: String
    email: String
  }

  type Query {
    user(id: ID!): User
    users: [User]
  }
`;

const resolvers = {
  Query: {
    users: () => mockUsers,
    user: (_, { id }) => mockUsers.find((user) => user.id === id),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
