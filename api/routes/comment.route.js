import express from "express";
import {
  getPostComments,
  createComment,
  likeComment,
  editComment,
  deleteComment,
  getAllComments,
} from "../controllers/comment.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/get-comments/:postId", getPostComments);
router.get("/get-all-comments", verifyUser, getAllComments);
router.post("/create-comment", verifyUser, createComment);
router.put("/like-comment/:commentId", verifyUser, likeComment);
router.put("/edit-comment/:commentId", verifyUser, editComment);
router.delete("/delete-comment/:commentId", verifyUser, deleteComment);

export default router;
