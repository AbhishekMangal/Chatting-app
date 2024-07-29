import React from 'react'
import styled from 'styled-components'
import Robot from '../Assets/robot.gif'
const Welcome = ({currUser}) => {
  return (
    <Container>
      <img src={Robot} alt="Robot"  />
      <h1>
      Welcome  <span> {currUser.username} </span>
     </h1>
     <h3>Select a Chat to start Mesaging</h3>
    </Container>
  )
}
const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
color: #2cd6df;
img{
    height: 20rem;
}
span{
    color:#c0f49c;
}
`


export default Welcome
