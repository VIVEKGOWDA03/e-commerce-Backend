const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id:
    "AanjFfrvOa6g6mzmcg0y7WhKAAXJz-IsWXwmcQaH2451MS2d_snik7L9LZqSZ4ZCvkjTPsVuemGcvYBz",
  client_secret:
    "EEm85Bk-BtJS1cFN8SB52Pe0-uazEfhx72Pu8d-N8IbX2yPoeOjlXSD20zPcUrtuIh4JJk6x5WHIi-n4",
  log_level: "debug",
});

module.exports = paypal;
