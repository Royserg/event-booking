const express = require('express');
const graphQlHttp = require('express-graphql');
const mongoose = require('mongoose');

const schema = require('./graphql/schema.js');

// initialize express
const app = express();

// Body Parser Middleware
app.use(express.json());

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
    }@cluster0-eqdjg.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
  )
  .then(() => {
    // start server after connection to db was successfull
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch(err => {
    console.log(err);
  });
