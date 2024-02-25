import express, { Request, Response } from "express";

import { User, IUser } from "../models/User";

import { JobListing, IJobListing } from "../models/Jobs";
import { verifyAccessToken } from "../middleware/VerifyAuth";

const router = express.Router();

router.get("/test", verifyAccessToken, (req, res) => {
  res.json("test");
});

// Create a job listing
router.post(
  "/post_jobs",
  verifyAccessToken,
  async (req: Request, res: Response) => {
    try {
      const { link, title } = req.body;
      const jobListing: IJobListing = new JobListing({
        link,
        title,
      });
      await jobListing.save();
      res
        .status(201)
        .json({ message: "Job listing created successfully", jobListing });
    } catch (error) {
      console.error("Error creating job listing:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Get all job listings
router.get(
  "/list_jobs",
  verifyAccessToken,
  async (req: Request, res: Response) => {
    try {
      const jobListings: IJobListing[] = await JobListing.find();
      res.json(jobListings);
    } catch (error) {
      console.error("Error fetching job listings:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Get a job listing by ID
router.get(
  "/get_job/:id",
  verifyAccessToken,
  async (req: Request, res: Response) => {
    try {
      const jobListing: IJobListing | null = await JobListing.findById(
        req.params.id
      );
      if (!jobListing) {
        return res.status(404).json({ error: "Job listing not found" });
      }
      res.json(jobListing);
    } catch (error) {
      console.error("Error fetching job listing by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Add a user to the list of users who applied for a job
router.post(
  "/add_user/:id/apply",
  verifyAccessToken,
  async (req: Request, res: Response) => {
    try {
      const jobListingId: string = req.params.id;
      const userId: string = req.body.userId;

      // Check if the user exists
      const user: IUser | null = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update the job listing to add the user to the list of users applied
      const updatedJobListing: IJobListing | null =
        await JobListing.findByIdAndUpdate(
          jobListingId,
          { $addToSet: { usersApplied: userId } },
          { new: true }
        );

      if (!updatedJobListing) {
        return res.status(404).json({ error: "Job listing not found" });
      }

      res.json({
        message: "User applied for the job successfully",
        jobListing: updatedJobListing,
      });
    } catch (error) {
      console.error("Error applying for job:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Update a job listing by ID
router.put(
  "/update_job/:id",
  verifyAccessToken,
  async (req: Request, res: Response) => {
    try {
      const jobListingId: string = req.params.id;
      const { date, link, title } = req.body;

      const updatedJobListing: IJobListing | null =
        await JobListing.findByIdAndUpdate(
          jobListingId,
          { date, link, title },
          { new: true }
        );

      if (!updatedJobListing) {
        return res.status(404).json({ error: "Job listing not found" });
      }

      res.json({
        message: "Job listing updated successfully",
        jobListing: updatedJobListing,
      });
    } catch (error) {
      console.error("Error updating job listing:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Delete a job listing by ID
router.delete(
  "/remove_job/:id",
  verifyAccessToken,
  async (req: Request, res: Response) => {
    try {
      const jobListingId: string = req.params.id;
      const deletedJobListing: IJobListing | null =
        await JobListing.findByIdAndDelete(jobListingId);

      if (!deletedJobListing) {
        return res.status(404).json({ error: "Job listing not found" });
      }

      res.json({ message: "Job listing deleted successfully" });
    } catch (error) {
      console.error("Error deleting job listing:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
