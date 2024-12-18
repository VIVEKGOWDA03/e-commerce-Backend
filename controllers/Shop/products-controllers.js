const Product = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
  try {
    const { Category, Brand, sortBy = "price-lowtohigh" } = req.query;
    let filters = {};

    // console.log("Received query parameters:", req.query);

    // Check if Category is provided and filter by category
    if (Category) {
      filters.category = { $in: Category.split(",") };
    }

    // Check if Brand is provided and filter by brand, but ignore empty strings
    if (Brand && Brand !== "") {
      filters.brand = { $in: Brand.split(",") };
    }

    // Sorting logic
    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.price = 1; // default sort by price ascending
        break;
    }

    // Fetch the filtered products from the database
    const products = await Product.find(filters).sort(sort);

    // Send the response with filtered products
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred in filteredProduct",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const {id} = req.params;
    const product = await Product.findById(id);
    if (!product)
      return res.status(404).json({
        success: false,
        message: "product  not found",
      });
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred in getProductDetails",
    });
  }
};
module.exports = { getFilteredProducts, getProductDetails };
