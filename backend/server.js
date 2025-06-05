import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import path from "path";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js"; // Added cart routes
import 'dotenv/config';
import orderRouter from "./routes/orderRoute.js";

// Load environment variables
dotenv.config();

// App config
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to DB
connectDB();

// Serve uploaded images
app.use("/uploads", express.static(path.resolve("uploads")));

// API routes
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter); // Added cart API routes
app.use("/api/order",orderRouter)

// Root Route
app.get("/", (req, res) => {
    res.send("API Working");
});

// Start server
app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});
