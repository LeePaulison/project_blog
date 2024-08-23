import { database } from "./db/db.js";

import { UserService } from "./services/userService.js";
const userService = new UserService(database);

export const resolvers = {
  Query: {
    getUsers: async () => {
      return await userService.getAllUsers();
    },
    getUser: async (_, { userId }) => {
      return await userService.getUserById(userId);
    },
    me: async (_, __, { userId }) => {
      return await userService.me(userId);
    },
  },
  Mutation: {
    addUser: async (_, user) => {
      return await userService.addUser(user);
    },
    login: async (_, user, { res }) => {
      const userId = await userService.userLogin(user.email, user.password);
      const userCookie = await userService.createCookie(userId);
      res.setHeader("Set-Cookie", userCookie);
      return userId ? true : false;
    },
    signUp: async (_, user, { res }) => {
      const userId = await userService.addUser(user);
      const userCookie = await userService.createCookie(userId);
      res.setHeader("Set-Cookie", userCookie);
      return userId ? true : false;
    },
    updateUser: async (_, { userName, email, name, password }, { userId }) => {
      return await userService.updateUser(userId, userName, email, name, password);
    },
    deleteUser: async (_, { userId }) => {
      return await userService.deleteUser(userId);
    },
    deleteMe: async (_, __, { userId }) => {
      return await userService.deleteUser(userId);
    },
  },
};
