import model from "../models/userModel.js";

import path from "path";

async function validateUser(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await model.validateUser(email, password);
    if (user !== 0) {
      req.session.user = { id: user };
      res.status(200).json({ result: true, user: { id: user } });
    } else {
      res
        .status(400)
        .json({ result: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error validating user:", error);
    res.status(500).json({ message: "Error validating user" });
  }
}

async function getUserId(req, res) {
  if (req.session.user) {
    res.status(200).json({ userId: req.session.user.id });
  } else {
    res.status(403).json({ message: "Unauthorized" });
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
      userId: parseInt(req.session.user.id),
      nickname: req.body.nickname,
      image: image,
    };

    await model.updateUser(user);
    res.status(204).send("update_success");
  } catch (error) {
    console.error("error fetching user1");
    res.status(500).json({ message: "error fetching user" });
  }
}

async function deleteUser(req, res) {
  try {
    await model.deleteUser(req.session.user.id);

    res.status(204).send("delete_success");
  } catch (error) {
    console.error("error fetching user2");
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
    console.error("error fetching user3");
    res.status(500).json({ message: "error fetching user" });
  }
}

async function getUser(req, res) {
  try {
    const user = await model.getUser(req.params.userId);
    res.status(200).json(user);
  } catch (error) {
    console.error("error fetching user4");
    res.status(500).json({ message: "error fetching user" });
  }
}

async function getUserImage(req, res) {
  try {
    const user = await model.getUser(req.session.user.id);
    const __dirname = path.resolve();
    const filePath = path.join(__dirname, "uploads", user.image);
    res.status(200).sendFile(filePath);
  } catch (error) {
    console.error("error fetching user5");
    res.status(500).json({ message: "error fetching user" });
  }
}

async function getWriterImage(req, res) {
  try {
    const user = await model.getUser(req.params.userId);
    const __dirname = path.resolve();
    const filePath = path.join(__dirname, "uploads", user.image);
    res.status(200).sendFile(filePath);
  } catch (error) {
    console.error("error fetching user5");
    res.status(500).json({ message: "error fetching user" });
  }
}

async function updateUserPassword(req, res) {
  try {
    const user = {
      userId: parseInt(req.session.user.id),
      password: req.body.password,
    };

    await model.updateUserPassword(user);

    res.status(204).send("update_success");
  } catch (error) {
    console.error("error fetching user6");
    res.status(500).json({ message: "error fetching user" });
  }
}

async function getUserNickname(req, res) {
  try {
    const user = await model.getUser(req.session.user.id);
    res.status(200).json(user.nickname);
  } catch (error) {
    console.error("error fetching user7");
    res.status(500).json({ message: "error fetching user" });
  }
}

async function getWriterNickname(req, res) {
  try {
    const user = await model.getUser(req.params.userId);
    res.status(200).json(user.nickname);
  } catch (error) {
    console.error("error fetching user7");
    res.status(500).json({ message: "error fetching user" });
  }
}

async function getUserEmail(req, res) {
  try {
    const user = await model.getUser(req.session.user.id);
    res.status(200).json(user.email);
  } catch (error) {
    console.error("error fetching user8");
    res.status(500).json({ message: "error fetching user" });
  }
}

async function logoutUser(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logout successful" });
  });
}

export default {
  validateUser,
  getUserId,
  validateDuplicatedEmail,
  validateDuplicatedNickname,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  getUserImage,
  getWriterImage,
  getUserNickname,
  getWriterNickname,
  getUserEmail,
  logoutUser,
};
