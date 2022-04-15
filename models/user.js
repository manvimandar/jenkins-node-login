const mongoose = require("mongoose");

// user schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    //   Renames the collection
    collection: "userDetails",
  }
);

// user model
const userModel = mongoose.model("userSchema", userSchema);

module.exports = userModel;
