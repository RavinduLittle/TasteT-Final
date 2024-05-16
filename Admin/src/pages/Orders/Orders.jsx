import React, { useState, useEffect } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
    }
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(`${url}/api/order/status`, {
      orderId,
      status: event.target.value
    });
    
    if (response.data.success) {
      await fetchAllOrders();
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const filteredOrders = selectedDate 
    ? orders.filter(order => new Date(order.date).toISOString().slice(0, 10) === selectedDate) 
    : orders;

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-filter">
        <label htmlFor="order-date">Filter by date:</label>
        <input type="date" id="order-date" value={selectedDate} onChange={handleDateChange} />
      </div>
      <div className="order-list">
        {filteredOrders.map((order, index) => (
          <div key={index} className="order_item">
            <img src={assets.parcel_icon} alt="Parcel" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, index) => (
                  <span key={index}>
                    {item.name} x {item.quantity}{index !== order.items.length - 1 && ", "}
                  </span>
                ))}
              </p>
              <p className='order-item-name'>{order.address.firstName} {order.address.lastName}</p>
              <p className="order-item-address">
                {order.address.street}, <br />
                {order.address.city}, {order.address.state}<br />
                <span className="order-item-phone">{order.address.phone}</span>
              </p>
              <p>Items : {order.items.length}</p>
              <p>${order.amount}</p>
              <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                <option value="" disabled>Select status</option>
                <option value="Food Processing">Food Processing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>
          </div>
        ))}
      </div>
      <div className="order-count">
        <p>Total orders on {selectedDate}: {filteredOrders.length}</p>
      </div>
    </div>
  );
};

export default Orders;
