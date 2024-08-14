import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import Logo from '../Assets/logo.svg'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { loginRoute } from '../util/ApiRoute';
import userContext from '../Context/userContext';
import { setUser } from '../Features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const Login = () => {
    const context = useContext(userContext);
  
const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector(state=>state.user)
    const [values,setValues] = useState({email: "", password: ""})
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
        if(handleValidation())
        {
           
            const { email, password } = values;
            const data = await axios.post(loginRoute, 
                { email, password}
                );
               
                if(data.data.success)
                {
                    toast.success("Registerd SuccessFully", toastOption)
                    localStorage.setItem('authToken', data.data.authToken)
                    dispatch(setUser(data.data.User))
                    navigate('/')
               }
               else 
               {
                toast.error(data.data.msz, toastOption)
               }
        }
    }
  
    const handleValidation = ()=>
    {
        const {email, password } = values;
         if(email === "")
        {
            toast.error("email should not be blank", toastOption);
            return false;
        }
        else if(password.length===0)
        {
            toast.error("Password should not be blank", toastOption)
            return false;

        }
        return true;
    }
    const handleChange = (e)=>
    {
        setValues({...values , [e.target.name]: e.target.value});
    }
    // useEffect(()=>
    // {
    //     if(localStorage.getItem('authToken'))
    //     {
    //         navigate('/')
    //     }
    // },[user])
      
    
  return (
    <>
    <FormContainer>
      <form onSubmit={handleSubmit}>
      <div className="brand">
        <img src={Logo} alt="" />
        <h1>snappy</h1>
      </div>
       
        <input type="email" name="email" id="email" placeholder='email' value={values.email} onChange={handleChange}/>
        <input type="password" name="password" id="password" placeholder='password' value={values.password} onChange={handleChange}/>
       
        <button type='submit'>Login User</button>
        <span > 
        {/* <Link to="#"  style={{float: 'left'}}> forget Password </Link> 
        <Link to="/login"  style={{float: 'right'}}> Already Registered  </Link>  */}
        Don't Have an Account? <Link to='/register'>Register</Link>
        </span>
      
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
    img{
        height: 5rem;
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
            padding: 1rem 2rem;
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



export default Login;
