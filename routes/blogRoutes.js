import express from "express";
import auth from "../middlewares/AuthMiddleWare.js";
import {
  addBlog,
  deleteBlog,
  getAllBlogs,
  likeBlog,
  likeComment,
  postComment,
  updateBlog,
} from "../controller/blogController.js";
import upload from "../middlewares/multerConfig.js";

const router = express.Router();

// Blog Routes
router.post("/add-blog",upload.single('image'), auth, addBlog);
router.get("/get-all-blogs", getAllBlogs);
router.delete("/delete-blog/:blogId", auth, deleteBlog);
router.put("/update-blog/:blogId", auth, updateBlog);

// Comment Routes
router.post("/add-comment/:blogId", auth, postComment);
router.put("/blog/:blogId/like", auth, likeBlog);
router.put("/comment/:commentId/like", auth, likeComment);

export default router;