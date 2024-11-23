const express = require("express");

const {
  handleImageUpload,
  addProduct,
  deleteProduct,
  editProduct,
  fetchAllProduct,
} = require("../../controllers/admin/products-controller");

const { upload } = require("../../helpers/cloudinary");
const routes = express.Router();
routes.post("/upload-image", upload.single("my_file"), handleImageUpload);
routes.post("/add", addProduct);
routes.put("/edit/:id", editProduct);
routes.delete("/delete/:id", deleteProduct);
routes.get("/get", fetchAllProduct);

module.exports = routes;
