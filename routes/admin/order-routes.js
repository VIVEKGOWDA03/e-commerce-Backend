const express = require("express");

const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  UpdateOrderStatus,
} = require("../../controllers/admin/order-controller");

const routes = express.Router();
routes.get("/get", getAllOrdersOfAllUsers);
routes.get("/details/:id", getOrderDetailsForAdmin);
routes.put("/update/:id", UpdateOrderStatus);

module.exports = routes;
