const Order = require("../../models/Order");
const Cart = require("../../models/Cart");

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
      cartId,
    } = req.body;

    if (!userId || !cartItems || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Handle Cash on Delivery (COD) Orders
    if (paymentMethod === "COD") {
      const newlyCreatedOrder = new Order({
        userId,
        cartItems,
        addressInfo,
        orderStatus: "pending",
        productId,
        paymentMethod,
        paymentStatus: "pending",
        totalAmount,
        orderDate,
        orderUpdateDate,
        cartId,
      });

      await newlyCreatedOrder.save();

      // Respond with a success message and the order ID
      return res.status(201).json({
        success: true,
        approvalUrl: "Cash on Delivery - No approval URL required",
        orderId: newlyCreatedOrder._id,
      });
    }

    // Handle PayPal Orders
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url:
          "https://7ce2-2409-40f4-100e-a860-41a6-3e3e-6b55-3de1.ngrok-free.app/api/shop/paypal-return",
        cancel_url:
          "https://7ce2-2409-40f4-100e-a860-41a6-3e3e-6b55-3de1.ngrok-free.app/api/shop/paypal-cancel",
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
          message: "Error while creating PayPal payment",
        });
      } else {
        const newlyCreatedOrder = new Order({
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
          cartId,
        });
        await newlyCreatedOrder.save();

        const approvalUrl = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        res.status(201).json({
          success: true,
          approvalUrl,
          orderId: newlyCreatedOrder._id,
        });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { payerId, paymentId, orderId } = req.body;
    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }

    if (order.paymentMethod === "COD") {
      // Update status directly for COD orders
      order.paymentStatus = "pending"; // Payment collected on delivery
      order.orderStatus = "confirmed";
    } else {
      // Update status for PayPal orders
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.paymentId = paymentId;
      order.payerId = payerId;
    }

    const getCardId = order.cartId;
    await Cart.findByIdAndDelete(getCardId);
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

module.exports = { createOrder, capturePayment };
