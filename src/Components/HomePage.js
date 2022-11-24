import React,{useEffect,useState} from 'react';
import Login from '../Auth/Login';
import Signup from '../Auth/Signup';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';


function HomePage() {
  let navigate = useNavigate()
  const [toggle,setToggle]=useState(false);
  useEffect(()=>{
    console.log(toggle);
  },[toggle])
 
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userInfo"))
    if(user) navigate('/chats')
  },[navigate])
 
 
  return (
    <div className='main'>
       <div className='title'>
         ZoText
        </div>
     <div className='auth-page col-6'>
       
        <div className='auth-btn'>
            <button className={!toggle?"btn btn-primary":"btn"} onClick={()=>setToggle(false)}>Login</button>
            <button className={toggle?"btn btn-primary":"btn"} onClick={()=>setToggle(true)}>Signup</button>
        </div>
        <div className='auth-main'>
        {toggle?<Signup/>:<Login/>}
        
        </div>
     </div>
    </div>
  )
}

export default HomePage
