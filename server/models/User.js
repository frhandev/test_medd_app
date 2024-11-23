const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate email addresses
      lowercase: true, // Converts email to lowercase before saving
      trim: true, // Removes extra spaces around the email
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true, // Removes extra spaces around the name
    },
    phone: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate phone numbers
      match: /^[0-9]{11}$/, // Validates the phone number to be exactly 10 digits
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Export the model
module.exports = mongoose.model("User", userSchema);
