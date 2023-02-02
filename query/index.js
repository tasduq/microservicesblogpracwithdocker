const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
var cors = require("cors");
const axios = require("axios");

const app = express();

const posts = {};

app.use(bodyParser.json());
app.use(cors());

const handleEvents = (type, data) => {
  if (type === "Postcreated") {
    const { id, title } = data;
    posts[id] = {
      id,
      title,
      comments: [],
    };
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    let comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvents(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log("listning on 4002");
 const res =  await axios.get("http://event-bus-clusterip-svr:4005/events");
  for (let event of res.data) {
    handleEvents(event.type, event.data);
  }
});
