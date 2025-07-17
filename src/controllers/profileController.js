const Profile = require("../models/profileModel");
const User = require("../models/userModel"); // Assuming the User model exists
const { uploadToS3 } = require("../services/fileService");

// Create Profile Controller
const createAndUpdateProfile = async (req, res) => {
  const userId = req.user._id;
  try {
    const { firstName, lastName, gender, address, dateOfBirth, mobile } =
      req.body;
    const profilePic = req.file;

    if (
      !userId ||
      !firstName ||
      !lastName ||
      !gender ||
      !address ||
      !dateOfBirth ||
      !mobile
      
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if profile already exists for the user
    let profile = await Profile.findOne({ userId });

    // Store address as string directly (schema expects String, not object)
    let profilePicUrl = "";
    if (profilePic) {
      try {
        // Check if AWS credentials are configured
        if (!process.env.AWS_ACCESS_KEY1 || !process.env.AWS_SECRET_KEY1) {
          console.log("AWS credentials not configured, skipping S3 upload");
          profilePicUrl = ""; // Set to empty string if no credentials
        } else {
          // Upload profile picture to S3
          const fileName = `profile-pics/${userId}-${Date.now()}.jpg`; // Set a unique key for the image
          profilePicUrl = await uploadToS3(
            profilePic.buffer,
            fileName,
            profilePic.mimetype
          ); // Upload to S3 and get the URL
          console.log("Profile picture uploaded:", profilePicUrl);
        }
      } catch (uploadError) {
        console.error("Error uploading profile picture:", uploadError);
        // Continue without profile picture instead of failing the entire request
        console.log("Continuing profile creation without image upload");
        profilePicUrl = ""; // Set to empty string if upload fails
      }
    }
    
    if (profile) {
      // Update the existing profile
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.gender = gender;
      profile.address = address; // Store as string directly
      profile.mobile = mobile;
      profile.dateOfBirth = dateOfBirth;
      // Only update profilePic if we have a successful upload
      if (profilePic && profilePicUrl) {
        profile.profilePic = profilePicUrl;
      }
      await profile.save();
      return res
        .status(200)
        .json({ message: "Profile updated successfully", profile });
    } else {
      // Create new profile
      profile = new Profile({
        userId,
        firstName,
        lastName,
        gender,
        address: address, // Store as string directly
        dateOfBirth,
        mobile,
        profilePic: profilePicUrl, // Use uploaded URL or empty string
      });

      await profile.save();
      return res
        .status(201)
        .json({ message: "Profile created successfully", profile });
    }
  } catch (error) {
    console.log(error);
    
    // Handle multer file size errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: "File size too large. Maximum size is 4MB." });
    }
    
    // Handle multer file type errors
    if (error.message === 'Only image files are allowed!') {
      return res.status(400).json({ error: "Only image files are allowed!" });
    }
    
    return res
      .status(500)
      .json({ error: "Server error", details: error.message });
  }
};

// Get Profile Controller
const getProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate("userId", "email");
    // Format each profile as needed
    const formattedProfiles = profiles.map(profile => {
      return {
        ...profile.toObject(),
        email: profile.userId.email,
        // address is already a string, no need to format
      };
    });
    return res.status(200).json({ profiles: formattedProfiles });
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Get Profile by userId
const getUserProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    // Find the profile for the given userId
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found for this user" });
    }
    return res.status(200).json(profile);
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = {
  createAndUpdateProfile,
  getProfile,
  getUserProfileById,
};
