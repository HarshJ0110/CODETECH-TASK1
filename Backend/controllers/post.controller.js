import { Post } from '../models/post.model.js';
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const createPost = async (req, res) => {
    try {
        const { title, summary, content } = req.body;
        let { postImg } = req.body

        if ([title, summary, content].some(field => field?.trim() === '')) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (postImg) {
            const uploadedResponse = await cloudinary.uploader.upload(postImg);
            postImg = uploadedResponse.secure_url;
        }

        const newPost = await Post.create({
            title,
            summary,
            content,
            postImg,
            author: req.user._id,
        });

        console.log(newPost)

        res.status(200).json({ success: true, newPost });
    } catch (error) {
        console.log("Error in createPost", error.message);
        res.status(500).json({ error: error.message });
    }
}

const getPosts = async (req, res) => {
    try {
        // console.log(req.query)
        const postPerPage = 4;
        let skipPages = postPerPage * (req.query.page - 1 || 0)
        const totalNoOfPosts = await Post.find();
        const len = totalNoOfPosts.length;
        const posts = await Post
            .find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .skip(skipPages)
            .limit(postPerPage);

        if (!posts) {
            return res.status(200).json({ error: 'No post found' })
        }

        res.status(200).json({ len, postPerPage, posts })

    } catch (error) {
        console.log("Error in getPost", error.message);
        res.status(500).json({ error: error.message });
    }
}

const getMyPost = async (req, res) => {
    try {
        const postPerPage = 4;

        let skipPages = postPerPage * (req.query.page - 1 || 0);

        const totalNoOfPosts = await Post.find({ author: req.user._id });

        const len = totalNoOfPosts.length;

        const posts = await Post.find({ author: req.user._id })
        .populate('author', ['username'])
        .sort({ createdAt: -1 })
        .skip(skipPages)
        .limit(postPerPage);

        if (!posts) {
            return res.status(400).json({ error: 'Posts with this id does not exist' })
        }
        res.status(200).json({ len, postPerPage, posts })
    } catch (error) {
        console.log("Error in getMyPost", error.message);
        res.status(500).json({ error: error.message });
    }
}

const getSinglePost = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id)
        const singlePost = await Post.findById(id).populate('author', ['username']);
        if (!singlePost) {
            return res.status(400).json({ error: 'Post with this id does not exist' })
        }
        res.status(200).json({ success: true, singlePost })
    } catch (error) {
        console.log("Error in getSinglePost", error.message);
        res.status(500).json({ error: error.message });
    }
}

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        const existedPost = await Post.findById(id);
        if (!existedPost) {
            return res.status(400).json({ error: 'Post with this id does not exist' })
        }

        if (existedPost.postImg) {
            await cloudinary.uploader.destroy(existedPost.postImg.split("/").pop().split(".")[0])
        }

        if (req.user._id.toString() !== existedPost.author._id.toString()) {
            return res.status(403).json({ error: "Unauthorized access" });
        }

        await Post.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Post deleted successfully" })
    } catch (error) {
        console.log("Error in deletePost", error.message);
        res.status(500).json({ error: error.message });
    }
}

const editPost = async (req, res) => {
    try {

        const { id } = req.params;
        const { title, summary, content } = req.body;
        let { postImg } = req.body

        if ([title, summary, content].some(field => field?.trim() === '')) {
            return res.status(400).json({ error: "All fields are required" });
        }

        let existedPost = await Post.findById(id);

        console.log(req.user)

        if (req.user._id.toString() !== existedPost?.author?._id.toString()) {
            return res.status(403).json({ error: "Unauthorized access" });
        }

        if (postImg) {
            if (existedPost.postImg) {
                await cloudinary.uploader.destroy(existedPost.postImg.split("/").pop().split(".")[0])
            }

            const uploadedResponse = await cloudinary.uploader.upload(postImg);
            postImg = uploadedResponse.secure_url;
        }

        existedPost.title = title
        existedPost.summary = summary
        existedPost.content = content
        existedPost.postImg = postImg || existedPost.postImg

        existedPost = (await existedPost.save())
        res.status(200).json({ success: true, message: "Post updated successfully", existedPost });
    } catch (error) {
        console.log("Error in editPost", error.message);
        res.status(500).json({ error: error.message });
    }
}

export { createPost, getPosts, getSinglePost, deletePost, editPost, getMyPost };
