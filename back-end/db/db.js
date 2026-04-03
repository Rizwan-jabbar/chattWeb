import mongoose from "mongoose";

let cachedConnection = global.mongooseConnection || null;
let cachedPromise = global.mongooseConnectionPromise || null;

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is not defined");
  }

  if (!cachedPromise) {
    cachedPromise = mongoose.connect(process.env.MONGO_URL).then((mongooseInstance) => {
      console.log(`MongoDB Connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    });

    global.mongooseConnectionPromise = cachedPromise;
  }

  try {
    cachedConnection = await cachedPromise;
    global.mongooseConnection = cachedConnection;
    return cachedConnection;
  } catch (error) {
    global.mongooseConnectionPromise = null;
    cachedPromise = null;
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export default connectDB;
