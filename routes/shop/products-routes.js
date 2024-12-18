const express = require("express");

const {
  getFilteredProducts,
  getProductDetails,
} = require("../../controllers/Shop/products-controllers");

const routes = express.Router();
routes.get("/get", getFilteredProducts);
routes.get("/get/:id", getProductDetails);
module.exports = routes;
