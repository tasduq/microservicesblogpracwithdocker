const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
var cors = require("cors");
const axios = require("axios");

const app = express();

const commentsByPostId = {};
app.use(bodyParser.json());
app.use(cors());

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  let id = randomBytes(4).toString("hex");
  const { content } = req.body;

  let comments = commentsByPostId[req.params.id] || [];
  comments.push({ id: id, content, status: "pending" });

  commentsByPostId[req.params.id] = comments;

  await axios
    .post("http://event-bus-clusterip-svr:4005/events", {
      type: "CommentCreated",
      data: {
        id,
        content,
        postId: req.params.id,
        status: "pending",
      },
    })
    .catch((err) => console.log(err.message));

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  console.log("Recived Event", req.body.type);
  const { type, data } = req.body;
  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;

    await axios
      .post("http://event-bus-clusterip-svr:4005/events", {
        type: "CommentUpdated",
        data: {
          id,
          status,
          postId,
          content,
        },
      })
      .catch((err) => console.log(err.message));
  }
  res.send({});
});

app.listen(4001, () => {
  console.log("v1000");
  console.log("listning on 4001");
});
