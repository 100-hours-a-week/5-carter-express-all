import express from "express";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";

import userController from "./../controllers/userControllers.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("file"), userController.createUser);
router.post("/login", userController.validateUser);
router.get("/email/:email", userController.validateDuplicatedEmail);
router.get("/nickname/:nickname", userController.validateDuplicatedNickname);

router.get("/:userId/image", userController.getUserImage);
router.get("/:userId/nickname", userController.getUserNickname);
router.patch("/:userId", upload.single("file"), userController.updateUser);
router.delete("/:userId", userController.deleteUser);

router.patch("/:userId/password", userController.updateUserPassword);

export default router;
