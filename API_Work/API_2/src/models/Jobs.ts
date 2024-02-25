import mongoose, { Schema, Document } from "mongoose";

// Define interface for JobListing document
export interface IJobListing extends Document {
  Job_Id?: string;
  date: Date;
  link: string;
  title: string;
  usersApplied: mongoose.Types.Array<mongoose.Types.ObjectId>; // Array of user IDs
}

// Define schema for JobListing
const JobListingSchema: Schema = new Schema<IJobListing>({
  Job_Id: { type: String, unique: true },
  date: { type: Date, required: true, default: Date.now() },
  link: { type: String, required: true },
  title: { type: String, required: true },
  usersApplied: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of user IDs
});

// Create and export JobListing model
export const JobListing = mongoose.model<IJobListing>(
  "JobListing",
  JobListingSchema
);
