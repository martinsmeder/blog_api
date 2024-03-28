const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Should throw an error if the email is already in database
  },
  password: {
    type: String,
    required: true,
  },
});

// Define a method to validate the user's password
userSchema.methods.validPassword = async function (password) {
  try {
    // Use bcrypt to compare the provided password with the hashed password
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    // Handle error, such as logging or returning false
    console.error("Error validating password:", error);
    return false;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
