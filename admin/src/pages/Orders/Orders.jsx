import React, { useState, useEffect } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {
  const [Orders, setOrders] = useState([]);

  // Fetch all orders from API
  const fetchAllOrders = async () => {
    try {
      console.log("Fetching orders...");
      const response = await axios.get(url + "/api/order/list");
      console.log("API Response:", response.data);

      if (response.data.success) {
        setOrders(response.data.data);
        console.log("Orders Updated:", response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error("API Error:", error);
    }
  };

  // Handle order status change
  const statusHandler = async (event, orderId) => {
    try {
      console.log("Updating status for Order ID:", orderId, "New Status:", event.target.value);
  
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        Status: event.target.value,
      });
  
      console.log("Status Update Response:", response.data);
  
      if (response.data.success) {
        toast.success("Order status updated successfully!");
        await fetchAllOrders(); // Refresh orders after update
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating order status");
    }
  };
  

  useEffect(() => {
    fetchAllOrders();
  }, [url]);

  return (
    <div className="order">
      <h3>Order Page</h3>

      {Orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <div className="order-list">
          {Orders.map((order, index) => (
            <div key={index} className="order-item">
              {console.log("Rendering order:", order)}

              <img src={assets.parcel_icon} alt="Parcel Icon" />
              <div>
                <p className="order-item-food">
                  {order.items.map((item, i) => (
                    <span key={i}>
                      {item.name} x {item.quantity}
                      {i !== order.items.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
                <p className="order-item-name">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street},</p>
                  <p>
                    {order.address.city}, {order.address.state},{" "}
                    {order.address.country}, {order.address.zipcode}
                  </p>
                </div>
                <p className="order-item-phone">{order.address.phone}</p>
              </div>
              <p>Items: {order.items.length}</p>
              <p>${order.amount}</p>

              <select
                onChange={(event) => {
                  console.log("Dropdown changed!");
                  statusHandler(event, order._id);
                }}
                value={order.Status}
              >
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
