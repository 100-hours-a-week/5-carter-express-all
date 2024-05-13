import fs from "fs";
import path from "path";

const __dirname = path.resolve();
const uploadPath = path.join(__dirname, "uploads/");
const usersDataPath = "/models/users.json";
const postsDataPath = "/models/posts.json";
const commentsDataPath = "/models/comments.json";

function validateUser(email, password) {
  const usersJsonFile = fs.readFileSync(__dirname + usersDataPath, "utf8");
  const usersJsonData = JSON.parse(usersJsonFile);

  for (let i = 0; i < usersJsonData.length; i++) {
    let user = usersJsonData[i];
    if (user.email === email && user.password === password) {
      return user.userId;
    }
  }
  return 0;
}

function validateDuplicatedEmail(email) {
  const usersJsonFile = fs.readFileSync(__dirname + usersDataPath, "utf8");
  const usersJsonData = JSON.parse(usersJsonFile);

  for (let i = 0; i < usersJsonData.length; i++) {
    const user = usersJsonData[i];
    if (user.email === email) {
      return true;
    }
  }
  return false;
}

function validateDuplicatedNickname(nickname) {
  const usersJsonFile = fs.readFileSync(__dirname + usersDataPath, "utf8");
  const usersJsonData = JSON.parse(usersJsonFile);

  for (let i = 0; i < usersJsonData.length; i++) {
    const user = usersJsonData[i];
    if (user.nickname === nickname) {
      return true;
    }
  }
  return false;
}

function createUser(newUser) {
  const usersJsonFile = fs.readFileSync(__dirname + usersDataPath, "utf8");
  const usersJsonData = JSON.parse(usersJsonFile);

  const newUserId = usersJsonData.reduce((max, user) => {
    return Math.max(max, user.userId) + 1;
  }, 0);
  const image = `user${newUserId}${path.extname(newUser.image)}`;
  fs.rename(uploadPath + newUser.image, uploadPath + image, (err) => {
    if (err) console.log(err);
    else console.log("success");
  });
  const user = {
    userId: newUserId,
    email: newUser.email,
    password: newUser.password,
    nickname: newUser.nickname,
    image: image,
  };

  usersJsonData.push(user);

  const newUsersJson = JSON.stringify(usersJsonData);

  fs.writeFileSync(__dirname + usersDataPath, newUsersJson, "utf8");
}

function getUser(userId) {
  const usersJsonFile = fs.readFileSync(__dirname + usersDataPath, "utf8");
  const usersJsonData = JSON.parse(usersJsonFile);

  for (let i = 0; i < usersJsonData.length; i++) {
    let user = usersJsonData[i];
    if (user.userId === parseInt(userId)) {
      return user;
    }
  }
}

function getUserId(email) {
  const usersJsonFile = fs.readFileSync(__dirname + usersDataPath, "utf8");
  const usersJsonData = JSON.parse(usersJsonFile);

  for (let i = 0; i < usersJsonData.length; i++) {
    let user = usersJsonData[i];
    if (user.email === email) {
      return parseInt(user.userId);
    }
  }
}

function updateUser(user) {
  const usersJsonFile = fs.readFileSync(__dirname + usersDataPath, "utf8");
  const usersJsonData = JSON.parse(usersJsonFile);

  for (let i = 0; i < usersJsonData.length; i++) {
    if (parseInt(user.userId) === parseInt(usersJsonData[i].userId)) {
      usersJsonData[i].nickname = user.nickname;
      if (user.image) {
        fs.unlink(uploadPath + usersJsonData[i].image, (err) => {
          if (err) {
            console.error("File delete error:", err);
          } else {
            console.log("File was deleted successfully");
          }
        });
        const newImage = `user${user.userId}${path.extname(user.image)}`;
        fs.rename(uploadPath + user.image, uploadPath + newImage, (err) => {
          if (err) console.log(err);
          else console.log("success");
        });
        usersJsonData[i].image = newImage;
      }
    }
  }

  const result = JSON.stringify(usersJsonData);
  fs.writeFileSync(path.join(__dirname, usersDataPath), result, "utf8");
}

function deleteUser(userId) {
  const usersJsonFile = fs.readFileSync(__dirname + usersDataPath, "utf8");
  const usersJsonData = JSON.parse(usersJsonFile);
  let filteredData = usersJsonData.filter(
    (user) => user.userId !== parseInt(userId),
  );
  let deletedJsonData = JSON.stringify(filteredData);

  fs.writeFileSync(
    path.join(__dirname, usersDataPath),
    deletedJsonData,
    "utf8",
  );

  const commentsJsonFile = fs.readFileSync(
    __dirname + commentsDataPath,
    "utf8",
  );
  const commentsJsonData = JSON.parse(commentsJsonFile);
  filteredData = commentsJsonData.filter(
    (comment) => parseInt(comment.userId) !== parseInt(userId),
  );
  deletedJsonData = JSON.stringify(filteredData);

  fs.writeFileSync(
    path.join(__dirname, commentsDataPath),
    deletedJsonData,
    "utf8",
  );

  const postsJsonFile = fs.readFileSync(__dirname + postsDataPath, "utf8");
  const postsJsonData = JSON.parse(postsJsonFile);
  filteredData = postsJsonData.filter(
    (post) => post.userId !== parseInt(userId),
  );
  deletedJsonData = JSON.stringify(filteredData);

  fs.writeFileSync(
    path.join(__dirname, postsDataPath),
    deletedJsonData,
    "utf8",
  );
}

function updateUserPassword(user) {
  const usersJsonFile = fs.readFileSync(__dirname + usersDataPath, "utf8");
  const usersJsonData = JSON.parse(usersJsonFile);

  for (let i = 0; i < usersJsonData.length; i++) {
    if (parseInt(user.userId) === parseInt(usersJsonData[i].userId)) {
      usersJsonData[i].password = user.password;
    }
  }

  const result = JSON.stringify(usersJsonData);
  fs.writeFileSync(path.join(__dirname, usersDataPath), result, "utf8");
}

export default {
  validateUser,
  validateDuplicatedEmail,
  validateDuplicatedNickname,
  createUser,
  getUser,
  getUserId,
  updateUser,
  deleteUser,
  updateUserPassword,
};
