import { User } from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateTokensAndSetCookies.js";


const signupUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            return res.status(400).json({ error: "Check your credentials" })
        }

        const newUser = await User.create({
            email,
            username,
            password,
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res)
            res.status(200).json({
                success: true,
                newUser
            })
        } else {
            res.status(400).json({ error: "Invalid user data" })
        }

    } catch (error) {
        console.log("Error in signupUser", error.message)
        res.status(500).json({ error: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log(req.body)

        let isPasswordValid = false
        if(user){
            isPasswordValid = await user.isPasswordCorrect(password);
        }
        if (!user || !isPasswordValid) {
            return res.status(400).json({ error: "Invalid username or password" })
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        console.log("Error in loginUser", error.message)
        res.status(500).json({ error: error.message })
    }
}

const logoutUser = (req, res) => {
    try {
        res.cookie("token","").status(200).json({ message: "User loggeout successfully" })
    } catch (error) {
        console.log("Error in logoutUser", error.message)
        res.status(500).json({ error: error.message })
    }
}

const getUser = async (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in getUser", error.message)
        res.status(500).json({ error: error.message })
    }
}

export {signupUser, loginUser, getUser, logoutUser}