export const typeDefs = `#graphql
  type User {
    _id: ID!
    name: String
    userName: String
    email: String
    password: String
  }

  type Query {
    getOneUser( email: String, password: String): User
    getUsers: [User]
  }

  type Mutation {
    addUser(userName: String!, email: String!, name: String!, password: String!): User
  }
`;
