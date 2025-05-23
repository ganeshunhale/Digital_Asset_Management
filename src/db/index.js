import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    console.log("db_uri",process.env.MONGODB_URI);
    
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log(`Connected to the database: ${connectionInstance.connection.name}`);
    console.log(`MongoDB Host: ${connectionInstance.connection.host}`);
    
  } catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1);
  }
}
export default connectToDB;