import fs from "fs";
import foodModel from "../models/foodModel.js";

// Add food item
const addFood = async (req, res) => {
    try {
        console.log(req.body);  // Debugging: Log request body
        console.log(req.file);  // Debugging: Log file upload details

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image file is required" });
        }

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: req.file.filename, 
        });

        await food.save();
        res.status(201).json({ success: true, message: "Food Added Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error Adding Food", error: error.message });
    }
};

// List all food items
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error Fetching Food List", error: error.message });
    }
};

// Remove food item
const removeFood = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "Food ID is required" });
        }

        const food = await foodModel.findById(id);

        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        if (food.image) {
            const imagePath = `uploads/${food.image}`;
            fs.unlink(imagePath, (err) => {
                if (err) console.log("Error deleting image:", err);
            });
        }

        await foodModel.findByIdAndDelete(id);

        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.log("Error in removeFood:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Correct ES Module Export
export { addFood, listFood, removeFood };
