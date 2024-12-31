const mongoose = require("mongoose");
const { SiTrueup } = require("react-icons/si");

const FeatureSchema = new mongoose.Schema(
  {
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feature", FeatureSchema);