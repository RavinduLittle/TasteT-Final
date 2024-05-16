import React, { useContext, useState } from 'react'
import './Morder.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useEffect } from 'react';
import { assets } from '../../../public/assets/assets';


const Morder = () => {

    const {url,token} = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');

    const fetchOrders = async () => {
        const response = await axios.post(url+"/api/order/userorders", {}, { headers: { token } });
        setData(response.data.data);
        setFilteredData(response.data.data);
        console.log(response.data.data);
    }

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    const filterOrdersByDate = (date) => {
        const filtered = data.filter(order => {
            const orderDate = new Date(order.date).toISOString().split('T')[0];
            return orderDate === date;
        });
        setFilteredData(filtered);
    }

    const handleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        filterOrdersByDate(date);
    }

    return (
      <div className='my-orders'>
        <h2>My Orders</h2> <br></br>
        <div className="filter">
          <label htmlFor="order-date">Filter by Date:</label>
          <input
            type="date"
            id="order-date"
            value={selectedDate}
            onChange={handleDateChange}
          /> 
        </div> <br />
        <div className="container">
          {filteredData.map((order, index) => {
            return (
              <div key={index} className="my-orders-order">
                <img src={assets.parcel_icon} alt="parcel icon" />
                <p>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + " x " + item.quantity;
                    } else {
                      return item.name + " x " + item.quantity + " , ";
                    }
                  })}
                </p>
                <p>${order.amount}.00</p>
                <p>Items: {order.items.length}</p>
                <p><span>&#x25cf;</span> <b>{order.status}</b></p>
                <button onClick={fetchOrders}>Track Order</button>
              </div>
            );
          })}
        </div>
      </div>
    );
}

export default Morder;
