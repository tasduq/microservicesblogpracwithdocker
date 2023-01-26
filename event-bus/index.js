const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
// var cors = require("cors");
const axios = require("axios");

const app = express();

let eventsDB = [];
app.use(bodyParser.json());
// app.use(cors());

app.post("/events", (req, res) => {
  let events = req.body;
  console.log(events, "i am events");

  eventsDB.push(events);

  axios.post("http://localhost:4000/events", events).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4001/events", events).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4002/events", events).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4003/events", events).catch((err) => {
    console.log(err.message);
  });
  res.send({ status: "ok" });
});

app.get("/events", (req, res) => {
  res.send(eventsDB);
});

app.listen(4005, () => {
  console.log("listning on 4005");
});
