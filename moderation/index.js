const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
// var cors = require("cors");
const axios = require("axios");

const app = express();

const posts = {};
app.use(bodyParser.json());
// app.use(cors());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";
    await axios
      .post("http://event-bus-clusterip-svr:4005/events", {
        type: "CommentModerated",
        data: {
          id: data.id,
          content: data.content,
          postId: data.postId,
          status: status,
        },
      })
      .catch((err) => console.log(err.message));
  }
});

app.listen(4003, () => {
  console.log("listning on 4003");
});
