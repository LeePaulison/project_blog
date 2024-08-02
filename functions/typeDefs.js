export const typeDefs = `#graphql
  type User {
    id: ID!
    userName: String
    email: String
  }

  type Query {
    user(id: ID!): User
    users: [User]
  }

  type Mutation {
    addUser(userName: String!, email: String!): User
  }
`;
