const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    address: {
      type:String,
    },
    mobile: {
      type: String, // Changed from Number to String to handle string inputs
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    profilePic: {
      type: String, // URL or file path for the profile picture
      // Stores the AWS S3 URL, e.g. https://s3.ap-south-1.amazonaws.com/neo.storage/profile-pics/<filename>
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

module.exports = mongoose.model("Profile", ProfileSchema);
