const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

//Express Middleware
app.use(express.urlencoded({extended:false}));

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });