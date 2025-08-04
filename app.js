const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require('express-session');
const passport = require('passport');
const { auth } = require('./src/middleware/auth');
const connectDB = require('./config/database');
const app = express();

// Test route to see if server starts
app.get("/test", (req, res) => {
  res.json({ message: "Server is starting up correctly" });
});

// Connect to database first
connectDB();

const templateRoutes = require("./src/routes/templateRoutes");
const documentRoutes = require("./src/routes/documentRoutes");
const templateProjectRoutes = require("./src/routes/templateProjectRoutes");
const documentProjectRoutes = require("./src/routes/documentProjectRoutes");
const imageRouter = require("./src/routes/imageRouter");
const projectRoutes = require("./src/routes/projectsRoutes");
const organizationsRouter = require("./src/routes/organizationsRoutes");
const usersRouter = require("./src/routes/usersRoutes");
const activityLogsRouter = require("./src/routes/activityLogsRoute");
const paymentsRouter = require("./src/routes/paymentsRoute");
const profileRouter = require("./src/routes/profileRoutes");
const clientRouter = require("./src/routes/clientRoutes");
const roleRoutes = require("./src/routes/roleRoutes")
const googleAuthRoutes = require("./src/routes/googleAuthRoutes");

app.use(express.urlencoded({ extended: false }));
//app.use(express.json());

// Allow CORS for any endpoint and any origin (open CORS)
app.use(cors());

app.get("/", (req, res) => {
  return res.json({ message: "get success running" });
});

app.get("/test-docs", (req, res) => {
  return res.json({ message: "Documents endpoint test - server is working" });
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(
  express.json({
    limit: "10mb",
  })
);
//app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fieldSize: 25 * 1024 * 1024 },
});
//app.use(upload.single("docxFile"));
//app.use(upload.single("image"));

app.use("/api/auth", googleAuthRoutes);

try {
  app.use("/api/users", usersRouter);
} catch (error) {
  console.error("❌ Error loading usersRouter:", error.message);
}

try {
  app.use("/api/templates", upload.single("docxFile"), templateRoutes);
} catch (error) {
  console.error("❌ Error loading templateRoutes:", error.message);
}

try {
  app.use("/api/documents", documentRoutes);
} catch (error) {
  console.error("❌ Error loading documentRoutes:", error.message);
}

try {
  app.use("/api/project", upload.single("docxFile"), templateProjectRoutes);
} catch (error) {
  console.error("❌ Error loading templateProjectRoutes:", error.message);
}

try {
  app.use("/api/projectDocs", documentProjectRoutes);
} catch (error) {
  console.error("❌ Error loading documentProjectRoutes:", error.message);
}

try {
  app.use("/api/projects", projectRoutes);
} catch (error) {
  console.error("❌ Error loading projectRoutes:", error.message);
}

try {
  app.use("/api/image", imageRouter);
} catch (error) {
  console.error("❌ Error loading imageRouter:", error.message);
}

try {
  app.use("/api/organizations", organizationsRouter);
} catch (error) {
  console.error("❌ Error loading organizationsRouter:", error.message);
}

try {
  app.use("/api/activityLogs", activityLogsRouter);
} catch (error) {
  console.error("❌ Error loading activityLogsRouter:", error.message);
}

try {
  app.use("/api/payments", paymentsRouter);
} catch (error) {
  console.error("❌ Error loading paymentsRouter:", error.message);
}

try {
  app.use("/api/clients", clientRouter);
} catch (error) {
  console.error("❌ Error loading clientRouter:", error.message);
}

try {
  app.use("/api/profile", profileRouter);
} catch (error) {
  console.error("❌ Error loading profileRouter:", error.message);
}

try {
  app.use("/api/roles",roleRoutes)
} catch (error) {
  console.error("❌ Error loading roleRoutes:", error.message);
}

try {
  app.use("/api/projectDocs", templateProjectRoutes);
} catch (error) {
  console.error("❌ Error loading templateProjectRoutes (duplicate):", error.message);
}

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", message: "The server is healthy!" });
});

module.exports = app;
