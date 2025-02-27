import express from "express";
import { ApolloServer } from "@apollo/server";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser, { BodyParser } from "body-parser";
import { User } from "./user";

export async function initServer() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  const graphqlServer = new ApolloServer({
    typeDefs: `#graphql
            ${User.types}
            type Query {
                ${User.queries}
            }
    `,
    resolvers: {
      Query: { ...User.resolvers.queries }
    }
  });
  await graphqlServer.start();
  app.use("/graphql", expressMiddleware(graphqlServer));
  return app;
}
