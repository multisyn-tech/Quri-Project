import React from 'react'
import { Spinner } from 'reactstrap'
const Loader = (props) => {
  return (
    <div >
        {/* <img src={myGif} style={{width:'10%', height:'10%', display:'block', marginLeft:'auto', marginRight:'auto', marginTop:'15%'}} alt="loader" /> */}
        <Spinner className={`mr-25 ${props.className}`} style={props.style} size={props.size? props.size:"sm"} />
    </div>
  )
}

export default Loader