import { Request, Response, Router } from "express";

import jwt from "jsonwebtoken";
import { RedisClient } from "../redis/RedisClient";
import { User } from "../models/User";

const router: Router = Router();

const jwt_secret: string = process.env.JWT_SECRET || "jwtsecret";
const jwt_access_expire: number = 60 * 60 * 24;
const jwt_refresh_expiration: number = 60 * 60 * 24 * 30;
const redisClient = RedisClient.getInstance();

// Register route
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create a new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login route
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate user credentials
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    let refreshToken: string;
    // Check if refresh token exists in cache
    const cachedTokens = await redisClient.GET(user._id.toString());
    if (cachedTokens) {
      // If refresh token exists, generate a new access token
      const accessToken = jwt.sign({ userId: user._id }, jwt_secret, {
        expiresIn: jwt_access_expire,
      });
      res.cookie("accessToken", accessToken, { httpOnly: true });

      return res.status(200).json({
        message: "New access token generated and set to cookie",
        tokens: {
          accessToken: accessToken,
          refreshToken: cachedTokens,
        },
      });
    } else {
      // Generate JWT tokens
      refreshToken = jwt.sign({ userId: user._id }, jwt_secret, {
        expiresIn: jwt_refresh_expiration,
      });
      // Save tokens in Redis
      await redisClient.Cache_Value(
        user._id.toString(),
        JSON.stringify({
          refreshToken: refreshToken,
          expires: jwt_refresh_expiration,
        })
      );
    }

    const accessToken = jwt.sign({ userId: user._id }, jwt_secret, {
      expiresIn: jwt_access_expire,
    });

    // Set cookies with tokens
    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    res.status(200).json({
      message: "Login successful",
      tokens: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Logout route
router.post("/logout", async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    // Get tokens from cookies
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    // If tokens are not present, return success response
    if (!accessToken && !refreshToken) {
      return res.status(200).json({ message: "Logout successful" });
    }

    // Remove tokens from Redis
    if (accessToken) {
      await redisClient.Remove_Cache(accessToken);
    }

    if (refreshToken) {
      await redisClient.Remove_Cache(refreshToken);
    }

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get Users
router.get("/profile", async (req: Request, res: Response) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    // Return the list of users
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export default router;
