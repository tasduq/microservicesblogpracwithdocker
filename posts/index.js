const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
var cors = require("cors");
const axios = require("axios");

const app = express();

const posts = {};
app.use(bodyParser.json());
app.use(cors());

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  let id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };
  await axios
    .post("http://event-bus-clusterip-svr:4005/events", {
      type: "Postcreated",
      data: {
        id,
        title,
      },
    })
    .catch((err) => console.log(err.message));

  res.status(201).json(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("Recived Event", req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log("Vyoooo");
  console.log("listning on 4000");
});
