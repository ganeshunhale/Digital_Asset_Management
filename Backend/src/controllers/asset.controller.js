import { deleteFromCloudinary, uploadCloudinary } from "../utils/cloudinary.js";

import {Asset} from "../models/asset.model.js"; 
import getFileType from "../utils/fileTypeHelper.js";


const MAX_FILE_SIZE = 10 * 1024 * 1024; 

const ALLOWED_FILE_TYPES = ['image', 'video', 'pdf'];

const uploadAsset = async (req,res)=>{
    try {
        console.log("upload asset called");
        if (!req.file || Object.keys(req.file).length === 0) {
            return res.status(400).json({ message: 'No files were uploaded' });
        }

        if (req.file.size > MAX_FILE_SIZE) {
            return res.status(400).json({ 
                message: `File size too large. Maximum size allowed is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
                maxSizeInBytes: MAX_FILE_SIZE
            });
        }

        const fileType = getFileType(req.file.mimetype);
        if (!ALLOWED_FILE_TYPES.includes(fileType)) {
            return res.status(400).json({ 
                message: `Invalid file type. Only photos, videos, and PDFs are allowed.`,
                allowedTypes: ALLOWED_FILE_TYPES
            });
        }

        const FilePath = req.file?.path

        if (!FilePath) {
            return res.status(400).json({ message: 'File is required' });
        }

        const cloudinaryResult = await uploadCloudinary(FilePath)

    if (!cloudinaryResult.secure_url) {
        return res.status(400).json({ message: 'Failed to upload file' });
    }
    
    const newAsset = await Asset.create({
        filename: req.file.originalname,
        type: fileType,
        size: req.file.size,
        url: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
    });
    
    return res.status(200).json({message:"file uploaded Successfully"})
    
    
    } catch (error) {
        console.log("Error uploading asset",error);
        
        return res.status(500).json({message:"Server error"})
    }
}

const getAssets = async (req, res) => {
    try {
        const { filename, type, sortBy } = req.query;
        console.log("get assets called");
        const query = {};
        if (filename) {
            query.filename = { $regex: filename, $options: 'i' };
        }

        if (type && type !== 'all') {
            query.type = type;
        }

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
const deleteAsset = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("deleted id",id);
        const asset = await Asset.findById(id);
        if (!asset) {
            return res.status(404).json({ message: "Asset not found" });
        }

        if (asset.publicId) {
            await deleteFromCloudinary(asset.publicId);
        }

        await Asset.findByIdAndDelete(id);

        return res.status(200).json({ message: "Asset deleted successfully" });
    } catch (error) {
        console.error("Error deleting asset:", error);
        return res.status(500).json({ message: "Server error while deleting asset" });
    }
};
export {uploadAsset,getAssets,deleteAsset}