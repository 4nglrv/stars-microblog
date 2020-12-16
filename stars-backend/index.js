const express = require('express');
const { ApolloServer } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = require('./graphql/hello.graphql');

// Provide resolver functions for your schema fields
const resolvers = {
	Query: {
		hello: () => 'Hello world!'
	}
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
