import model from "../models/postModel.js";
import path from "path";

async function getPosts(req, res) {
  try {
    const postsJson = await model.getPosts();
    res.status(200).json(postsJson);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
}

async function getPost(req, res) {
  try {
    const post = await model.getPost(req.params.postId);
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
}

async function createPost(req, res) {
  try {
    let image;
    if (req.file) image = req.file.originalname;
    else image = "";

    const newPost = {
      userId: parseInt(req.session.user.id),
      title: req.body.title,
      image: image,
      content: req.body.content,
    };
    await model.createPost(newPost);

    res.status(201).send("create_success");
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
}

async function updatePost(req, res) {
  try {
    let image;
    if (req.file) image = req.file.originalname;
    else image = "";
    const post = {
      postId: parseInt(req.params.postId),
      title: req.body.title,
      content: req.body.content,
      image: image,
    };
    await model.updatePost(post);
    res.status(204).send("update_success");
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
}

async function deletePost(req, res) {
  try {
    await model.deletePost(req.params.postId);
    res.status(200);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
}

async function incrementView(req, res) {
  try {
    await model.incrementView(req.params.postId);
    res.status(200).send("Increment success");
  } catch (error) {
    console.error("Error incrementing view count:", error);
    res.status(500).send("Error incrementing view count");
  }
}

async function getComments(req, res) {
  try {
    const comments = await model.getComments(req.params.postId);
    console.log(comments);
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments" });
  }
}

async function createComment(req, res) {
  try {
    const newComment = {
      postId: req.body.postId,
      userId: req.session.user.id,
      content: req.body.content,
    };
    await model.createComment(newComment);
    res.status(201).send("create_success");
  } catch {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments" });
  }
}

async function updateComment(req, res) {
  try {
    const comment = {
      commentId: parseInt(req.params.commentId),
      content: req.body.content,
    };
    await model.updateComment(comment);

    res.status(204).send("update_success");
  } catch {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments" });
  }
}

async function deleteComment(req, res) {
  try {
    await model.deleteComment(req.params.commentId);
    res.status(200);
  } catch {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments" });
  }
}

async function getPostImage(req, res) {
  try {
    const post = await model.getPost(req.params.postId);
    const __dirname = path.resolve();
    const filePath = path.join(__dirname, "uploads", post.image);
    res.status(200).sendFile(filePath);
  } catch (error) {
    console.error("error fetching image", error);
    res.status(500).json({ message: "error fetching image" });
  }
}

export default {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  incrementView,
  getComments,
  createComment,
  updateComment,
  deleteComment,
  getPostImage,
};
