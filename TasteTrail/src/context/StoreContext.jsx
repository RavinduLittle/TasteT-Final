import { createContext, useEffect, useState } from "react";
// import { food_list } from "../../public/assets/assets";
import axios from 'axios';
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:4000"
    const [token,setToken] =useState("");
    // update for food
    const [food_list,setFoodList] = useState([]);

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        if (token) {
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }
    }

    const removeFromCart = async (itemId) => {
        
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
            if (token) {
                await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
            }
        }

    
    

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    }

    const fetchFoodList =async () => {
        const response = await axios.get(url+"/api/food/list");
        setFoodList(response.data.data)
    }

   const loadCartData = async (token) =>{
    const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
    setCartItems(response.data.cartData);
   }

    useEffect (()=>{
        async function loadData(){
            await fetchFoodList();
            const storedToken = localStorage.getItem("token0");
            if (storedToken) {
                setToken(storedToken);
                await loadCartData (localStorage.getItem("token0"))
            }
        }
        loadData();
    },[]);
    

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
       
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;