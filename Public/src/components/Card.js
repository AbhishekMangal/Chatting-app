import React from 'react'
import  img from  '../Images/null images.jpg'
const Card = ({user}) => {
console.log(user);
  return (
    <div className='max-h-84 p-6 '>
       <img src={user.img? `data:image/jpg+svg+xml;base64,${user.img}`: img} alt="" className='object-cover rounded-lg max-h-60 mx-auto' />
        <div className='name text-center pt-1'>{user && user.name? user.name: "undefined"}</div>
       <div className='grid gird-cols-1 md:grid-cols-2 w-full '>
      <button className='Accept bg-gray-100  m-1 rounded-full'>Aceept</button>
      <button className='Decline bg-gray-50  m-1 rounded-full'>Decline</button>
      </div>
    </div>
  )
}

export default Card
