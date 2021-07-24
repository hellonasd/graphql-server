require('dotenv').config();
const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");
const mongoose = require("mongoose");
const router = require('./router/authorization');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');

//resolvers 
const resolvers = require('./init-graphql/user/resolvers');

const readToken = require('./readToken');

//schema-graphql

const requireGraphQLFile = require('require-graphql-file');

const typeDefs = requireGraphQLFile('./init-graphql/user/schema.graphql');

//playground graphql server
const {
    ApolloServerPluginLandingPageGraphQLPlayground  ,
} = require("apollo-server-core");


const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

async function startApolloServer(typeDefs, resolvers) {
  // Same ApolloServer initialization as before
  const app = express();
  app.use(cors({
    origin : `http://localhosth:4000`,
    credentials : true
  }));
  app.use(express.json());
  
  app.use(cookieParser());
  app.use(session({
    key: 'token',
    secret : process.env.JWT_ACCESS_TOKEN,
    resave : false,
    rolling: true,
    saveUninitialized : false,
    cookie : {
      httpOnly : true,
      maxAge : 15 * 60 * 1000
    }
  }))
  app.use(readToken);
  const server = new ApolloServer({ 
      typeDefs, 
      resolvers,
      plugins : [ApolloServerPluginLandingPageGraphQLPlayground()],
      context : ({req, res}) => {
        
        return {
          req,
          res,
          session : req.session
        };
      },
      playground : {
        settings : {
          "request.credentials" : "include"
        }
      }
});

  // Required logic for integrating with Express
  await server.start();
 
  
  server.applyMiddleware({
    app,
    cors : false
  });
  
  
  // Modified server startup
  mongoose
    .connect(
      `mongodb+srv://nick:${process.env.PASS_DB}@cluster0.vgwsq.mongodb.net/graphql?retryWrites=true&w=majority`,
      opts
    )
    .then(() => {
      app.listen({ port: process.env.PORT }, () => {
        console.log(
          `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
        );
      });
    });
}

startApolloServer(typeDefs, resolvers);
