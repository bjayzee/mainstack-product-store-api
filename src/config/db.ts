import mongoose from "mongoose";

export const connectDB = () =>{
    mongoose.connect(process.env.MONGO_URL as string).then(() => console.log("database connected successfully"))
    .catch((error: Error) => console.log(error));
}