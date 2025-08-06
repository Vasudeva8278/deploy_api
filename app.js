const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const app = express();

const templateRoutes = require('./src/routes/templateRoutes');
const documentRoutes = require('./src/routes/documentRoutes');
const templateProjectRoutes = require('./src/routes/templateProjectRoutes');
const documentProjectRoutes = require('./src/routes/documentProjectRoutes');
const imageRouter = require('./src/routes/imageRouter');
const zipRoute = require('./src/routes/zipRoute');
const projectRoutes = require('./src/routes/projectsRoutes');
const organizationsRouter = require('./src/routes/organizationsRoutes');
const usersRouter = require('./src/routes/usersRoutes');
const activityLogsRouter = require('./src/routes/activityLogsRoute');
const paymentsRouter = require('./src/routes/paymentsRoute');
const profileRouter = require('./src/routes/profileRoutes');
const roleRoutes = require('./src/routes/roleRoutes');
const clientRouter = require('./src/routes/clientRoutes');
const googleAuthRoutes = require('./src/routes/googleAuthRoutes');
const { auth } = require('./src/middleware/auth');

// Connect to database
connectDB();

// Middleware
app.use(express.urlencoded({ extended: false }));
//app.use(express.json());
app.use(cors());

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
  app.use("/api/templates", auth, templateRoutes);
} catch (error) {
  console.error("❌ Error loading templateRoutes:", error.message);
}

try {
  app.use("/api/documents", auth, documentRoutes);
} catch (error) {
  console.error("❌ Error loading documentRoutes:", error.message);
}

try {
  app.use("/api/project", auth, templateProjectRoutes);
} catch (error) {
  console.error("❌ Error loading templateProjectRoutes:", error.message);
}

try {
  app.use("/api/projectDocs", auth, documentProjectRoutes);
} catch (error) {
  console.error("❌ Error loading documentProjectRoutes:", error.message);
}

try {
  app.use("/api/projects", auth, projectRoutes);
} catch (error) {
  console.error("❌ Error loading projectRoutes:", error.message);
}

try {
  app.use("/api/image", imageRouter);
} catch (error) {
  console.error("❌ Error loading imageRouter:", error.message);
}

try {
  app.use("/api/organizations", auth, organizationsRouter);
} catch (error) {
  console.error("❌ Error loading organizationsRouter:", error.message);
}

try {
  app.use("/api/activityLogs", auth, activityLogsRouter);
} catch (error) {
  console.error("❌ Error loading activityLogsRouter:", error.message);
}

try {
  app.use("/api/payments", auth, paymentsRouter);
} catch (error) {
  console.error("❌ Error loading paymentsRouter:", error.message);
}

try {
  app.use("/api/clients", auth, clientRouter);
} catch (error) {
  console.error("❌ Error loading clientRouter:", error.message);
}

try {
  app.use("/api/profile", auth, profileRouter);
} catch (error) {
  console.error("❌ Error loading profileRouter:", error.message);
}

try {
  app.use("/api/roles", auth, roleRoutes)
} catch (error) {
  console.error("❌ Error loading roleRoutes:", error.message);
}

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", message: "The server is healthy!" });
});

module.exports = app;
