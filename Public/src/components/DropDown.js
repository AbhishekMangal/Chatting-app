import React from 'react'

const DropDown = ({name, logo, handleFunc}) => {

  return (
    <>

              <div className='.logout flex items-center text-white cursor-pointer hover:bg-[#9a86f3] p-2 rounded-lg' onClick={handleFunc}>
           { logo}
                <span>{name}</span>
                </div>
{/* 
   { items && items.map((item, index)=>
   console.log(item)
        (
        <div key ={index} className='cursor-pointer hover:bg-[#9a86f3] text-white flex items-center'>
            { item.current}
           <span> {item.name} </span>
        </div>
        ))}

     */}

      
 
    </>
  )
}

export default DropDown
