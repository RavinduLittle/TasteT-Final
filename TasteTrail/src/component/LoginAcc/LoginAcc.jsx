import React, { useContext, useState } from 'react';
import './LoginAcc.css';
import { assets } from '../../../public/assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
// import { useEffect } from 'react';

const LoginAcc = ({ setShowLogin }) => {

  const {url,setToken} = useContext(StoreContext)
 
  const [SignupState, setSignupState] = useState("Login");
const [data, setData] = useState({
  name: "",
  email: "",
  password: ""
});

const onChangeHandler = (event) => {
  const name = event.target.name;
  const value = event.target.value;
  setData((prevData) => ({ ...prevData, [name]: value }));
};

const onLogin = async (event)=>{
    event.preventDefault()
    let newUrl =url;
    if (SignupState==="Login") {
      newUrl += "/api/user/login";
    } else{
      newUrl += "/api/user/register"
    }

    const response = await axios.post(newUrl,data);

    if (response.data.success) {
      setToken(response.data.token)
      localStorage.setItem("token0",response.data.token);
      setShowLogin(false)
    }
    else{
      alert(response.data.message)
    }
}


    // useEffect(() => {
    //   console.log(data);
    // }, [data])

  return (
    <div className='LoginAcc'>
      <form onSubmit={onLogin}  className="loginAcc-container">
        <div className="loginAcc-title">
          <h2>{SignupState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
        </div>
        <div className="loginAcc-inputs">
        {SignupState==="Login"? <></>:<input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Enter Your Name' required />} 
          <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Enter Your email' required />
          <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='password' required />
        </div>
        <button type='submit' >{SignupState === "Sign Up" ? "Create Account" : "Login"}</button>
        <div className="login-condition">
          <input type="checkbox" required />
          <p>I agree to the terms and privacy policy</p>
        </div>
        {SignupState==="Login"
        ?<p>Do you haven't Account.Create a Account?<span onClick={()=>setSignupState("Sign Up")}>Click hear</span> </p>
        : <p>Already have an account? <span onClick={()=>setSignupState("Login")}>Login hear</span></p>
        }
       
      </form>
    </div>
  );
}

export default LoginAcc;
