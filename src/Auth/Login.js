import React, { useState } from 'react'
import { Alert, Button } from 'react-bootstrap';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../constant';
import { ChatState } from '../Context/ChatProvider';


function Login() {
  const navigate = useNavigate()
  const {setUser} = ChatState();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('')
  const [showPass,setShowPass]=useState(false);
  const [loading,setLoading]=useState(false);
  const [visibleAlert, setAlertVisible] = useState(false)
  const [message,setMessage]=useState('');
  const[alertbg,setAlertbg]=useState(false);
 
  const handleVisible = () => { 
    setAlertVisible(true)
    setTimeout(() => {
        setAlertVisible(false)
    }, 3000);
} 
  function hidepassword(){
    if(showPass===true) setShowPass(false)
    else setShowPass(true)
  }
const loginHandler=async()=>{
  setLoading(true)
  if(!email||!password){
    setAlertbg(false)
    handleVisible()
    setMessage('Fill all the requirements')
    setLoading(false)
    // return;
  }else{
    try {
      const config = {
        headers:{
          "Content-type":"application/json",
        },
      }
  
      const {data}= await axios.post(`${BASE_URL}api/user/login`,{email,password},config);
      setAlertbg(true)
      handleVisible()
      setMessage('successfully SignIn')
      localStorage.setItem('userInfo',JSON.stringify(data));
      const cus = JSON.parse(localStorage.getItem("userInfo"));
      setUser(cus)
      setLoading(false)
      navigate('/chats')
    } catch (error) {
      setAlertbg(false)
      handleVisible()
      setMessage('Password and email not correct!')
      setLoading(false)
    }
  }

  
  
}
  
  return <div>

<div className='alert'>
      <Alert show={visibleAlert} variant={alertbg?"success":"danger"}>
           {message}
      </Alert>
      </div>
      <div className="mb-3">
        <label className="form-label">User Email</label>
         <input type="email" value={email} className="form-control"onChange={(e)=>setEmail(e.target.value)} placeholder="Enter Your Email"/>
     </div>
       <label className="form-label">Password</label>
       <div className="input-group mb-3">
          <input type={showPass?"text":"password"} value={password} className="form-control"onChange={(e)=>setPassword(e.target.value)} placeholder="Enter Your Password"/>
        </div>
        <div className="form-check d-flex flexDirection-row">
        <input className="form-check-input" type="checkbox" onClick={()=>hidepassword()} id="flexCheckDefault"/>
       &nbsp;<label className="form-check-label" for="flexCheckDefault">
          Show Password
      </label>
     {/* <p style={{cursor:"pointer",paddingLeft:"90px"}} className="text-primary" onClick={()=>{
        setEmail("demo@gmail.com");
        setPassword("123")
      }}>Demo Account</p> */}
   </div>
      <div className='d-grid gap-2 col-6 mx-auto mt-4'>
      <Button
      className='btn'
      disabled={loading}
      onClick={()=>loginHandler()}
    >
      {loading ? 'Loading…' : 'Login'}
    </Button>
      </div>

  </div>
}

export default Login;
