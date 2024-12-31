const Product = require("../../models/Product");

const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword || typeof keyword !== "string" || keyword.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Keyword is required and must be in string format",
      });
    }

    const regEx = new RegExp(keyword.trim(), "i");
    const createsearchQuery = {
      $or: [
        { title: regEx },
        { description: regEx },
        { category: regEx }, 
        { brand: regEx },
      ],
    };

    const searchResults = await Product.find(createsearchQuery);

    if (searchResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found matching the search criteria",
      });
    }

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.error("Search Products Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = { searchProducts };
