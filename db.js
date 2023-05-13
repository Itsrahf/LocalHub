// our server connecting to database

const express = require("express");
const app = express(); // our app
const mongoose = require("mongoose");
const dotenv = require("dotenv");


dotenv.config();

const dbURL = process.env.MONGO_URL;


// fixes deprication errors
mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("connected to database");
})
  .catch((err) => console.log(err));

// listen for requests

app.listen(5000);
