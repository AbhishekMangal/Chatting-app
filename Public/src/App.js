import React from 'react'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import { Provider } from 'react-redux';
import Register from './Pages/Register'
import Chat from './Pages/Chat'
import PageNotFound from './Pages/PageNotFound'
import SetAvtar from './Pages/SetAvtar'
import UserState from './Context/userState'
import Contacts from './components/Contacts'
import OtpPage from './Pages/OtpPage'

import Request from './Pages/Request'
import { store } from './App/store'
import Profile from './Pages/Profile';


const App = () => {
 return(
  <>
  <Provider store = {store}>
  <BrowserRouter>
  <UserState>
    <Routes>
      <Route path='/' element={<Chat/>}/>
      <Route path='/register' element={<Register/>}/> 
      <Route path='/login' element={<Login/>}/> 
      <Route path='*' element={<PageNotFound/>}/> 
      <Route path='/otp' element={<OtpPage/>}/> 
      <Route path='/setAvtar' element={<SetAvtar/>}/> 
      <Route path = '/Profile' element ={<Profile/>}/>
      <Route path='/y' element={<Request/>}/>
      {/* <Route path='/contact' element={<Contacts/>}/>  */}

    </Routes>
    </UserState>
  </BrowserRouter>
  </Provider>
  </>
 )
}

export default App
