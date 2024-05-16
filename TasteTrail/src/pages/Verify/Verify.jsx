import React, { useContext, useState } from 'react';
import './Verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useEffect } from 'react';
import OrderSummary from '../../component/OrderSummary/OrderSummary';

const Verify = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);


  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${url}/api/order/details/${orderId}`);
      setOrderDetails(response.data); // Assuming the backend API returns order details
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${url}/api/user/details/${orderDetails.userId}`);
      setUserDetails(response.data); // Assuming the backend API returns user details
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  


  useEffect(() => {
    fetchOrderDetails();
  }, []);

  useEffect(() => {
    if (orderDetails) {
      fetchUserDetails();
    }
  }, [orderDetails]);


  console.log(orderDetails);

  return (
    <div className="Verify">
      {orderDetails && userDetails ? (
        <OrderSummary orderId={orderId} amount={orderDetails.amount} items={orderDetails.items}  userDetails={userDetails}  />
      ) : (
        <div className="spinner"></div>
      )}
    </div>
  );
};

export default Verify;
