import mongoose from "mongoose";

const connectdb = async () => {
  mongoose.connection.on("connected", () => console.log("database connceted"));

  await mongoose.connect(`${process.env.MONGO_DB_URI}/Bg-remoer`);
};

export default connectdb;
