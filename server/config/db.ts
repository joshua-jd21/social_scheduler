import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    mongoose.connection.on("connected", async () => {
      console.log("MongoDB connected");
    });

    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error: any) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
