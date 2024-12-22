const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id:
    "Af2bjYlPysMf1Zm_3PPQK9aoCRbeNQHXjGU3dr0Bv3c3RVssrVCUztPSy68om-Z7fTFUGW2aS9gDWGAE",
  client_secret:
    "EOQ_RLxWKyJn01iwbyuBr5yssKPuNLzuRHVr4sz4PPs-gWZghQwr_o089iQfs62tUfAnGXdA45764zsG",
});

module.exports = paypal;
