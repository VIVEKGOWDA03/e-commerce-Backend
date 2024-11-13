const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
require('dotenv').config();

mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log(error));
const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin:"http://localhost:5173", 
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

app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));
