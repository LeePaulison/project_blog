import { mockUsers } from "./mocks.js";
import { db } from "./db.js";
import { addDoc, collection, setLogLevel } from "firebase/firestore";

const userCollection = collection(db, "users");

try {
  const docRef = await addDoc(userCollection, {
    userName: "Ada",
    email: "ada.doe@example.com",
  });

  console.log("Document written with ID: ", docRef.id);
} catch (e) {
  console.error("Error adding document: ", e);
}

setLogLevel("debug");

try {
  console.log("Getting documents...");
  console.log(userCollection);
} catch (e) {
  console.error("Error getting collection: ", e);
}

export const resolvers = {
  Query: {
    users: () => mockUsers,
    user: (_, { id }) => mockUsers.find((user) => user.id === id),
  },
  Mutation: {
    addUser: (_, { userName, email }) => {
      const newUser = {
        id: String(mockUsers.length + 1),
        userName,
        email,
      };
      mockUsers.push(newUser);
      return newUser;
    },
  },
};
