const express = require('express');
const graphQlHttp = require('express-graphql');

const schema = require('./schema/schema.js');

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

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
