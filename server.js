const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
require("dotenv").config();
const adminProductsRouter = require("./routes/admin/products-routes");
const AdminOrderRouter = require("./routes/admin/order-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-route");
const shopReviewRouter = require("./routes/shop/review-routes");
const CommonFeatureRouter = require("./routes/Common/feature-routes");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log(error));
const app = express();

const PORT = process.env.PORT || 5000;

// app.use(
//   cors({
//     origin: process.env.CLIENT_BASE_URL,
//     methods: ["GET", "POST", "DELETE", "PUT"],
//     allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "Cache-control",
//       "Expires",
//       "Pragma",
//     ],
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: "*", // Allow all domains and IP addresses
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-control",
      "Expires",
      "Pragma",
    ],
    credentials: true, // Optional, if you need to allow cookies to be sent with requests
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", AdminOrderRouter);
// for shop
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
// for reviews
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/common/feature", CommonFeatureRouter);

app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));
