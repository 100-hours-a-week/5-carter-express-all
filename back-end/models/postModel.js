import fs from "fs";
import path from "path";

const __dirname = path.resolve();
const uploadPath = path.join(__dirname, "uploads/");
const postsDataPath = "/models/posts.json";
const commentsDataPath = "/models/comments.json";

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

function getPosts() {
  const postsJsonFile = fs.readFileSync(__dirname + postsDataPath, "utf8");
  const postsJsonData = JSON.parse(postsJsonFile);
  return postsJsonData;
}

function getComments(postId) {
  const commentsJsonFile = fs.readFileSync(
    __dirname + commentsDataPath,
    "utf8",
  );
  const commentsJsonData = JSON.parse(commentsJsonFile);

  return commentsJsonData.filter(
    (comment) => comment.postId === parseInt(postId),
  );
}

function deleteComment(commentId) {
  const commentsJsonFile = fs.readFileSync(
    __dirname + commentsDataPath,
    "utf8",
  );
  const commentsJsonData = JSON.parse(commentsJsonFile);
  const filteredData = commentsJsonData.filter(
    (comment) => comment.commentId !== parseInt(commentId),
  );

  const deletedJsonData = JSON.stringify(filteredData);

  fs.writeFileSync(
    path.join(__dirname, commentsDataPath),
    deletedJsonData,
    "utf8",
  );
}

function deletePost(postId) {
  const postsJsonFile = fs.readFileSync(__dirname + postsDataPath, "utf8");
  const postsJsonData = JSON.parse(postsJsonFile);
  const filteredData = postsJsonData.filter(
    (post) => post.postId !== parseInt(postId),
  );
  const deletedJsonData = JSON.stringify(filteredData);

  fs.writeFileSync(
    path.join(__dirname, postsDataPath),
    deletedJsonData,
    "utf8",
  );
}

function createComment(newComment) {
  const commentsJsonFile = fs.readFileSync(
    __dirname + commentsDataPath,
    "utf8",
  );
  const commentsJsonData = JSON.parse(commentsJsonFile);

  const commentId = commentsJsonData.reduce((max, comment) => {
    return Math.max(max, comment.commentId) + 1;
  }, 0);
  const formattedDate = getDate();

  const data = {
    commentId: commentId,
    postId: parseInt(newComment.postId),
    userId: parseInt(newComment.userId),
    date: formattedDate,
    content: newComment.content,
  };

  commentsJsonData.push(data);

  const newCommentsJson = JSON.stringify(commentsJsonData);

  fs.writeFileSync(__dirname + commentsDataPath, newCommentsJson, "utf8");
}

function updateComment(comment) {
  const commentsJsonFile = fs.readFileSync(
    __dirname + commentsDataPath,
    "utf8",
  );
  const commentsJsonData = JSON.parse(commentsJsonFile);
  const formattedDate = getDate();

  for (let i = 0; i < commentsJsonData.length; i++) {
    if (
      parseInt(commentsJsonData[i].commentId) === parseInt(comment.commentId)
    ) {
      commentsJsonData[i].content = comment.content;
      commentsJsonData[i].date = formattedDate;
    }
  }

  const result = JSON.stringify(commentsJsonData);

  fs.writeFileSync(path.join(__dirname, commentsDataPath), result, "utf8");
}

function updatePost(post) {
  const postsJsonFile = fs.readFileSync(__dirname + postsDataPath, "utf8");
  const postsJsonData = JSON.parse(postsJsonFile);
  const formattedDate = getDate();
  for (let i = 0; i < postsJsonData.length; i++) {
    if (parseInt(post.postId) === parseInt(postsJsonData[i].postId)) {
      postsJsonData[i].title = post.title;
      postsJsonData[i].content = post.content;
      postsJsonData[i].date = formattedDate;
      if (post.image) {
        const image = `post${post.postId}${path.extname(post.image)}`;
        fs.rename(uploadPath + post.image, uploadPath + image, (err) => {
          if (err) console.log(err);
          else console.log("success");
        });
        postsJsonData[i].image = image;
      }
    }
  }

  const result = JSON.stringify(postsJsonData);

  fs.writeFileSync(path.join(__dirname, postsDataPath), result);
}

function createPost(newPost) {
  const postsJsonFile = fs.readFileSync(__dirname + postsDataPath, "utf8");
  const postsJsonData = JSON.parse(postsJsonFile);

  const newPostId = postsJsonData.reduce((max, post) => {
    return Math.max(max, post.postId) + 1;
  }, 0);
  const formattedDate = getDate();
  let image = "null.png";
  if (newPost.image) {
    image = `post${newPostId}${path.extname(newPost.image)}`;
    fs.rename(uploadPath + newPost.image, uploadPath + image, (err) => {
      if (err) console.log(err);
      else console.log("success");
    });
  }

  const post = {
    postId: newPostId,
    userId: newPost.userId,
    title: newPost.title,
    image: image,
    date: formattedDate,
    content: newPost.content,
    views: 0,
    likes: 0,
  };

  postsJsonData.push(post);

  const newPostsJson = JSON.stringify(postsJsonData);

  fs.writeFileSync(__dirname + postsDataPath, newPostsJson, "utf8");
}

function getPost(postId) {
  const postsJsonFile = fs.readFileSync(__dirname + postsDataPath, "utf8");
  const postsJsonData = JSON.parse(postsJsonFile);
  for (let i = 0; i < postsJsonData.length; i++) {
    const post = postsJsonData[i];
    if (parseInt(post.postId) === parseInt(postId)) {
      return post;
    }
  }
}

function getCommentsCount(postId) {
  const commentsJsonFile = fs.readFileSync(
    __dirname + commentsDataPath,
    "utf8",
  );
  const commentsJsonData = JSON.parse(commentsJsonFile);

  let count = 0;
  for (let i = 0; i < commentsJsonData.length; i++) {
    const comment = commentsJsonData[i];
    if (parseInt(comment.postId) === parseInt(postId)) count += 1;
  }
  return count;
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
};
