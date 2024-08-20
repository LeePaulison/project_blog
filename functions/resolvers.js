import { database } from "./db/db.js";
import bcrypt from "bcryptjs";
const saltRounds = process.env.SALT || 10;
const hashKey = process.env.HASH_SECRET || "password";

console.log(`Salt: ${parseInt(saltRounds)}`);
console.log(`Hash Key: ${hashKey}`);

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
    login: async (_, { email, password }) => {
      let user = null;
      try {
        const usersCollection = database.collection("users");

        if (usersCollection) {
          const query = {
            email,
            password: await bcrypt.hash(password, hash),
          };
          const options = {};
          user = await usersCollection.findOne(query, options);
          console.log(`User: ${JSON.stringify(user, null, 2)}`);
        }
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
          const result = await usersCollection.insertOne({
            email,
            userName,
            name,
            password: await bcrypt.hash(password, hash),
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
      return newUser ? true : false;
    },
    updateUser: async (_, { currentEmail, userName, email, name, password }) => {
      let updatedUser = null;
      try {
        const usersCollection = database.collection("users");

        console.log("currentEmail: ", currentEmail);

        if (usersCollection) {
          const query = { email: currentEmail };
          const options = { returnDocument: "after" };
          const currentUser = await usersCollection.findOne(query);
          console.log(`currentUser: ${JSON.stringify(currentUser, null, 2)}`);
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
