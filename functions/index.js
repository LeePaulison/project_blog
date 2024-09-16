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

      if (!userToken && !req.warnedTokenNotFound) {
        console.warn("No user token found");
        req.warnedTokenNotFound = true;
        // Return a context indicating that no user is authenticated
        return { req, res, isAuthenticated: false };
      }

      // Verify the token
      const decodedToken = jwt.verify(userToken, process.env.JWT_SECRET);
      const userId = decodedToken.userId;

      // If successful, return userId and mark the user as authenticated
      return { userId, req, res, isAuthenticated: true };
    } catch (error) {
      // Handle specific JWT errors
      if (error.name === "TokenExpiredError") {
        console.error("Token expired");
        // Optionally, clear the cookie or return token-expired context
        return { req, res, isAuthenticated: false, error: "TokenExpired" };
      } else if (error.name === "JsonWebTokenError") {
        console.error("Invalid token");
        // Handle invalid token case
        return { req, res, isAuthenticated: false, error: "InvalidToken" };
      } else {
        // Catch any other error during verification
        console.error(`Error verifying token: ${error.message}`);
      }

      // Return a default context if there's an error
      return { req, res, isAuthenticated: false, error: "TokenVerificationFailed" };
    }
  },
});

console.log(`🚀  Server ready at: ${url}`);
