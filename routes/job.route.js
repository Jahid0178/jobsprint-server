const express = require("express");
const router = express.Router();
const {
  createJob,
  getAllJobs,
  updateJob,
  deleteJob,
  applyJob,
  getSingleJob,
  getAppliedJobs,
  getAdminJobs,
} = require("../controllers/job.controller");
const authenticatedMiddleware = require("../middlewares/authenticated-middleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.get("/", getAllJobs);
router.get("/appliedJobs", authenticatedMiddleware, getAppliedJobs);
router.get(
  "/adminJobs",
  authenticatedMiddleware,
  adminMiddleware,
  getAdminJobs
);
router.get("/:id", getSingleJob);
router.post("/create", authenticatedMiddleware, adminMiddleware, createJob);
router.put("/update/:id", authenticatedMiddleware, adminMiddleware, updateJob);
router.delete(
  "/delete/:id",
  authenticatedMiddleware,
  adminMiddleware,
  deleteJob
);
router.post("/apply/:id", authenticatedMiddleware, applyJob);

module.exports = router;
