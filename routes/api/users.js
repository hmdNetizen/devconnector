const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const gravatar = require("gravatar");
const config = require("config");
const { body, validationResult } = require("express-validator");
const User = require("../../models/User");

// @TYPE     POST /api/users
// @Desc     Register a user
// @access   Public

router.post(
  "/",
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body("password", "Please enter a minimum of 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    try {
      //   See if user exist
      let user = await User.findOne({ email });
      if (user)
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exist" }] });

      // Get the avatar
      const avatar = gravatar.url(email, { s: "200", d: "mm", r: "pg" });

      //   Create a new user instance
      user = new User({ name, email, password, avatar });

      // Hash password before saving to database
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

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
      res.status(500).send("Unknown Server Error!");
    }
  }
);

module.exports = router;
