import mongoose from "mongoose";
import config from "./index";

const connectDB = async (): Promise<void> => {
  try {
    if (!config.mongodbUri) {
      throw new Error("MongoDB URI is missing!");
    }
    await mongoose.connect(config.mongodbUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};


export default connectDB;
