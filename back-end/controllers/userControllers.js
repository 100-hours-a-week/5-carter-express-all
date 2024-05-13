import model from "../models/userModel.js";

import path from "path";

function validateUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const id = model.validateUser(email, password);
  if (id !== 0) {
    res.cookie("id", id, { maxAge: 3600000, httpOnly: true });
    res.status(200).send({ result: true, id: id });
  } else {
    res.status(400).send({ result: false, id: 0 });
  }
}

function validateDuplicatedEmail(req, res) {
  const email = req.params.email;
  const isDuplicate = model.validateDuplicatedEmail(email);

  res.status(200).json({ isDuplicate: isDuplicate });
}

function validateDuplicatedNickname(req, res) {
  const nickname = req.params.nickname;
  const isDuplicate = model.validateDuplicatedNickname(nickname);

  res.status(200).json({ isDuplicate: isDuplicate });
}

function updateUser(req, res) {
  let image = "";
  if (req.file) {
    image = req.file.originalname;
  }
  const user = {
    userId: parseInt(req.params.userId),
    nickname: req.body.nickname,
    image: image,
  };

  model.updateUser(user);
  res.status(204).send("update_success");
}

function deleteUser(req, res) {
  model.deleteUser(req.params.userId);

  res.status(204).send("delete_success");
}

function createUser(req, res) {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    nickname: req.body.nickname,
    image: req.file.originalname,
  };

  model.createUser(newUser);

  res.status(201).send("sign_up_create_success");
}

function getUser(req, res) {
  const user = model.getUser(req.params.userId);
  res.json(user);
}

function getUserImage(req, res) {
  const user = model.getUser(req.params.userId);
  const __dirname = path.resolve();
  const filePath = path.join(__dirname, "uploads", user.image);
  res.sendFile(filePath);
}

function updateUserPassword(req, res) {
  const user = {
    userId: parseInt(req.params.userId),
    password: req.body.password,
  };

  model.updateUserPassword(user);

  res.status(204).send("update_success");
}

function getUserNickname(req, res) {
  const user = model.getUser(req.params.userId);
  res.json(user.nickname);
}

export default {
  validateUser,
  validateDuplicatedEmail,
  validateDuplicatedNickname,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  getUserImage,
  getUserNickname,
};
