const express = require("express");

const {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItem,
} = require('../../controllers/Shop/cart-controller');

const routes = express.Router();
routes.post("/add", addToCart);
routes.get("/get/:userId", fetchCartItem);
routes.put("/update-cart", updateCartItemQty);
routes.delete("/:userId/:productId", deleteCartItem);

module.exports = routes;
