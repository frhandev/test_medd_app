const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const UserSchema = require("../models/User");
const passport = require("passport");

const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "thisiscodeformediclapplicationwhichisbuiltinreactappproject";

// Session configuration
router.use(
  session({
    secret: "keyboard cat", // Secret key for signing cookies
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // For development (set to true for production with HTTPS)
      maxAge: 1000 * 60 * 60 * 24, // Session expires in 24 hours
    },
  })
);

// Initialize Passport
router.use(passport.initialize());
router.use(passport.session());

// Passport serialization/deserialization for sessions
passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  cb(null, id);
});

// Route 1: Register a New User
router.post(
  "/register",
  [
    body("email", "Please Enter a Valid Email").isEmail(),
    body("name", "Username should be at least 4 characters.").isLength({
      min: 4,
    }),
    body("password", "Password Should Be At Least 8 Characters.").isLength({
      min: 8,
    }),
    body("phone", "Phone Number Should Be 10 Digits.").isLength({ min: 10 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      const existingUser = await UserSchema.findOne({ email: req.body.email });
      if (existingUser) {
        return res
          .status(403)
          .json({ error: "A User with this email address already exists" });
      }

      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);

      const newUser = await UserSchema.create({
        email: req.body.email,
        name: req.body.name,
        password: hash,
        phone: req.body.phone,
        createdAt: Date(),
      });

      const payload = {
        user: {
          id: newUser.id,
        },
      };

      const authToken = jwt.sign(payload, JWT_SECRET);
      res.json({ authToken });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  }
);

// Route 2: Login Existing User
router.post(
  "/login",
  [body("email", "Please Enter a Valid Email").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await UserSchema.findOne({ email: req.body.email });

      if (!user) {
        return res.status(403).json({ error: "Invalid Credentials" });
      }

      const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!passwordMatch) {
        return res.status(403).json({ error: "Invalid Credentials" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(payload, JWT_SECRET);
      res.status(200).json({ authToken });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3: Fetch User Data by Email
router.get("/user", async (req, res) => {
  try {
    const email = req.headers.email; // Extract the email from the request headers

    if (!email) {
      return res
        .status(400)
        .json({ error: "Email not found in the request headers" });
    }

    const user = await UserSchema.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userDetails = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json(userDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

// Route 4: Update User Information
router.put(
  "/user",
  [
    body("name", "Username should be at least 4 characters").isLength({
      min: 4,
    }),
    body("phone", "Phone number should be 10 digits").isLength({ min: 10 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const email = req.headers.email; // Extract email from headers

      if (!email) {
        return res
          .status(400)
          .json({ error: "Email not found in the request headers" });
      }

      const user = await UserSchema.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.name = req.body.name;
      user.phone = req.body.phone;
      user.updatedAt = Date();

      const updatedUser = await user.save();

      const payload = {
        user: {
          id: updatedUser.id,
        },
      };

      const authToken = jwt.sign(payload, JWT_SECRET);
      res.json({ authToken });
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
