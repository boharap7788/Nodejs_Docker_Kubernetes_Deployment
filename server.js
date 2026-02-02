const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Root endpoint with application info
app.get("/", (req, res) => {
  res.json({
    message: "Hello from Node.js app running in Kubernetes!",
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || "1.0.0",
    environment: process.env.NODE_ENV || "development",
    hostname: require("os").hostname(),
  });
});

// Health check endpoint for Kubernetes liveness probe
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Readiness probe endpoint
app.get("/ready", (req, res) => {
  // Add any dependency checks here (database, external services, etc.)
  res.status(200).json({
    status: "ready",
    timestamp: new Date().toISOString(),
  });
});

// Metrics endpoint (basic)
app.get("/metrics", (req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    pid: process.pid,
    version: process.version,
  });
});

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed. Process terminating...");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed. Process terminating...");
    process.exit(0);
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🏠 Hostname: ${require("os").hostname()}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log("=".repeat(50));
  console.log("\nAvailable endpoints:");
  console.log(`  GET  /        - Main application endpoint`);
  console.log(`  GET  /health  - Health check (liveness probe)`);
  console.log(`  GET  /ready   - Readiness probe`);
  console.log(`  GET  /metrics - Application metrics`);
  console.log("=".repeat(50));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
