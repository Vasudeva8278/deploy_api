// routes/projectRoutes.js
const express = require("express");
const multer = require("multer");
const projectsController = require("../controllers/projectsController");
const { auth } = require("../middleware/auth");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Routes
router.get(
  "/get-labels/:projectId",
  auth,
  projectsController.getExistingLabelsWithinProject
);
router.get(
  "/templateHighlights/:projectId",
  auth,
  projectsController.getTemplateHighlightsinProject
);

router.get("/:id", auth, projectsController.getProjectById);

router.post("/", auth, upload.single("thumbnail"), projectsController.createProject);
router.put(
  "/:id",
  auth,
  upload.single("thumbnail"),
  projectsController.updateProject
);
router.delete("/:id", auth, projectsController.deleteProject);
router.get("/", auth, projectsController.getAllProjects); // New route for all projects
router.get("/:id/subprojects", auth, projectsController.getSubprojects); // New route for subprojects

module.exports = router;
