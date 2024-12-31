const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const mongoose = require("mongoose");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      productId,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    if (!userId || !cartItems || !totalAmount || !addressInfo) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "description",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Error while Creating paypal payment",
        });
      } else {
        newlyCreatedOrder = new Order({
          userId,
          cartItems,
          addressInfo,
          orderStatus,
          productId,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId,
          payerId,
          cartId,
        });
        await newlyCreatedOrder.save();
      }
      const approvalUrl = paymentInfo.links.find(
        (link) => link.rel === "approval_url"
      ).href;

      res.status(201).json({
        success: true,
        approvalUrl,
        orderId: newlyCreatedOrder._id,
      });
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "some error occured",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { payerId, paymentId, orderId } = req.body;
    let order = await Order.findById(orderId);
    if (!order) {
      return req.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title} `,
        });
      }
      product.totalStock -= item.quantity;
      await product.save();
    }

    const getCardId = order.cartId;
    await Cart.findByIdAndDelete(getCardId);
    await order.save();
    res.status(200).json({
      success: true,
      message: "order confirmed",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "some error occured",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });
    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "not orders found",
      });
    }
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "some error occured",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID",
      });
    }

    // Fetch the order
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error); // Log detailed error
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the order",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getOrderDetails,
  getAllOrdersByUser,
};
