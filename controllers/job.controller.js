const Job = require("../models/jobs.model");
const User = require("../models/user.model");

const getAllJobs = async (req, res) => {
  try {
    let queryOptions = {
      ...req.query,
    };

    if (req.query?.company) {
      queryOptions.company = { $regex: req.query.company, $options: "i" };
    }

    const jobs = await Job.find(queryOptions);

    res
      .status(200)
      .json({ message: "Jobs found", count: jobs.length, data: jobs });
  } catch (error) {
    console.log("get all jobs error", error);
  }
};

const createJob = async (req, res) => {
  try {
    const { company, position, contract, location } = req.body;

    if (!company || !position || !contract || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const job = await Job.create({
      company,
      position,
      contract,
      location,
      postedBy: req?.user?._id,
    });

    await job.save();

    res.status(201).json({ message: "Job created successfully", data: job });
  } catch (error) {
    console.log("create job error", error);
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { company, position, contract, location } = req.body;

    if (!company || !position || !contract || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        company,
        position,
        contract,
        location,
      },
      {
        new: true,
      }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res
      .status(200)
      .json({ message: "Job updated successfully", data: updatedJob });
  } catch (error) {
    console.log("update job error", error);
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res
      .status(200)
      .json({ message: "Job deleted successfully", data: deletedJob });
  } catch (error) {
    console.log("delete job error", error);
  }
};

const applyJob = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user._id);

    const existingAppliedJob = await User.findOne({
      _id: req.user._id,
      appliedJobs: id,
    });

    if (existingAppliedJob) {
      return res.status(400).json({ message: "Job already applied" });
    }

    if (user.role !== "user") {
      return res.status(400).json({ message: "Only users can apply for jobs" });
    }

    await User.updateOne({ _id: req.user._id }, { $push: { appliedJobs: id } });

    res.status(200).json({ message: "Job applied successfully" });
  } catch (error) {
    console.log("apply job error", error);
  }
};

module.exports = { createJob, getAllJobs, updateJob, deleteJob, applyJob };
