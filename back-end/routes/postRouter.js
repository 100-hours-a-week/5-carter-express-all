import express from "express";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";

import postController from "./../controllers/postControllers.js";

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

router.get("/comments/:postId", postController.getComments);
router.post("/comments", postController.createComment);
router.patch("/comments/:commentId", postController.updateComment);
router.delete("/comments/:commentId", postController.deleteComment);

router.get("/:postId", postController.getPost);
router.get("/:postId/image", postController.getPostImage);
router.post("/:postId", upload.single("file"), postController.updatePost);
router.delete("/:postId", postController.deletePost);
router.patch("/:postId/increment-view", postController.incrementView);

router.get("/", postController.getPosts);
router.post("/", upload.single("file"), postController.createPost);

export default router;
