import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import Card from '../components/Card';
import userContext from '../Context/userContext';
import { host } from '../util/ApiRoute';

const Request = () => {
  const context = useContext(userContext);
  const { user, setUser } = context;
  const [request, setRequest] = useState([]);
  
  const toastOption = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark"
  };

  useEffect(() => {
    const getRequest = async () => {
      const storedUser = JSON.parse(localStorage.getItem('chat-app-user'));

      if (storedUser && storedUser._id) {
        try {
          const response = await axios.get(`${host}//api/request/getRequest/${storedUser._id}`);
          if (response.data.success) {
            setRequest(response.data.req);
            console.log(response)
          } else {
            toast.error(response.data.msz, toastOption);
          }
        } catch (error) {
          toast.error("Failed to fetch requests", toastOption);
        }
      }
    };
    getRequest();
  }, []);

  return (
    <div className='container grid sm:grid-cols-2 md:grid-cols-4 min-h-screen bg-blue-300 m-5 p-5 ps-10'>
      {
        request.length > 0 ? 
          request.map((user) => (
            <Card key={user._id} user={user} />  // Pass necessary props to Card component
          ))
        :
          <h1>No request</h1>
      }
    </div>
  );
};

export default Request;
