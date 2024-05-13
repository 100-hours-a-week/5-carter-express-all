import model from "../models/postModel.js";
import path from "path";

function getPosts(req, res) {
  const postsJson = model.getPosts();
  res.json(postsJson);
}

function getComments(req, res) {
  const comments = model.getComments(req.params.postId);
  res.json(comments);
}

function deleteComment(req, res) {
  model.deleteComment(req.params.commentId);
}

function deletePost(req, res) {
  model.deletePost(req.params.postId);
}

function createComment(req, res) {
  const newComment = {
    postId: req.body.postId,
    userId: req.body.userId,
    content: req.body.content,
  };
  model.createComment(newComment);

  res.status(201).send("create_success");
}

function updateComment(req, res) {
  const comment = {
    commentId: parseInt(req.params.commentId),
    content: req.body.content,
  };
  model.updateComment(comment);

  res.status(204).send("update_success");
}

function updatePost(req, res) {
  let image;
  if (req.file) image = req.file.originalname;
  else image = "";
  const post = {
    postId: parseInt(req.params.postId),
    title: req.body.title,
    content: req.body.content,
    image: image,
  };
  model.updatePost(post);
  res.status(204).send("update_success");
}

function createPost(req, res) {
  let image;
  if (req.file) image = req.file.originalname;
  else image = "";

  const newPost = {
    userId: parseInt(req.body.userId),
    title: req.body.title,
    content: req.body.content,
    image: image,
  };
  model.createPost(newPost);

  res.status(201).send("create_success");
}

function getPost(req, res) {
  const post = model.getPost(req.params.postId);
  res.json(post);
}

function getCommentsCount(req, res) {
  const count = model.getCommentsCount(req.params.postId);
  res.json(count);
}

function getPostImage(req, res) {
  const post = model.getPost(req.params.postId);
  const __dirname = path.resolve();
  const filePath = path.join(__dirname, "uploads", post.image);
  res.sendFile(filePath);
}

export default {
  getPosts,
  createPost,
  getPost,
  getComments,
  deletePost,
  updatePost,
  createComment,
  deleteComment,
  updateComment,
  getCommentsCount,
  getPostImage,
};
