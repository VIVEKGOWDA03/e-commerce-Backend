const express = require("express");

const {
  addProductReview,
  getProductReview,
} = require("../../controllers/Shop/product-review-controller");

const routes = express.Router();
routes.post("/add", addProductReview);
routes.get("/:productId", getProductReview);
module.exports = routes;
