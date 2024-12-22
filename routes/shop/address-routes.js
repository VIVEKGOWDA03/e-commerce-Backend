const express = require("express");

const {
  addAddress,
  editAllAddress,
  fetchAllAddress,
  deleteAllAddress,
} = require("../../controllers/Shop/address-contoller");

const routes = express.Router();
routes.post("/add", addAddress);
routes.get("/get/:userId", fetchAllAddress);
routes.delete("/delete/:userId/:addressId", deleteAllAddress);
routes.put("/edit/:userId/:addressId", editAllAddress);

module.exports = routes;
