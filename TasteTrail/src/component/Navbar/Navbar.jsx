import React, { useState, useContext } from 'react';
import './Navbar.css';
import { assets } from '../../../public/assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {

    const [menu, setMenu] = useState("home");

    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token0");
        setToken(""); // Clear token in the context
        navigate("/");
    }

    return (
        <div className='navbar'>
            <Link to='/'> <h1 className='logo'>TasteTrial </h1></Link>
            <ul className="navbar-menu">
                <Link to='/' onClick={() => setMenu("Home")} className={menu === "home" ? "active" : ""}>Home</Link>
                <a href='#menu' onClick={() => setMenu("Menu")} className={menu === "Menu" ? "active" : ""}>Menu</a>
                {/* <a href='#special' onClick={() => setMenu("Special")} className={menu === "Special" ? "active" : ""}>Special</a> */}
                <a href='#footer' onClick={() => setMenu("Contact Us")} className={menu === "Contact Us" ? "active" : ""}>Contact Us</a>
                <Link to='/About' onClick={() => setMenu("About Us")} className={menu === "About Us" ? "active" : ""}>About Us</Link>
            </ul>
            <div className="navbar-icon">
                <div className="navbar-search-icon">
                    <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
                    <div className={getTotalCartAmount() === 0 ? "" : "dot"}> </div>
                </div>
                {!token ?
                    <button onClick={() => setShowLogin(true)}>sign in</button>
                    :
                    <div className='navbar-profile'>
                        <img src={assets.profile_icon} alt="" />
                        <ul className="nav-profile-dropdown">
                            <li onClick={()=>navigate('/morder')}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
                            <hr />
                            <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
                        </ul>
                    </div>}
            </div>
        </div>
    )
}

export default Navbar;
