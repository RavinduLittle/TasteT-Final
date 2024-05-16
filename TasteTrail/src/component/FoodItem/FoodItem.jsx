import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../../public/assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart,url } = useContext(StoreContext);

  return (
    <div className='food_item'>
      <div className="food-item-img-container">
        <img className='food-item-image' src={url+"/image/"+image} alt="" />
        {!cartItems[id] ? (
          <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt="Add to cart" />
        ) : (
          <div className='food-item-counter'>
            <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="Remove from cart" />
            <p>{cartItems[id]}</p>
            <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="Add more to cart" />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className='food-item-name'>
          <p>{name}</p>
          {/* <img src={assets.rating_starts} alt="" /> */}
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
}

export default FoodItem;
