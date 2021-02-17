const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { body, validationResult } = require("express-validator");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");

// @TYPE     POST /api/posts
// @Desc     Make a post
// @access   Private

router.post(
  "/",
  [auth, [body("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        user: user.id,
        text: req.body.text,
        avatar: user.avatar,
        name: user.name,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error!");
    }
  }
);

// @TYPE     GET /api/posts
// @Desc     Get all posts
// @access   Private

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error!");
  }
});

// @TYPE     GET /api/posts/:id
// @Desc     Get post by id
// @access   Private

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: "Post not found" });

    res.json(post);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId")
      return res.status(404).json({ msg: "Post not found" });
    res.status(500).send("Server Error!");
  }
});

// @TYPE     DELETE /api/posts/:id
// @Desc     Delete a post
// @access   Private

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Unauthorized Access" });

    await post.remove();

    res.json("Post Deleted");
  } catch (error) {}
});

module.exports = router;
