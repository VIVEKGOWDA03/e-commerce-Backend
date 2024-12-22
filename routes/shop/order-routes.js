const express = require("express");

const { createOrder } = require("../../controllers/Shop/oder-controller");

const routes = express.Router();
routes.post("/create", createOrder);
module.exports = routes;
