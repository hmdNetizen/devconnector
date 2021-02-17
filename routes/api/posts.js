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

module.exports = router;
