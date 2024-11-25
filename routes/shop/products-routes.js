const express = require("express");

const {
  getFilteredProducts,
} = require("../../controllers/Shop/products-controllers");

const routes = express.Router();
routes.get("/get", getFilteredProducts);

module.exports = routes;
