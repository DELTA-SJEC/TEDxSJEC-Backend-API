// const Jimp = require("jimp");
const path = require("path");
const QRCode = require("qrcode");
const cloudinary = require("./cloudinary-image-cdn-service");

class ImageService {
  async generateQR(order_id) {
    try {
      await QRCode.toFile(
        path.resolve(__dirname, `../data/qr/${order_id}.png`),
        order_id
      );
    } catch (err) {
      console.log(err);
    }
  }

  // async generateUserImage(avatar, order_id) {
  //   try {
  //     const jimResp = await Jimp.read(avatar);
  //     jimResp
  //       .resize(150, Jimp.AUTO)
  //       .write(path.resolve(__dirname, `../data/image/${order_id}.png`));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  async generateUserImage(file) {
    try {
      const image = await cloudinary.uploader.upload(file.path);
      console.log(image);
      return image.secure_url;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new ImageService();
