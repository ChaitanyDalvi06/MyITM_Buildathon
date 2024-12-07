import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
	try {
		const { postedBy, text } = req.body;
		let { img } = req.body;

		if (!postedBy || !text) {
			return res.status(400).json({ error: "Postedby and text fields are required" });
		}

		const user = await User.findById(postedBy);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		if (user._id.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to create post" });
		}

		const maxLength = 500;
		if (text.length > maxLength) {
			return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newPost = new Post({ postedBy, text, img });
		await newPost.save();

		res.status(201).json(newPost);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log(err);
	}
};

const getPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.status(200).json(post);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.postedBy.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "Unauthorized to delete post" });
		}

		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const likeUnlikePost = async (req, res) => {
	try {
		const { id: postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			res.status(200).json({ message: "Post unliked successfully" });
		} else {
			// Like post
			post.likes.push(userId);
			await post.save();
			res.status(200).json({ message: "Post liked successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const replyToPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		const userProfilePic = req.user.profilePic;
		const username = req.user.username;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const reply = { userId, text, userProfilePic, username };

		post.replies.push(reply);
		await post.save();

		res.status(200).json(reply);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getFeedPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

		res.status(200).json(feedPosts);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getUserPosts = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// postController.js
const getar = async (req, res) => {
    try {
        const links = [
            `<blockquote class="snapchat-embed" data-snapchat-embed-width="416" data-snapchat-embed-height="692" data-snapchat-embed-url="https://www.snapchat.com/lens/1d4141109bda4a8ea049b457074b4af9/embed" data-snapchat-embed-style="border-radius: 40px;" data-snapchat-embed-title="convocation Lens" style="background:#C4C4C4; border:0; border-radius:40px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:416px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px); display: flex; flex-direction: column; position: relative; height:650px;"> <div style="display: flex; flex-direction: row; align-items: center;">  <a title="convocation Lens" href="https://www.snapchat.com/lens/1d4141109bda4a8ea049b457074b4af9" style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; width: 40px; margin:16px; cursor: pointer"></a>  <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"></div> </div> <div style="flex: 1;"></div> <div style="display: flex; flex-direction: row; align-items: center; border-end-end-radius: 40px; border-end-start-radius: 40px;">  <a title="convocation Lens" href="https://www.snapchat.com/lens/1d4141109bda4a8ea049b457074b4af9" style="background-color: yellow; width:100%; padding: 10px 20px; border: none; border-radius: inherit; cursor: pointer; text-align: center; display: flex;flex-direction: row;justify-content: center; text-decoration: none; color: black;">  View more on Snapchat  </a> </div></blockquote><script async src="https://www.snapchat.com/embed.js"></script>`,
            `<blockquote class="snapchat-embed" data-snapchat-embed-width="416" data-snapchat-embed-height="692" data-snapchat-embed-url="https://www.snapchat.com/lens/41a9f0094b364eed9e85fe6799ebcf22/embed" data-snapchat-embed-style="border-radius: 40px;" data-snapchat-embed-title="Fantastic Hand Lens" style="background:#C4C4C4; border:0; border-radius:40px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:416px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px); display: flex; flex-direction: column; position: relative; height:650px;"> <div style="display: flex; flex-direction: row; align-items: center;">  <a title="Fantastic Hand Lens" href="https://www.snapchat.com/lens/41a9f0094b364eed9e85fe6799ebcf22" style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; width: 40px; margin:16px; cursor: pointer"></a>  <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"></div> </div> <div style="flex: 1;"></div> <div style="display: flex; flex-direction: row; align-items: center; border-end-end-radius: 40px; border-end-start-radius: 40px;">  <a title="Fantastic Hand Lens" href="https://www.snapchat.com/lens/41a9f0094b364eed9e85fe6799ebcf22" style="background-color: yellow; width:100%; padding: 10px 20px; border: none; border-radius: inherit; cursor: pointer; text-align: center; display: flex;flex-direction: row;justify-content: center; text-decoration: none; color: black;">  View more on Snapchat  </a> </div></blockquote><script async src="https://www.snapchat.com/embed.js"></script>`
        ];
        res.status(200).json({ embeds: links });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error });
    }
};

module.exports = { getar };


export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts, getar };
