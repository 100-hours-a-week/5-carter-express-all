import fs from "fs";
import path from "path";
import db from "../db.js";
import bcrypt from "bcryptjs";

const __dirname = path.resolve();
const uploadPath = path.join(__dirname, "uploads/");

async function validateUser(email, password) {
  try {
    const [rows] = await db.query(
      "SELECT userId,password FROM users WHERE email = ?",
      [email],
    );

    if (rows.length > 0) {
      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return user.userId;
      }
    } else {
      return null;
    }
  } catch (err) {
    console.error("Error validating user: ", err);
    return 0;
  }
}

async function validateDuplicatedEmail(email) {
  try {
    const [rows] = await db.query(
      "SELECT COUNT(*) AS count FROM users WHERE email = ?",
      [email],
    );
    const count = rows[0].count;

    if (count > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Error validating duplicated email: ", err);
    return false;
  }
}

async function validateDuplicatedNickname(nickname) {
  try {
    const [rows] = await db.query(
      "SELECT COUNT(*) AS count FROM users WHERE nickname = ?",
      [nickname],
    );
    const count = rows[0].count;

    if (count > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Error validating duplicated nickname: ", err);
    return false;
  }
}

async function createUser(newUser) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newUser.password, salt);

    const [result] = await db.query(
      "INSERT INTO users (email, password, nickname, image) VALUES (?, ?, ?, ?)",
      [newUser.email, hashedPassword, newUser.nickname, ""],
    );

    const newUserId = result.insertId;
    const imageExt = path.extname(newUser.image);
    const image = `user${newUserId}${imageExt}`;

    fs.renameSync(uploadPath + newUser.image, uploadPath + image);

    await db.query("UPDATE users SET image = ? WHERE userId = ?", [
      image,
      newUserId,
    ]);

    console.log("User created successfully");
    return newUserId;
  } catch (err) {
    console.error("Error creating user: ", err);
    throw err;
  }
}

async function getUser(userId) {
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE userId = ?", [
      userId,
    ]);
    if (rows.length > 0) {
      return rows[0];
    } else {
      return null;
    }
  } catch (err) {
    console.error("Error retrieving user: ", err);
    throw err;
  }
}

async function getUserId(email) {
  try {
    const [rows] = await db.query("SELECT userId FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length > 0) {
      return rows[0].userId;
    } else {
      return null;
    }
  } catch (err) {
    console.error("Error retrieving user ID: ", err);
    throw err;
  }
}

async function updateUser(user) {
  try {
    await db.query("UPDATE users SET nickname = ? WHERE userId = ?", [
      user.nickname,
      user.userId,
    ]);

    if (user.image) {
      const [rows] = await db.query(
        "SELECT image FROM users WHERE userId = ?",
        [user.userId],
      );

      if (rows.length > 0) {
        const oldImage = rows[0].image;
        fs.unlink(uploadPath + oldImage, (err) => {
          if (err) {
            console.error("File delete error:", err);
          } else {
            console.log("File was deleted successfully");
          }
        });
      }

      const newImage = `user${user.userId}${path.extname(user.image)}`;
      fs.renameSync(uploadPath + user.image, uploadPath + newImage);

      await db.query("UPDATE users SET image = ? WHERE userId = ?", [
        newImage,
        user.userId,
      ]);
    }

    console.log("User updated successfully");
  } catch (err) {
    console.error("Error updating user: ", err);
    throw err;
  }
}

async function updateUserPassword(user) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    await db.query("UPDATE users SET password = ? WHERE userId = ?", [
      hashedPassword,
      user.userId,
    ]);
    console.log("User password updated successfully");
  } catch (err) {
    console.error("Error updating user password: ", err);
    throw err;
  }
}

async function deleteUser(userId) {
  try {
    const [result] = await db.query("CALL deleteUserAndRelatedData(?)", [
      userId,
    ]);
    console.log(result);
    if (result) {
      console.log("User and related data deleted successfully");
      return true;
    } else {
      console.log("User not found");
      return false;
    }
  } catch (err) {
    console.error("Error deleting user and related data: ", err);
    throw err;
  }
}

export default {
  validateUser,
  validateDuplicatedEmail,
  validateDuplicatedNickname,
  createUser,
  getUser,
  getUserId,
  updateUser,
  updateUserPassword,
  deleteUser,
};
