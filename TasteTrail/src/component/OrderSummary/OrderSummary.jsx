import React from 'react';
import './OrderSummary.css';

const OrderSummary = ({ orderId, userDetails, items }) => {
  const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="order-summary">
      <div className="heade">
        <h2>Order Summary</h2>
        <p>Order ID: {orderId}</p>
      </div>
      <div className="user-details">
        <h3>User Details</h3>
        <div className="details-grid">
          <div className="details-item">
            <strong>Name:</strong> {userDetails.name}
          </div>
          <div className="details-item">
            <strong>Email:</strong> {userDetails.email}
          </div>
        </div>
      </div>
      <div className="ordered-items">
        <h3>Ordered Items</h3>
        <div className="items-grid">
          {items.map((item, index) => (
            <div className="item-card" key={index}>
              <div className="item-info">
                <h4>{item.name}</h4>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Price:</strong> ${item.price}</p>
                <p><strong>Total:</strong> ${item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="total-amount">
        <h3>Total Amount: ${totalAmount}</h3>
      </div>
    </div>
  );
};

export default OrderSummary;
