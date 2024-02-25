import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";


import AuthRoutes from "./routes/authRoutes";
import JobRoutes from "./routes/jobRoutes";

import { verifyAccessToken } from "./middleware/VerifyAuth";
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
(async () => {
  const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/proelevate";
  try {
    await mongoose.connect(DB_URI, {
      autoIndex: true,
    });
    console.log("Connected to DB");
  } catch (error) {
    console.log("Error connecting to DB", error);
  }
})();


app.use("/api2/v1/auth", AuthRoutes);
app.use("/api2/v1/jobs", JobRoutes);
// Error handling middleware
//@ts-ignore
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.get("/", verifyAccessToken, (req, res) => {
  res.json({
    msg: "ok",
  });
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});
