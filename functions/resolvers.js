import { database } from "./db/db.js";

export const resolvers = {
  Query: {
    users: async () => {
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
    user: async (_, { email, password }) => {
      let user = null;

      try {
        const usersCollection = database.collection("users");

        if (usersCollection) {
          const query = {
            email: email,
            password: password,
          };
          const options = {};
          user = await usersCollection.findOne(query, options);
          console.log(user);
        }
      } catch (error) {
        console.error(`Error querying the database ${error}`);
      }

      return user;
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
          console.log(`addUser Result: ${JSON.stringify(newUser)}`);
        }
      } catch (error) {
        console.error(`Error adding new user: ${error}`);
      }
      return newUser;
    },
  },
};
