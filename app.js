const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require('express-session');
const passport = require('passport');
const { auth } = require('./src/middleware/auth');
const app = express();

// Test route to see if server starts
app.get("/test", (req, res) => {
  res.json({ message: "Server is starting up correctly" });
});

console.log("Loading templateRoutes...");
const templateRoutes = require("./src/routes/templateRoutes");
console.log("✓ templateRoutes loaded");

console.log("Loading documentRoutes...");
const documentRoutes = require("./src/routes/documentRoutes");
console.log("✓ documentRoutes loaded");

console.log("Loading templateProjectRoutes...");
const templateProjectRoutes = require("./src/routes/templateProjectRoutes");
console.log("✓ templateProjectRoutes loaded");

console.log("Loading documentProjectRoutes...");
const documentProjectRoutes = require("./src/routes/documentProjectRoutes");
console.log("✓ documentProjectRoutes loaded");

console.log("Loading imageRouter...");
const imageRouter = require("./src/routes/imageRouter");
console.log("✓ imageRouter loaded");

console.log("Loading projectRoutes...");
const projectRoutes = require("./src/routes/projectsRoutes");
console.log("✓ projectRoutes loaded");

console.log("Loading organizationsRouter...");
const organizationsRouter = require("./src/routes/organizationsRoutes");
console.log("✓ organizationsRouter loaded");

console.log("Loading usersRouter...");
const usersRouter = require("./src/routes/usersRoutes");
console.log("✓ usersRouter loaded");

console.log("Loading activityLogsRouter...");
const activityLogsRouter = require("./src/routes/activityLogsRoute");
console.log("✓ activityLogsRouter loaded");

console.log("Loading paymentsRouter...");
const paymentsRouter = require("./src/routes/paymentsRoute");
console.log("✓ paymentsRouter loaded");

console.log("Loading profileRouter...");
const profileRouter = require("./src/routes/profileRoutes");
console.log("✓ profileRouter loaded");

console.log("Loading clientRouter...");
const clientRouter = require("./src/routes/clientRoutes");
console.log("✓ clientRouter loaded");

console.log("Loading roleRoutes...");
const roleRoutes = require("./src/routes/roleRoutes")
console.log("✓ roleRoutes loaded");

console.log("Loading googleAuthRoutes...");
const googleAuthRoutes = require("./src/routes/googleAuthRoutes");
console.log("✓ googleAuthRoutes loaded");

app.use(express.urlencoded({ extended: false }));
//app.use(express.json());

// Configure CORS to allow requests from localhost:4000
app.use(cors({
  origin: ['http://localhost:4000', 'http://127.0.0.1:4000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));


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

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fieldSize: 25 * 1024 * 1024 },
});
//app.use(upload.single("docxFile"));
//app.use(upload.single("image"));

app.use("/api/auth", googleAuthRoutes);

try {
  console.log("Registering /api/users");
  app.use("/api/users", usersRouter);
  console.log("✓ usersRouter loaded");
} catch (error) {
  console.error("❌ Error loading usersRouter:", error.message);
}

try {
  app.use("/api/templates", upload.single("docxFile"), templateRoutes);
  console.log("✓ templateRoutes loaded");
} catch (error) {
  console.error("❌ Error loading templateRoutes:", error.message);
}

try {
  app.use("/api/documents", documentRoutes);
  console.log("✓ documentRoutes loaded");
} catch (error) {
  console.error("❌ Error loading documentRoutes:", error.message);
}

try {
  app.use("/api/project", upload.single("docxFile"), templateProjectRoutes);
  console.log("✓ templateProjectRoutes loaded");
} catch (error) {
  console.error("❌ Error loading templateProjectRoutes:", error.message);
}

try {
  app.use("/api/projectDocs", documentProjectRoutes);
  console.log("✓ documentProjectRoutes loaded");
} catch (error) {
  console.error("❌ Error loading documentProjectRoutes:", error.message);
}

try {
  app.use("/api/projects", projectRoutes);
  console.log("✓ projectRoutes loaded");
} catch (error) {
  console.error("❌ Error loading projectRoutes:", error.message);
}

try {
  app.use("/api/image", imageRouter);
  console.log("✓ imageRouter loaded");
} catch (error) {
  console.error("❌ Error loading imageRouter:", error.message);
}

try {
  app.use("/api/organizations", organizationsRouter);
  console.log("✓ organizationsRouter loaded");
} catch (error) {
  console.error("❌ Error loading organizationsRouter:", error.message);
}

try {
  app.use("/api/activityLogs", activityLogsRouter);
  console.log("✓ activityLogsRouter loaded");
} catch (error) {
  console.error("❌ Error loading activityLogsRouter:", error.message);
}

try {
  app.use("/api/payments", paymentsRouter);
  console.log("✓ paymentsRouter loaded");
} catch (error) {
  console.error("❌ Error loading paymentsRouter:", error.message);
}

try {
  app.use("/api/clients", clientRouter);
  console.log("✓ clientRouter loaded");
} catch (error) {
  console.error("❌ Error loading clientRouter:", error.message);
}

try {
  app.use("/api/profile", profileRouter);
  console.log("✓ profileRouter loaded");
} catch (error) {
  console.error("❌ Error loading profileRouter:", error.message);
}

try {
  app.use("/api/roles",roleRoutes)
  console.log("✓ roleRoutes loaded");
} catch (error) {
  console.error("❌ Error loading roleRoutes:", error.message);
}

try {
  app.use("/api/projectDocs", templateProjectRoutes);
  console.log("✓ templateProjectRoutes (duplicate) loaded");
} catch (error) {
  console.error("❌ Error loading templateProjectRoutes (duplicate):", error.message);
}

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", message: "The server is healthy!" });
});

module.exports = app;
