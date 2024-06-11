import express from "express";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";

import ensureAuthenticated from "../middleware/auth.js";
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

router.post("/login", userController.validateUser);
router.get("/userId", userController.getUserId);
router.post("/", upload.single("file"), userController.createUser);
router.get("/email/:email", userController.validateDuplicatedEmail);
router.get("/nickname/:nickname", userController.validateDuplicatedNickname);
router.get("/:userId/image", userController.getWriterImage);
router.get("/:userId/nickname", userController.getWriterNickname);

router.get("/image", ensureAuthenticated, userController.getUserImage);
router.get("/nickname", ensureAuthenticated, userController.getUserNickname);
router.get("/email", ensureAuthenticated, userController.getUserEmail);
router.patch(
  "/",
  ensureAuthenticated,
  upload.single("file"),
  userController.updateUser,
);
router.patch(
  "/password",
  ensureAuthenticated,
  userController.updateUserPassword,
);
router.delete("/", ensureAuthenticated, userController.deleteUser);
router.post("/logout", ensureAuthenticated, userController.logoutUser);

export default router;
