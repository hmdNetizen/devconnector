const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const auth = require("../../middleware/auth");
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");

// @TYPE     GET /api/auth
// @access   Public

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Unknown Server Error!" });
  }
});

// @TYPE     POST /api/auth
// @desc    Authenticate user and get token
// @access   Public

router.post(
  "/",
  [
    body("email", "Please a enter a valid email").isEmail(),
    body("password", "Please a valid password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user)
        return res.status(400).json([{ errors: "Invalid Credentials" }]);

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res.status(400).json([{ errors: "Invalid Credentials" }]);

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json(token);
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(400).send("Unknown Server Error!");
    }
  }
);

module.exports = router;
