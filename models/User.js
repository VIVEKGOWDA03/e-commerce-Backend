const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
});

// Create partial index for userName field to allow nulls but enforce uniqueness for non-null values
// UserSchema.index(
//   { userName: 1 },
//   { partialFilterExpression: { userName: { $ne: null } } }
// );

const User = mongoose.model("User", UserSchema);

module.exports = User;
