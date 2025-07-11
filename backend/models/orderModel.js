import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    Status: { type: String, default: "Food Processing" },
    date: { type: Date, default: Date.now },  // orrect function reference
    payment: { type: Boolean, default: false }
});

// Fix model initialization
const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;