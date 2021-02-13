const express = require("express");
const router = express.Router();

// @TYPE     GET /api/profile
// @access   Public

router.get("/", (req, res) => res.send("Profile route"));

module.exports = router;
