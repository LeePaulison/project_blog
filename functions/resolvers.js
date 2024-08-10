import { db } from "./db.js";
import { doc, getDoc, getDocs, addDoc, collection } from "firebase/firestore";

import { mockUsers } from "./mocks.js";

const userCollection = collection(db, "users");

export const resolvers = {
  Query: {
    users: async () => {
      const querySnapshot = await getDocs(userCollection);

      let users = null;

      if (querySnapshot) {
        users = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } else {
        users = mockUsers;
      }

      return users;
    },
    user: async (_, { id }) => {
      try {
        const docRef = doc(userCollection, id);

        let docSnap = null;

        if (docSnap) {
          docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            return {
              id: docSnap.id,
              ...docSnap.data(),
            };
          }
        } else {
          return mockUsers.find((item) => item.id === id);
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }

      return user;
    },
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
