const express = require("express");

const {
  createOrder,
  capturePayment,
  getOrderDetails,
  getAllOrdersByUser,
} = require("../../controllers/Shop/order-controller");
// const {
//   createOrder,
//   capturePayment,
// } = require("../../controllers/Shop/code-controller");

const routes = express.Router();
routes.post("/create", createOrder);
routes.post("/capture", capturePayment);
routes.get("/list/:userId", getAllOrdersByUser);
routes.get("/details/:id", getOrderDetails);

module.exports = routes;
