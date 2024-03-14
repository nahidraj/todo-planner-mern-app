const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const bodyParser = require("body-parser");
const route = require("./src/routes/api");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());

// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// db conncenation start

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ai7lpqx.mongodb.net/ToDoPlanner?retryWrites=true&w=majority&appName=Cluster0`;
const options = {
  user: process.env.DB_USERNAME,
  pass: process.env.DB_PASSWORD,
};

mongoose
  .connect(uri, options)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

// db conncenation end

app.use("/api/v1", route);

app.use("*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

module.exports = app;
