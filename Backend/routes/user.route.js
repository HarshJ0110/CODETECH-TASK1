import express from "express"
import { getUser, loginUser, logoutUser, signupUser } from "../controllers/user.controller.js";
import isAuthenticated from "../middleware/auth.middleware.js";

const router = express.Router();

router.route('/signup').post(signupUser)
router.route('/login').post(loginUser)
router.route('/me').get(isAuthenticated, getUser)
router.route('/logout').get(isAuthenticated, logoutUser)

export default router
