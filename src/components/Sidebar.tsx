import React from 'react'
import "../app/globals.css";

function Sidebar() {
  return (
    
    <div className='sidebar'>
      <ul>
        <li><a href='#'>Dashboard</a></li>
        <li><a href="/urupangu">Home</a></li>
        <li><a href='/house'>House</a></li>
        <li><a href='#'>Tenant</a></li>
        
      </ul>
    </div>
  )
}

export default Sidebar
