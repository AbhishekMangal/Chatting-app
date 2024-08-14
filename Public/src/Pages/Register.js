import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import Logo from '../Assets/logo.svg'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { otpSender, registerRoute } from '../util/ApiRoute';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../Features/user/userSlice';
import LoadingBar from 'react-top-loading-bar';

const Register = () => {
    const navigate = useNavigate();
    const [values,setValues] = useState({username:"", email: "", password: "", confirmPassword: "", Otp: ""})
    const [otp ,setOtp] = useState(false);
    const {user} = useSelector(state=>state.user)
    const dispatch = useDispatch();
    const [progress, setProgress] = useState(0);
    const toastOption = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme:"dark"
    }

    const handleSubmit= async(e)=>
    {
        e.preventDefault();
        setProgress(10);
        if(handleValidation())
        {
            
            const {username, email, password, Otp } = values;
            const data = await axios.post(registerRoute, 
                {username, email, password,Otp}
                );
                setProgress(50);
               if(data.data.success)
               {
                toast.success("Registerd SuccessFully", {toastOption})
                localStorage.setItem('authToken', data.data.authToken)
                dispatch(setUser(data.data.User))
                navigate('/setAvtar')
               }
               else 
               {
                   toast.error(data.data.msz, toastOption)
                   await setOtp(false);
                   navigate('/register');
               }
        }
        setProgress(100);
    }
  
    const handleValidation = ()=>
    {
        const {username, email, password, confirmPassword } = values;
        // console.log(password)
        if(password!== confirmPassword)
        {
            console.log("error")
            toast.error("Password and confirm Password must be same", toastOption)
            return false;
        }
        
        else if(username.length<3)
        {
            toast.error("UserName should be greater than 3 char", toastOption);
            return false;
        }
        else if(email === "")
        {
            toast.error("Email should not be blank", toastOption);
            return false;
        }
        else if(password.length<8)
        {
            toast.error("Password should be greater than 8 char", toastOption)
            return false;

        }
        return true;
    }
    const handleChange = (e)=>
    {
        setValues({...values , [e.target.name]: e.target.value});
    }
      
    const handleGenerateOtp = async(e)=>
    {
        setProgress(10);
        e.preventDefault();
        if(handleValidation){
        const {email} = values;
        console.log(email);
        const data = await axios.post(otpSender , 
            {email}
            );
            setProgress(50);
        if(data.data.success)
        {
            toast.success("Otp sent Successfully", {toastOption});
            setOtp(data.data.otp);
            
            // navigate('/otp')
            
        }
        else
        {
            toast.error("otp is uanble to send" , {toastOption})
        }
        }
        setProgress(100);
        
    }
   
  
    
  return (
    <>
    <LoadingBar
        color='#f11946'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
    <FormContainer>
      <form onSubmit={handleSubmit}>
      <div className="brand">
        <img src={Logo} alt="" />
        <h1>snappy</h1>
      </div>
      {
        otp === false?
        (
        <>
        <input type="text" name="username" id="username" placeholder='Username' value={values.username} onChange={handleChange}/>
        <input type="email" name="email" id="email" placeholder='email' value={values.email} onChange={handleChange}/>
        <input type="password" name="password" id="password" placeholder='password' value={values.password} onChange={handleChange}/>
        <input type="password" name="confirmPassword" id="confirmPassword" placeholder='confirm password' value={values.confirmPassword} onChange={handleChange}/>
        <button onClick={handleGenerateOtp}>Generate Otp</button>
        <span > 
        Already Have Account? <Link to='/login'>Login</Link>
        </span>
        </>
        ):
        (
            <>
            <input type="text" name="Otp" id="Otp" placeholder='Otp' value={values.Otp} onChange={handleChange}/>
            <button onSubmit={handleSubmit}>Create User</button>
            </>
        )
}
      
      </form>
     </FormContainer>
     <ToastContainer/>
     </>
  )
}
const FormContainer = styled.div`
height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content: center;
gap: 1rem;
align-items: center;
background-color: #131324;
.brand{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    img{
        height: 2.5rem;
        
    }
    h1{
        color: white;
        text-transform : uppercase;
    }
}
    form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color: #00000076;
        border-radius: 2rem;
        padding: 3rem 5rem;
        input{
            background-color: transparent;
            padding: 1rem 1rem;
            border: 0.1rem solid #4e0eff;
            border-radius: 0.4rem;
            color: white;
            font-size: 1rem;
            width: 100%;
            &:focus{
                border: 0.1rem solid #997af0;
                outline: none;
            }
        }
        button {
            background-color: #997af0;
            color: white;
            padding: 1rem 1rem;
            border: none;
            font-weight: bold;
            cursor: pointer;
            border-radius: 0.4rem;
            font-size: 1rem;
            text-transform: uppercase;
            transition: 0.2s ease-in-out;
            &:hover{
                background-color: #4e0eff;

            }
        }
        span {
            color: white;
            text-transform: uppercase;
            // font-size: 0.64rem;
            
            a{
                color: #4e0eff;
                text-decoration: none;
                font-weight: bold;
            }
            a:hover
            {
                color: #997af0;
                text-decoration: underline;
            }
        }
    }
}
`



export default Register
