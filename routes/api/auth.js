const express = require("express");
const router = express.Router();

// @TYPE     GET /api/auth
// @access   Public

router.get("/", (req, res) => res.send("Auth route"));

module.exports = router;
