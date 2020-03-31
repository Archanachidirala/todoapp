const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const envi = require('./nodemon.json');
const mongoose = require('mongoose');

const Event = require('./models/event.js');



let todos = [
  {
    id: Date.now().toString(),
    text: 'Hello from GraphQL',
    completed: true
  },
];

const typeDefs = gql`
  type Todo {
    id: String
    text: String
    completed: Boolean
  }
  type Query {
    todos: [Todo]!
  }
  type Mutation {
    createTodo(text: String!):String
    removeTodo(id: String!):String
    updateTodo(id: String!):String
  }
`;

const resolvers = {
  Query: {
    todos: () => todos,
  },
  Mutation: {
    createTodo: (parent, args, context, info) => {
/* 
      return todos.push({
        id: Date.now().toString(),
        text: args.text,
        completed: false,
      }); */
      const event  = new Event({
        id: Date.now().toString(),
        text: args.text,
        completed: false,
      });
      return event.save().then(
        result => {
          console.log(result);
          return { ...result._doc, _id: result._doc._id.toString() };
        }


      ).catch(err => {console.log(err);throw err;});
      
    },
    removeTodo: (parent, args, context, info) => {
      for (let i in todos) {
        if (todos[i].id === args.id) {
          todos.splice(i, 1);
        }
      }
      return args.id;
    },
    updateTodo: (parent, args, context, info) => {
      for (let i in todos) {
        if (todos[i].id === args.id) {
          todos[i].completed = !todos[i].completed;
        }
      }
      return args.id;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.use(cors());

/* app.listen({ port: 4000 }, () =>
  console.log('Now browse to http://localhost:4000' + server.graphqlPath)
); */


mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-1mdzf.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
).then( () => {
  app.listen({ port: 4000 }, () =>
  console.log('Now browse to http://localhost:4000' + server.graphqlPath)
);
}).catch(err => {
  console.log(err);
});