const express = require("express");

// initialize express
const app = express();

// Body Parser Middleware
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
