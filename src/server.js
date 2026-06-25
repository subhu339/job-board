// src/server.js
// Entry point — wires everything together

require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./db");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.static("public")); // serve frontend files

// Make io accessible in routes
app.set("io", io);

// Routes
app.use("/auth", authRoutes);
app.use("/jobs", jobRoutes);

// Socket.io — real time connection
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});