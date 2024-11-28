const express = require("express");
const router = express.Router();
const {
  createJob,
  getAllJobs,
  updateJob,
  deleteJob,
  applyJob,
} = require("../controllers/job.controller");
const authenticatedMiddleware = require("../middlewares/authenticated-middleware");

router.get("/", authenticatedMiddleware, getAllJobs);
router.post("/create", authenticatedMiddleware, createJob);
router.put("/update/:id", authenticatedMiddleware, updateJob);
router.delete("/delete/:id", authenticatedMiddleware, deleteJob);
router.post("/apply/:id", authenticatedMiddleware, applyJob);

module.exports = router;
