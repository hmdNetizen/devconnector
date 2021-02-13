const express = require("express");
const router = express.Router();

// @TYPE     GET /api/posts
// @access   Public

router.get("/", (req, res) => res.send("Posts route"));

module.exports = router;
