const qr = require("qrcode");

function createQrCode() {
  qr.toFile("qr_code.png", "http://192.168.1.39:3000", function (err) {
    if (err) return console.error(err);
    console.log("QR code generated and saved.");
  });
}

createQrCode()