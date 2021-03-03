import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { createServer } from 'http';
import environment from './config/environments';
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import ExpressPlayGround from 'graphql-playground-middleware-express';
import Database from './lib/database';
import { IContext } from './interfaces/context.interface';

if (process.env.NODE_ENV !== 'production') {
  const env = environment;
}

async function init() {
  const app = express();

  app.use('*', cors());
  app.use(compression());

  const database = new Database();
  const db = await database.init();
  const context = async ({req, connection}: IContext) =>{
    const token = (req) ? req.headers.authorization : connection.authorization;
    return { token, db };
  };


  const server = new ApolloServer({
    schema,
    introspection: true,
    context
  });
  server.applyMiddleware({app});

  app.get('/', ExpressPlayGround({
    endpoint: '/graphql'
  }));

  const httpServer = createServer(app);

  const PORT = process.env.PORT || 3001;
  httpServer.listen(
    {
      port: PORT,
    },
    () => console.log(`Servidor Corriendo en https://localhost:${PORT}`)
  );
}

init();