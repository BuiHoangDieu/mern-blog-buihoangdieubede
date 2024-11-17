import express from "express";
import {
  testAPI,
  updateUser,
  deleteUser,
  signOutUser,
  getAllUsers,
  deleteUserWithAdmin,
  getUser,
} from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";
const router = express.Router();

router.get("/", testAPI);
router.put("/update/:userId", verifyUser, updateUser);
router.delete("/delete/:userId", verifyUser, deleteUser);
router.post("/sign-out", signOutUser);
router.get("/get-users", verifyUser, getAllUsers);
router.get("/:userId", getUser);
router.delete("/admin-delete-user/:userId", verifyUser, deleteUserWithAdmin);

export default router;
