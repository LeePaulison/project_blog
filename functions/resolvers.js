import { database } from "./db/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";
const saltRounds = process.env.SALT || 10;
const hashKey = process.env.HASH_SECRET || "password";
const jwt_hash = process.env.JWT_SECRET || "secret";

const salt = bcrypt.genSaltSync(parseInt(saltRounds));
const hash = bcrypt.hashSync(hashKey, salt);

export const resolvers = {
  Query: {
    getUsers: async () => {
      let users = null;
      try {
        const usersCollection = database.collection("users");

        if (usersCollection) {
          const query = {};
          const options = {};
          users = await usersCollection.find(query, options).toArray();
        }
      } catch (error) {
        console.error(`Error querying the database ${error}`);
      }

      return users;
    },
    me: async (_, __, { user }) => {
      let me = null;
      try {
        const usersCollection = database.collection("users");
        if (usersCollection) {
          const query = {
            id: user.id,
          };
          const options = {};
          me = await usersCollection.findOne(query, options);
          console.log(`User: ${JSON.stringify(me, null, 2)}`);
        }
      } catch (error) {
        console.error(`Error querying the database ${error}`);
      }

      return me;
    },
  },
  Mutation: {
    addUser: async (_, { userName, email, name, password }) => {
      let newUser;
      try {
        const usersCollection = database.collection("users");

        if (usersCollection) {
          const result = await usersCollection.insertOne({
            email,
            userName,
            name,
            password,
          });

          newUser = {
            _id: result.insertedId,
            email,
            userName,
            name,
            password,
          };
        }
      } catch (error) {
        console.error(`Error adding new user: ${error}`);
      }
      return newUser;
    },
    login: async (_, { email, password }, { res, req }) => {
      if (!res || !req) {
        console.error("No response or request object found");
        return false;
      }

      let user = null;
      try {
        const usersCollection = database.collection("users");

        if (!usersCollection) {
          throw new Error("No users collection found");
        }

        const options = {};
        user = await usersCollection.findOne({ email }, options);
        if (!user || user === null) {
          throw new Error("User not found");
        }
        console.log(`User: ${JSON.stringify(user, null, 2)}`);

        const doPasswordsMatch = await bcrypt.compare(password, user.password);
        if (!doPasswordsMatch) {
          throw new Error("Passwords do not match");
        }
        console.log(`Password match: ${doPasswordsMatch}`);

        const token = jwt.sign(user, jwt_hash, { expiresIn: "1h" });
        const loginCookie = cookie.serialize("token", token, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 3600,
        });
        res.setHeader("Set-Cookie", loginCookie);
      } catch (error) {
        console.error(`Error querying the database ${error}`);
      }

      return user ? true : false;
    },
    signUp: async (_, { userName, email, name, password }) => {
      let newUser;
      try {
        const usersCollection = database.collection("users");

        if (usersCollection) {
          const userExists = await usersCollection.findOne({ email });

          if (userExists) {
            throw new Error("User already exists");
          }

          const encryptedPassword = await bcrypt.hash(password, hash);
          const result = await usersCollection.insertOne({
            email,
            userName,
            name,
            password: encryptedPassword,
          });

          newUser = {
            _id: result.insertedId,
            email,
            userName,
            name,
            password: encryptedPassword,
          };
        }
      } catch (error) {
        console.error(`Error adding new user: ${error}`);
      }
      return newUser ? true : false;
    },
    updateUser: async (_, { currentEmail, userName, email, name, password }) => {
      let updatedUser = null;
      try {
        const usersCollection = database.collection("users");

        if (usersCollection) {
          const query = { email: currentEmail };
          const options = { returnDocument: "after" };
          const currentUser = await usersCollection.findOne(query);
          const update = {
            $set: {
              email: email || currentUser.email,
              userName: userName || currentUser.userName,
              name: name || currentUser.name,
              password: password || currentUser.password,
            },
          };

          updatedUser = await usersCollection.findOneAndUpdate(query, update, options);
          if (updatedUser) {
            console.log(`Updated user: ${JSON.stringify(updatedUser, null, 2)}`);
          } else {
            console.log(`User not found: ${currentEmail}`);
          }
        }
      } catch (error) {
        console.error(`Error updating user: ${error}`);
      }
      return updatedUser;
    },
  },
};
