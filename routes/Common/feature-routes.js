const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} = require("../../controllers/Common/feature-controller");

const routes = express.Router();
routes.post("/add", addFeatureImage);
routes.get("/get", getFeatureImages);
routes.delete("/delete/:id", deleteFeatureImage);

module.exports = routes;
