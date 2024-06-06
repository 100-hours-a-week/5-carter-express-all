import fs from "fs";
import path from "path";
import db from "../db.js";

const __dirname = path.resolve();
const uploadPath = path.join(__dirname, "uploads/");

function getDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function transformDate(rows) {
  rows.forEach((row) => {
    row.date = new Date(row.date).toISOString().slice(0, 19).replace("T", " ");
  });
  return rows;
}

async function getPosts() {
  const query = `
    SELECT
        p.postId,
        p.title,
        p.likes,
        p.views,
        p.date,
        u.nickname,
        u.userId,
        COUNT(c.commentId) AS comment_count
    FROM
        posts p
    JOIN
        users u ON p.userId = u.userId
    LEFT JOIN
        comments c ON p.postId = c.postId
    GROUP BY
        p.postId, p.title, p.likes, p.views, p.date, u.nickname, u.image;
  `;

  try {
    const [rows] = await db.query(query);
    return transformDate(rows);
  } catch (err) {
    console.error("Error fetching posts:", err);
    throw err;
  }
}

async function getPost(postId) {
  const query = `
    SELECT
        p.postId,
        p.title,
        p.content,
        p.views,
        p.date,
        p.image,
        u.nickname,
        u.userId,
        COUNT(c.commentId) AS comment_count
    FROM
        posts p
    JOIN
        users u ON p.userId = u.userId
    LEFT JOIN
        comments c ON p.postId = c.postId
    WHERE
        p.postId = ?
    GROUP BY
        p.postId, p.title, p.content, p.views, p.date, p.image, u.nickname, u.userId;
  `;

  try {
    const [rows] = await db.query(query, [postId]);
    return rows[0];
  } catch (err) {
    console.error("Error fetching post:", err);
    throw err;
  }
}

async function createPost(newPost) {
  try {
    let image = "null.png";
    const formattedDate = getDate();
    const [result] = await db.query(
      "INSERT INTO posts (userId, title, image, date, content, views, likes) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        newPost.userId,
        newPost.title,
        image,
        formattedDate,
        newPost.content,
        0,
        0,
      ],
    );

    if (newPost.image) {
      const newPostId = result.insertId;
      const imageExt = path.extname(newPost.image);
      const image = `post${newPostId}${imageExt}`;

      fs.renameSync(uploadPath + newPost.image, uploadPath + image);

      const updateQuery = `
        UPDATE posts SET image = ? WHERE postId = ?;
      `;
      await db.query(updateQuery, [image, newPostId]);
    }

    console.log("Post created successfully with ID:", result.insertId);
    return result.insertId;
  } catch (err) {
    console.error("Error creating post: ", err);
    throw err;
  }
}

async function updatePost(post) {
  try {
    const formattedDate = getDate();

    const [result] = await db.query(
      "UPDATE posts SET title = ?, content = ?, date = ? WHERE postId = ?",
      [post.title, post.content, formattedDate, post.postId],
    );

    if (result.affectedRows === 0) {
      console.log("Post not found");
      return false;
    }

    if (post.image) {
      const image = `post${post.postId}${path.extname(post.image)}`;
      fs.renameSync(uploadPath + post.image, uploadPath + image);

      await db.query("UPDATE posts SET image = ? WHERE postId = ?", [
        image,
        post.postId,
      ]);
    }

    console.log("Post updated successfully");
    return true;
  } catch (err) {
    console.error("Error updating post: ", err);
    throw err;
  }
}

async function deletePost(postId) {
  try {
    const [result] = await db.query("CALL deletePostAndRelatedComments(?)", [
      postId,
    ]);

    if (result.affectedRows > 0) {
      console.log("Post and related comments deleted successfully");
      return true;
    } else {
      console.log("Post not found");
      return false;
    }
  } catch (err) {
    console.error("Error deleting post and related comments: ", err);
    throw err;
  }
}

async function incrementView(postId) {
  try {
    const [results] = await db.query(`CALL incrementPostViews(?)`, [postId]);
    console.log("View count incremented successfully:");
    return true;
  } catch (error) {
    console.error("Error incrementing view count:", error);
    return false;
  }
}

async function getComments(postId) {
  try {
    const [rows] = await db.query("SELECT * FROM comments WHERE postId = ?", [
      postId,
    ]);

    return transformDate(rows);
  } catch (err) {
    console.error("Error retrieving comments: ", err);
    throw err;
  }
}

async function createComment(newComment) {
  try {
    const formattedDate = getDate();

    const [result] = await db.query(
      "INSERT INTO comments (postId, userId, date, content) VALUES (?, ?, ?, ?)",
      [
        parseInt(newComment.postId),
        parseInt(newComment.userId),
        formattedDate,
        newComment.content,
      ],
    );

    console.log("Comment created successfully with ID:", result.insertId);
    return result.insertId;
  } catch (err) {
    console.error("Error creating comment: ", err);
    throw err;
  }
}

async function updateComment(comment) {
  try {
    const formattedDate = getDate();

    const [result] = await db.query(
      "UPDATE comments SET content = ?, date = ? WHERE commentId = ?",
      [comment.content, formattedDate, comment.commentId],
    );

    if (result.affectedRows > 0) {
      console.log("Comment updated successfully");
      return true;
    } else {
      console.log("Comment not found");
      return false;
    }
  } catch (err) {
    console.error("Error updating comment: ", err);
    throw err;
  }
}

async function deleteComment(commentId) {
  try {
    const [result] = await db.query(
      "DELETE FROM comments WHERE commentId = ?",
      [commentId],
    );

    if (result.affectedRows > 0) {
      console.log("Comment deleted successfully");
      return true;
    } else {
      console.log("Comment not found");
      return false;
    }
  } catch (err) {
    console.error("Error deleting comment: ", err);
    throw err;
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
};
