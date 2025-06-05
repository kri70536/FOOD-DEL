import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://kirtiman:70536@cluster0.9ynwg.mongodb.net/food-del');
        console.log("DB Connected");
    } catch (error) {
        console.error("DB Connection Failed:", error.message);
        process.exit(1);
    }
};
