import { uploadCloudinary } from "../utils/cloudinary.js";

import {Asset} from "../models/asset.model.js"; // Assuming you have an Asset model defined
import getFileType from "../utils/fileTypeHelper.js";
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
    // console.log({cloudinaryResult});

    if (!cloudinaryResult.secure_url) {
        return res.status(400).json({ message: 'Failed to upload file' });
    }
    const assetData = {
        filename: req.file.originalname,
        type: getFileType(req.file.mimetype),
        size: req.file.size,
        url: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
    }
    const asset = new Asset(assetData);
    await asset.save();
    
    return res.status(200).json({message:"file uploaded Successfully"})
    
    
    } catch (error) {
        console.log("Error uploading asset",error);
        
        return res.status(500).json({message:"Server error"})
    }
}

const getAssets = async (req, res) => {
    try {
        const { filename, type, sortBy } = req.query;

        const query = {};

        // Filter by filename (partial match, case-insensitive)
        if (filename) {
            query.filename = { $regex: filename, $options: 'i' };
        }

        // Filter by type (exact match)
        if (type) {
            query.type = type;
        }

        // Default sort: latest first
        let sortOption = { createdAt: -1 };

        switch (sortBy) {
            case 'oldest':
                sortOption = { createdAt: 1 };
                break;
            case 'lowSize':
                sortOption = { size: 1 };
                break;
            case 'highSize':
                sortOption = { size: -1 };
                break;
            default:
                sortOption = { createdAt: -1 };
        }

        const assets = await Asset.find(query).sort(sortOption);
        return res.status(200).json({ assets });

    } catch (error) {
        console.error("Error fetching assets:", error);
        return res.status(500).json({ message: "Server error while fetching assets" });
    }
};

export {uploadAsset,getAssets}