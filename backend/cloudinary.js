const cloudinary = require("cloudinary").v2; // ✅ require v2 directly

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

/**
 * Deletes an image from Cloudinary
 * @param {string} public_id - The public_id of the image to delete
 */
const deleteFromCloudinary = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    console.log(`Deleted from Cloudinary: ${public_id}`, result);
    return result;
  } catch (error) {
    console.error(`Failed to delete image ${public_id} from Cloudinary:`, error);
    throw new Error("Cloudinary deletion failed");
  }
};

module.exports = { cloudinary, deleteFromCloudinary };
