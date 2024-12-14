const qr = require("qrcode");

function createQrCode() {
  qr.toFile("qr_code.png", "https://qr-scanner-h9agjc1q8-ficazams-projects.vercel.app/", function (err) {
    if (err) return console.error(err);
    console.log("QR code generated and saved.");
  });
}

createQrCode()