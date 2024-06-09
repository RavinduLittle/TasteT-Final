import React, { useContext, useState, useEffect } from "react";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import OrderSummary from "../../component/OrderSummary/OrderSummary";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (orderId) {
          console.log(`Fetching order details for orderId: ${orderId}`);
          const response = await axios.get(
            `${url}/api/order/details/${orderId}`
          );
          setOrderDetails(response.data);
        } else {
          console.error("Order ID is not provided in the URL parameters");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId, url]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (orderDetails?.userId) {
          console.log(
            `Fetching user details for userId: ${orderDetails.userId}`
          );
          const response = await axios.get(
            `${url}/api/user/details/${orderDetails.userId}`
          );
          setUserDetails(response.data);
        } else {
          console.error("User ID is not available in the order details");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (orderDetails) {
      fetchUserDetails();
    }
  }, [orderDetails, url]);

  if (!orderDetails || !userDetails) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="Verify">
      <OrderSummary
        orderId={orderId}
        amount={orderDetails.amount}
        items={orderDetails.items}
        userDetails={userDetails}
      />
    </div>
  );
};

export default Verify;
