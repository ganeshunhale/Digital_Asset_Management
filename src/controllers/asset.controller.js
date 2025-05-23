import { uploadCloudinary } from "../utils/cloudinary.js";

const uploadAsset = async (req,res)=>{
    try {
        if (!req.file || Object.keys(req.file).length === 0) {
            return res.status(400).json({ message: 'No files were uploaded' });
          }
          const FilePath = req.file?.path

          if (!FilePath) {
            return res.status(400).json({ message: 'Avatar is required' });
        }

        const cloudinaryResult = await uploadCloudinary(FilePath)
    console.log({cloudinaryResult});

    if (!cloudinaryResult.secure_url) {
        return res.status(400).json({ message: 'Failed to upload file' });
    }

    return res.status(200).json({message:"file uploaded Successfully"})
    
    
    } catch (error) {
        console.log("Error uploading asset",error);
        
        return res.status(500).json({message:"Server error"})
    }
}

export {uploadAsset}