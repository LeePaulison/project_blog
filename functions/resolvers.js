import { db } from "./db.js";
import { doc, getDoc, getDocs, addDoc, collection } from "firebase/firestore";

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
    user: async (_, { id }) => {
      try {
        const docRef = doc(userCollection, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          return {
            id: docSnap.id,
            ...docSnap.data(),
          };
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
