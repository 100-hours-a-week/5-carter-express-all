import model from "../models/userModel.js";

import path from "path";

async function validateUser(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const id = await model.validateUser(email, password);
    if (id !== 0) {
      res.cookie("id", id, { maxAge: 3600000, httpOnly: true });
      res.status(200).send({ result: true, id: id });
    } else {
      res.status(400).send({ result: false, id: 0 });
    }
  } catch (error) {
    console.error("error fetching user");
    res.status(500).json({ message: "error fetching user" });
  }
}

async function validateDuplicatedEmail(req, res) {
  try {
    const email = req.params.email;
    const isDuplicate = await model.validateDuplicatedEmail(email);

    res.status(200).json({ isDuplicate: isDuplicate });
  } catch (error) {
    console.error("error fetching user");
    res.status(500).json({ message: "error fetching user" });
  }
}

async function validateDuplicatedNickname(req, res) {
  try {
    const nickname = req.params.nickname;
    const isDuplicate = await model.validateDuplicatedNickname(nickname);

    res.status(200).json({ isDuplicate: isDuplicate });
  } catch (error) {
    console.error("error fetching user");
    res.status(500).json({ message: "error fetching user" });
  }
}

async function updateUser(req, res) {
  try {
    let image = "";
    if (req.file) {
      image = req.file.originalname;
    }
    const user = {
      userId: parseInt(req.params.userId),
      nickname: req.body.nickname,
      image: image,
    };

    await model.updateUser(user);
    res.status(204).send("update_success");
  } catch (error) {
    console.error("error fetching user");
    res.status(500).json({ message: "error fetching user" });
  }
}

async function deleteUser(req, res) {
  try {
    await model.deleteUser(req.params.userId);

    res.status(204).send("delete_success");
  } catch (error) {
    console.error("error fetching user");
    res.status(500).json({ message: "error fetching user" });
  }
}

async function createUser(req, res) {
  try {
    const newUser = {
      email: req.body.email,
      password: req.body.password,
      nickname: req.body.nickname,
      image: req.file.originalname,
    };

    await model.createUser(newUser);

    res.status(201).send("sign_up_create_success");
  } catch (error) {
    console.error("error fetching user");
    res.status(500).json({ message: "error fetching user" });
  }
}

async function getUser(req, res) {
  try {
    const user = await model.getUser(req.params.userId);
    res.status(200).json(user);
  } catch (error) {
    console.error("error fetching user");
    res.status(500).json({ message: "error fetching user" });
  }
}

async function getUserImage(req, res) {
  try {
    const user = await model.getUser(req.params.userId);
    const __dirname = path.resolve();
    const filePath = path.join(__dirname, "uploads", user.image);
    res.status(200).sendFile(filePath);
  } catch (error) {
    console.error("error fetching user");
    res.status(500).json({ message: "error fetching user" });
  }
}

async function updateUserPassword(req, res) {
  try {
    const user = {
      userId: parseInt(req.params.userId),
      password: req.body.password,
    };

    await model.updateUserPassword(user);

    res.status(204).send("update_success");
  } catch (error) {
    console.error("error fetching user");
    res.status(500).json({ message: "error fetching user" });
  }
}

async function getUserNickname(req, res) {
  try {
    const user = await model.getUser(req.params.userId);
    res.status(200).json(user.nickname);
  } catch (error) {
    console.error("error fetching user");
    res.status(500).json({ message: "error fetching user" });
  }
}

async function getUserEmail(req, res) {
  try {
    const user = await model.getUser(req.params.userId);
    res.status(200).json(user.email);
  } catch (error) {
    console.error("error fetching user");
    res.status(500).json({ message: "error fetching user" });
  }
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
  getUserEmail,
};
