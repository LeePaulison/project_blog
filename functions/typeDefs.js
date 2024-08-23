export const typeDefs = `#graphql
  type User {
    _id: ID!
    name: String
    userName: String
    email: String
    password: String
  }

  type Query {
    me: User
    getUser(userId: ID!): User
    getUsers: [User]
  }

  type Mutation {
    addUser(userName: String!, email: String!, name: String!, password: String!): User
    login(email: String!, password: String!): Boolean
    signUp(userName: String!, email: String!, name: String!, password: String!): Boolean
    signOut: Boolean
    updateUser(userName: String, email: String, name: String, password: String): User
    deleteUser(userId: ID!): Boolean
    deleteMe: Boolean
  }
`;
