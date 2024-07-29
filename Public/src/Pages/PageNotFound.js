import React from 'react'
import styled from 'styled-components'

const PageNotFound = () => {
  return (
    <FormContainer>
    <div className='container'>
      Page Not Found
    </div>
    </FormContainer>
  )
}
const FormContainer = styled.div`
    .container{
        min-height: 80vh;
        display: flex;
        justify-content: center;
        align-items: center;
        color: blue;
        font-size: 1.5rem;
    }
`
export default PageNotFound
