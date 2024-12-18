const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const addToCart = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    // Extract and parse inputs
    const { userId, productId, quantity } = req.body;
    const parsedQuantity = Number(quantity);

    // Validate inputs
    console.log("Validating inputs...");
    if (!userId || !productId || isNaN(parsedQuantity) || parsedQuantity <= 0) {
      // console.log("Invalid inputs detected.");
      return res.status(400).json({
        success: false,
        message: "invalid data provided for cart",
      });
    }

    console.log("Checking product existence...");
    const product = await Product.findById(productId);
    if (!product) {
      // console.log("Product not found.");
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    }

    // console.log("Finding user cart...");
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // console.log("Creating a new cart...");
      cart = new Cart({ userId, items: [] });  // Correct field name
    }

    // console.log("Updating cart items...");
    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity: parsedQuantity });
    } else {
      cart.items[findCurrentProductIndex].quantity += parsedQuantity;
    }

    // console.log("Saving cart...");
    await cart.save();

    // console.log("Cart saved successfully.");
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    // console.error("Error in addToCart:", error);
    res.status(500).json({
      success: false,
      message: error.message || "error",
    });
  }
};


const mongoose = require("mongoose"); // Ensure mongoose is imported

const fetchCartItem = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId existence and format
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId format",
      });
    }

    // Fetch cart and populate related productId fields
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    // If cart not found
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // Filter out invalid product references
    const validItems = cart.items.filter(
      (productItem) => productItem.productId
    );

    // Update the cart if invalid items are found
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    // Populate cart items
    const populatedCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    // Send response
    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populatedCartItems,
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);

    res.status(500).json({
      success: false,
      message: "An internal server error occurred",
      error: error.message,
    });
  }
};


const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "invalid data provided",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "cart not found!",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });
    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error",
    });
  }
};

module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItem,
};
