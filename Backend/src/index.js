import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});
import connectToDB from "./db/index.js";
import {app} from './app.js';

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