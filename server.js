const express = require('express');
const graphQlHttp = require('express-graphql');
const mongoose = require('mongoose');
// import custom middleware
const isAuth = require('./middleware/is-auth');

const schema = require('./graphql/schema');

// initialize express
const app = express();

// Body Parser Middleware
app.use(express.json());

// Activate custom middleware, express will use it as a middleware.
// This will run on every incoming request that's why middleware doesn't throw error
// but instead it sets some metadata like isAuth (true/false)
app.use(isAuth);

// configure graphql endpoint
app.use(
  '/graphql',
  graphQlHttp({
    schema,
    graphiql: true
  })
);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@cluster0-eqdjg.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`,
    { useNewUrlParser: true }
  )
  .then(() => {
    // start server after connection to db was successfull
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch(err => {
    console.log(err);
  });
