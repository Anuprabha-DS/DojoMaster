const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "dojo_master_images", // Cloudinary folder
        allowed_formats: ["jpg", "png", "jpeg", "webp"], // Allowed file types
    },
});

const upload = multer({ storage });

module.exports = upload;
