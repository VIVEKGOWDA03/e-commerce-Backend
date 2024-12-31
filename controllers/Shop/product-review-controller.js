const Order = require("../../models/Order");
const Product = require("../../models/Product");
const productReview = require("../../models/Review");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } =
      req.body;

    // Temporarily commented out the order check logic
    /*
    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: "confirmed",
    });
    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase this product to review it.",
      });
    }
    */

    const CheckExistingReview = await productReview.findOne({
      productId,
      userId,
    });
    if (CheckExistingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already added a review for this product.",
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
    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLength;

    await Product.findByIdAndUpdate(productId, { averageReview });

    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error adding review",
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
      message: "Error retrieving reviews",
    });
  }
};

module.exports = {
  addProductReview,
  getProductReview,
};
