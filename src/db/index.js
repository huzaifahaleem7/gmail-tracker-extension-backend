import mongoose from "mongoose";
import { DB_Name } from "../constant.js";
import asyncHandler from "../utils/asyncHandler.js";

const connection = async () => {
  try {
    const connectionInfo = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_Name}`
    );
    console.log(
      `Mongo DB Coneect !! DB Host ${connectionInfo.connection.host}`
    );
  } catch (error) {
    console.error(`DB Connection Failed`, error);
    process.exit(1);
  }
};

export default connection;
