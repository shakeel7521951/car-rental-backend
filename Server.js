import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/useRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import blogRoutes from './routes/blogRoutes.js';

const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database is connected"))
  .catch((error) => console.error("Error in connecting database:", error));

// API Routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", serviceRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", blogRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on Port no ${port}`);
});