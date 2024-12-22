const { express } = require("express");
const Address = require("../../models/Address");

const addAddress = async (req, res) => {
  try {
    const { userId, city, pincode, phone, address, notes } = req.body;
    if (!userId || !city || !pincode || !phone || !address || !notes) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided",
      });
    }

    const newlyCreatedAddress = new Address({
      userId,
      city,
      pincode,
      phone,
      address,
      notes,
    });

    await newlyCreatedAddress.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedAddress,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "error",
    });
  }
};

const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId required",
      });
    }

    const addressList = await Address.find({ userId });
    res.status(200).json({
      success: false,
      data: addressList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "error",
    });
  }
};

const editAllAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;
    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "userId and addressId required",
      });
    }

    const address = await Address.findOneAndUpdate(
      {
        _id: addressId,
        userId,
      },
      formData,
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "error",
    });
  }
};

const deleteAllAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "userId and addressId required",
      });
    }

    const address = await Address.findOneAndDelete({ _id: addressId, userId });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted",
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
  addAddress,
  editAllAddress,
  fetchAllAddress,
  deleteAllAddress,
};
