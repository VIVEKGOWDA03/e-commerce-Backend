const express = require("express");

const { searchProducts } = require("../../controllers/Shop/search-controller");

const routes = express.Router();
routes.get("/:keyword", searchProducts);
module.exports = routes;
