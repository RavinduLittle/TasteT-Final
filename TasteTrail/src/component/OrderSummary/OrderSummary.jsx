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
        <h3>User Details:</h3>
        <p>Name: {userDetails.name}</p>
        <p>Email: {userDetails.email}</p>
      </div>
      <div className="ordered-items">
        <h3>Ordered Items:</h3>
        <table className="item-table">
          <thead>
            <tr>
              {/* <th>Item</th> */}
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                
                {/* <td><img src={item.image}  className="item-image" /></td> */}
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>${item.price}</td>
                <td>${item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="total-amount">
        <p>Total Amount: ${totalAmount}</p>
      </div>
    </div>
  );
};

export default OrderSummary;
