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

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log(error));
const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
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

app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));

// const express = require("express");
// const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const authRouter = require("./routes/auth/auth-routes");
// require("dotenv").config();
// const adminProductsRouter = require("./routes/admin/products-routes");
// const shopProductsRouter = require("./routes/shop/products-routes");
// const shopCartRouter = require("./routes/shop/cart-routes");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch((error) => {
//     console.error("Database connection error: ", error);
//     process.exit(1); // Exit the process if MongoDB fails to connect
//   });

// // CORS Middleware Configuration
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",  // React local development
//       "http://192.168.64.144:5173/"  // Local network IP for mobile testing
//     ],
//     methods: ["GET", "POST", "DELETE", "PUT"],
//     allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "Cache-control",
//       "Expires",
//       "Pragma",
//       "Referer"
//     ],
//     credentials: true, // Allow cookies to be sent with requests
//   })
// );

// // Logging Middleware for Debugging CORS Requests
// app.use((req, res, next) => {
//   console.log(`Request received: ${req.method} ${req.url}`);
//   console.log(`Origin: ${req.headers.origin}`);
//   next();
// });

// app.use(cookieParser());
// app.use(express.json());

// // Define Routes
// app.use("/api/auth", authRouter);
// app.use("/api/admin/products", adminProductsRouter);
// app.use("/api/shop/products", shopProductsRouter);
// app.use("/api/shop/cart", shopCartRouter);

// // Catch-all Route for undefined routes
// app.use((req, res, next) => {
//   res.status(404).json({ message: "Route not found" });
// });

// // Start the server
// app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
