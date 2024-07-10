import express from "express";
import { createPost, deletePost, editPost, getMyPost, getPosts, getSinglePost } from "../controllers/post.controller.js";
import isAuthenticated from "../middleware/auth.middleware.js";

const router = express.Router();
router.route('/create').post(isAuthenticated, createPost);
router.route('/getpost').get(getPosts);
router.route('/getsinglepost/:id').get(getSinglePost);
router.route('/delete/:id').delete(isAuthenticated, deletePost);
router.route('/edit/:id').put(isAuthenticated, editPost);
router.route('/getmypost').get(isAuthenticated, getMyPost);

export default router;
