import React, {useContext, useState, useEffect } from 'react';
import './PlOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const PlOrder = () => {
    const { getTotalCartAmount,token,food_list,cartItems,url} = useContext(StoreContext);

    const [data,setData] = useState({
        firstName:"",
        lastName:"",
        email:"",
        address:"",
        // street:"",
        city:"",
        // state:"",
        // zipcode:"",
        phone:""

    })

    const onChangeHandler = (event) =>{
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({...data,[name]:value}))
    }

    useEffect(() => {
      console.log(data);
    }, [data])

    const PlOrder = async (event) => {
        event.preventDefault();
        let orderItems = [];
        food_list.map((item) => { 
            if (cartItems[item._id]>0){
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo)
            }
        })
        // console.log(orderItems);
        
        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount()+2,

        }
        let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}}); 
          if (response.data.success) {
            const {session_url} = response.data;
            window.location.replace(session_url);
          }
          else{
            alert("Error");
          }
    }

    const navigate = useNavigate();
    
    useEffect(() => {
        if(!token){
            navigate('/cart')
        }
        else if(getTotalCartAmount()===0)
        {
            navigate('/cart')
        }
    }, [token])

    return (
        <form onSubmit={PlOrder} className='place-order'>
            <div className="place-order-left">
                <p className="tital">Delivery Information</p>
                <div className="multi-fields">
                    <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
                    <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
                </div>
               
                <div className="multi-fields">
                    
                    <input required name='phone' onChange={onChangeHandler} value={data.phone} type="tel" placeholder='Phone' />
                    <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
                </div>
                
                <div className="multi-fields">
                    {/* <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' /> */}
                    {/* <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="number" placeholder='Zip code' /> */}
                </div>
                <input required name='address' onChange={onChangeHandler} value={data.address} type="text" placeholder='Address' />
                <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />

            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Total</h2>
                    <div>
                    <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount()===0?0:2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount()===0?0: getTotalCartAmount()+2}</b>
            </div>
                    </div>
                    <button type='submit'>PAYMENT</button>
                </div>
            </div>
        </form>
    );
};

export default PlOrder;
