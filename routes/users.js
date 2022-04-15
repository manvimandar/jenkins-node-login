const express = require("express");

const router = express.Router();

// User Controllers
const userControllers = require("../controllers/userController");

// API authentication middleware
const auth = require("../middlewares/auth");

// GET all users
router.get("/", userControllers.getAllUsers);

// Regsiter new user
router.post("/register", userControllers.userRegister);

// Login user
router.post("/login", userControllers.userLogin);

// get access-token from refresh-token
router.post("/token", userControllers.getAccessToken);

// Routes Auth Middleware
router.use(auth);

// GET particular user
router.get("/:id", auth, userControllers.getUser);

// PUT request to update username
router.put("/update/:id", auth, userControllers.userUpdate);

// DELETE request to remove user
router.delete("/remove/:id", auth, userControllers.userRemove);

module.exports = router;
