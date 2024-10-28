import { ApolloServer, gql } from 'apollo-server';
import fs from 'fs';
import path from 'path';

// Sample User Data
const users = [
  { id: '1', name: 'John Doe', email: 'john@gmail.com', age: 22 },
  { id: '2', name: 'Jane Doe', email: 'jane@gmail.com', age: 23 }
];

// GraphQL Schema Definition
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Query {
    hello: String
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    createUser(id: ID!, name: String!, email: String!, age: Int): User!
    updateUser(id: ID!, name: String, email: String, age: Int): User!
    deleteUser(id: ID!): User!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello, World!',
    users: () => users,
    user: (_, { id }) => {
      console.log(`Looking for user with ID: ${id}`);
      const foundUser = users.find(user => user.id === id);
      console.log(`Found user: ${JSON.stringify(foundUser)}`);
      return foundUser;
    }
  },
  Mutation: {
    createUser: (parent, { id, name, email, age }) => {
      const newUser = { id: String(users.length + 1), name, email, age };
      users.push(newUser);
      return newUser;
    },
    updateUser: (parent, { id, name, email, age }) => {
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex === -1) throw new Error("User not found.");
      users[userIndex] = { id, name, email, age };
      return users[userIndex];
    },
    deleteUser: (parent, { id }) => {
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex === -1) throw new Error("User not found.");
      const deletedUser = users.splice(userIndex, 1);
      return deletedUser[0];
    }
  }
};

// Apollo Server Setup
const server = new ApolloServer({ typeDefs, resolvers });

const start = async () => {
  const { url } = await server.listen();
  console.log(`🚀 Server ready at ${url}`);
};

start();
