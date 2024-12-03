const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path"); // Import the 'path' module
const connectToMongo = require("./db");
const app = express();

const PORT = process.env.PORT || 3000;

// Set up middleware
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the 'public' directory
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectToMongo();

// API Routes
app.use("/api/auth", require("./routes/auth"));

// Handle the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html")); // Serve the React app's index.html
});

// Fallback for any other routes (SPA behavior)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
