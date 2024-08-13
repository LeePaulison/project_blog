export const typeDefs = `#graphql
  type User {
    _id: ID!
    name: String
    userName: String
    email: String
    password: String
  }

  type Query {
    user( email: String, password: String): User
    users: [User]
  }

  type Mutation {
    addUser(userName: String!, email: String!, name: String!, password: String!): User
  }
`;
