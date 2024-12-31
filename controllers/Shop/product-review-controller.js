const Order = require("../../models/Order");
const Product = require("../../models/Product");
const productReview = require("../../models/Review");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } =
      req.body;

    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: "confirmed",
    });
    // console.log(order)
    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase this product  to review it .",
      });
    }
    const CheckExistingReview = await productReview.findOne({
      productId,
      userId,
    });
    if (CheckExistingReview) {
      return res.status(400).json({
        success: false,
        message: "you have already added a review for this product",
      });
    }

    const newReview = await productReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });
    await newReview.save();
    const reviews = await productReview.find({ productId });
    const totalReviewsLenght = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLenght;

    await Product.findByIdAndUpdate(productId, { averageReview });
    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "error",
    });
  }
};

const getProductReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await productReview.find({ productId });
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "error",
    });
  }
};

module.exports = {
  addProductReview,
  getProductReview,
};
