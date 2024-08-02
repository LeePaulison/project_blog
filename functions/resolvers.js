import { mockUsers } from "./mocks.js";
import { db } from "./db.js";
import { getDocs, addDoc, collection } from "firebase/firestore";

const userCollection = collection(db, "users");

export const resolvers = {
  Query: {
    users: async () => {
      const querySnapshot = await getDocs(userCollection);

      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return users;
    },
    user: (_, { id }) => mockUsers.find((user) => user.id === id),
  },
  Mutation: {
    addUser: async (_, { userName, email }) => {
      const docRef = await addDoc(userCollection, {
        userName,
        email,
      });

      const newUser = {
        id: docRef.id,
        userName,
        email,
      };

      return newUser;
    },
  },
};
