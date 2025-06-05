import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Placing user order
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";

    try {
        console.log("Received order request:", req.body);

        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            Status: "Order Placed",
            payment: false,
            date: new Date(),
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "NPR",
                product_data: { name: item.name },
                unit_amount: Math.round(item.price * 120 * 100),
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: "NPR",
                product_data: { name: "Delivery Charges" },
                unit_amount: 2 * 120 * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        console.log("Order placed successfully:", newOrder);
        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Verifying order after payment
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        console.log("Received verification request:", req.body);

        if (success === true || success === "true") {
            const updatedOrder = await orderModel.findByIdAndUpdate(
                orderId, 
                { payment: true, Status: "Paid" }, 
                { new: true }
            );

            console.log("Order verified and updated:", updatedOrder);
            res.json({ success: true, message: "Paid", updatedOrder });

        } else {
            await orderModel.findByIdAndDelete(orderId);
            console.log("Order not paid, deleted:", orderId);
            res.json({ success: false, message: "Not Paid" });
        }

    } catch (error) {
        console.error("Error verifying order:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Fetching only paid user orders
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId, payment: true });
        res.json({ success: true, data: orders });

    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Listing only paid orders for the admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ payment: true });
        res.json({ success: true, data: orders });

    } catch (error) {
        console.error("Error listing orders:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ API for updating order status
const updateStatus = async (req, res) => {
    try {
        const updatedOrder = await orderModel.findByIdAndUpdate(
            req.body.orderId,
            { Status: req.body.Status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        console.log("Order status updated:", updatedOrder);
        res.json({ success: true, message: "Status Updated", updatedOrder });

    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
