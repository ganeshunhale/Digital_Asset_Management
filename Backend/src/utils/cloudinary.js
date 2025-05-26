import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET 
// });

const uploadCloudinary = async (localFilePath) => {
    try {
        
        if (!fs.existsSync(localFilePath)) {
            throw new Error(`File not found: ${localFilePath}`);
          }

        const result = await cloudinary.uploader.upload(localFilePath,  {
            
            resource_type:"auto",
            
        });
        fs.unlinkSync(localFilePath);
        return result;

    } catch (error) {
        console.log("error", error);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
          }
          throw error;
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;

        const response = await cloudinary.uploader.destroy(publicId);

        return response;
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        throw error;
    }
};


export { uploadCloudinary ,deleteFromCloudinary}