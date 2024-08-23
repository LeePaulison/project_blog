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
import "dotenv/config";
import jwt from "jsonwebtoken";
import cookie from "cookie";

import { typeDefs } from "./typeDefs.js";
import { resolvers } from "./resolvers.js";

const context = async ({ req, res }) => {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.token || "";

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log("user", user);
    return { user, req, res };
  } catch (error) {
    console.error(`Error verifying token: ${error}`);
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    try {
      const cookies = cookie.parse(req.headers.cookie || "");
      const userToken = cookies.user || "";

      if (!userToken) {
        consolewarn("No user token found");
        return { req, res };
      }
      const decodedToken = jwt.verify(userToken, process.env.JWT_SECRET);
      const userId = decodedToken.userId;

      return { userId, req, res };
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        console.error("Token expired");
      } else if (error.name === "JsonWebTokenError") {
        console.error("Invalid token");
      } else {
        console.error(`Error verifying token: ${error.message}`);
      }
    }

    return { req, res };
  },
});

console.log(`🚀  Server ready at: ${url}`);
