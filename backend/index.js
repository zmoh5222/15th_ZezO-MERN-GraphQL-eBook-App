const path = require("path");
const express = require("express");
const http = require("http");
require("dotenv").config();
const cors = require("cors");
const helmet = require('helmet');
const xss = require('xss');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require("morgan");
const colors = require("colors");
const dbConnection = require("./config/dbConnection");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require("@apollo/server/plugin/drainHttpServer");
const schemaWithPermissions = require("./graphql/schema");
const { graphqlUploadExpress } = require('graphql-upload');
const getUserByToken = require("./utils/getUserByToken");
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { PubSub } = require('graphql-subscriptions');
const cookieParser = require('cookie-parser');



// mongoDB connection
dbConnection();

// express app
const app = express();

// create http server to handles incoming requests to our Express app.
const httpServer = http.createServer(app);

// Use compression middleware to compress responses
app.use(compression());

// apply cors middlewares
app.use(cors({origin: "http://localhost:3000", credentials: true}));

//  parse incoming requests with JSON payloads
app.use(express.json());

// parse incoming requests with urlencoded payload
app.use(express.urlencoded({ extended: true }));

// parse incoming requests with cookies
app.use(cookieParser());

// apply express middleware for serving static files
app.use(express.static(path.join(__dirname, "uploads")));

// apply morgan middleware in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


// graphQl server
const gqlServer = async () => {
  // 1 - WebSocket server
  const pubsub = new PubSub();
  
  // 2 - WebSocket server
  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/subscriptions',
  });
  
  // 3 - WebSocket server
  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer({ 
    schema: schemaWithPermissions, 
    context: (ctx) => ({ pubsub, ctx }),
    }, 
    wsServer);
  
  // create apollo server
  const server = new ApolloServer({
    // apply schema with permissions
    schema: schemaWithPermissions,

    plugins: [
      // Proper shutdown for the HTTP server.
      // Below, we tell Apollo Server to "drain" this httpServer,
      // enabling our servers to shut down gracefully.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // 4 - WebSocket server
      // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
    ],

    // format error
    formatError: (error) => { 
      // log error
      console.log(`${error.path}`.bgRed, `${error.message}`.red, error.extensions.stacktrace)
      
      // if error is not internal server error return default error
      return {
        message: error.message,
        code: error.extensions.code,
        path: error.path,
        stack: process.env.NODE_ENV === "development" ? error.extensions : undefined,
      }
    }
  })
  
  // apply graphql upload middleware
  app.use(graphqlUploadExpress({
    maxFileSize: parseInt(process.env.GRAPHQL_UPLOAD_MAX_FILE_SIZE),
  }))

  // start apollo server
  await server.start();

  // apply express middleware
  app.use('/graphql', expressMiddleware(server,
    {
      // set context
      context: async ({ req, res }) => {
          const user = await getUserByToken(req, res)
          return { req, res, user, pubsub }
      },
    },
    ));
}

// run graphql server
gqlServer();

app.get("/", (req, res) => {
  res.send("Hello ZezO")
})

// server
const port = process.env.PORT || 5000;
const server = httpServer.listen(port, () => {
  console.log(`App listening on port: ${port}`.yellow.underline.bold)
  console.log(`Mode: ${process.env.NODE_ENV ? process.env.NODE_ENV : "Not Specified"}`.magenta.underline.bold)
})

// unhandled rejection error
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Error --> ${err.name} : ${err.message}`.bgRed.underline.bold)
  server.close(() => { 
      console.error("Shutting down App ...".red.underline.bold)
      process.exit(1)
  })
})