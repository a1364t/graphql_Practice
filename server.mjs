// server.mjs

import { ApolloServer, gql } from 'apollo-server';
import fs from 'fs';
import path from 'path';
import users from './db.js';

// Load schema from schema.graphql
const typeDefs = gql(fs.readFileSync(path.join('./schema.graphql'), 'utf8'));

// Define resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello, World!',
    users: () => users,
    user: (_, { id }) => users.find(user => user.id === id),
  },
  Mutation: {
    createUser: (_, { id, name, email, age }) => {
      const newUser = { id: String(users.length + 1), name, email, age };
      users.push(newUser);
      return newUser;
    },
    updateUser: (_, { id, name, email, age }) => {
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex === -1) throw new Error("User not found.");
      users[userIndex] = { id, name, email, age };
      return users[userIndex];
    },
    deleteUser: (_, { id }) => {
      const userIndex = users.findIndex(user => user.id === id);
      if (userIndex === -1) throw new Error("User not found.");
      return users.splice(userIndex, 1)[0];
    }
  }
};

// Start Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
