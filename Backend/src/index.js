import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});
import connectToDB from "./db/index.js";
import {app} from './app.js';
import { v2 as cloudinary } from 'cloudinary';
export const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET 
});
const startServer = async () => {
    try {
      await connectToDB(); 
  
      app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
      });
    } catch (error) {
      console.error("Error during startup", error);
      process.exit(1); 
    }
  };
  
  startServer();