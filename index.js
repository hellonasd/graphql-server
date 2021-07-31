require("dotenv").config();
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { createServer } = require("http");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");

//resolvers
const resolvers = require("./init-graphql/user/resolvers");

const readToken = require("./readToken");

//schema-graphql

const requireGraphQLFile = require("require-graphql-file");

const typeDefs = requireGraphQLFile("./init-graphql/user/schema.graphql");

//playground graphql server
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

async function startApolloServer(typeDefs, resolvers) {
  // Same ApolloServer initialization as before
  const app = express();
  app.use(
    cors({
      origin: ['https://graphql-server-ap.herokuapp.com/graphql','https://heroku-apollo.herokuapp.com', 'https://heroku-apollo.herokuapp.com/todo', 'https://heroku-apollo.herokuapp.com/'],
      credentials: true,
    })
  );
  const httpServer = createServer(app);
  
  app.use(express.json());
  app.use(
    session({
      key: "token",
      secret: process.env.JWT_ACCESS_TOKEN,
      resave: false,
      rolling: true,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      },
    })
  );
  app.use(cookieParser());

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context: ({ req, res }) => {
      const token = req.headers.authorization || "";
      const user = readToken(token);
      return {
        req,
        res,
        user,
      };
    },
    playground: {
      settings: {
        "request.credentials": "include",
      },
    },
    introspection: true,
  });

  await server.start();

  server.applyMiddleware({
    app,
    cors: false,
  });

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,

      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: server.graphqlPath,
    }
  );

  ["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, () => subscriptionServer.close());
  });
  mongoose
    .connect(
      `mongodb+srv://nick:${process.env.PASS_DB}@cluster0.vgwsq.mongodb.net/graphql?retryWrites=true&w=majority`,
      opts
    )
    .then(() => {
      httpServer.listen({ port: process.env.PORT || 4000 }, () => {
        console.log(
          `🚀 Server ready at localhost:${process.env.PORT || 4000}${
            server.graphqlPath
          }`
        );
      });
    });
}

startApolloServer(typeDefs, resolvers);
