import React from 'react'
import "../app/globals.css";

function Sidebar() {
  return (
    
    <div className='sidebar'>
      <ul>
        <li><a href='dashboard'>Dashboard</a></li>
        <li><a href="/urupangu">Home</a></li>
        <li><a href='/house'>House</a></li>
        <li><a href='/tenant'>Tenant</a></li>
        <li><a href='#'>Lease Agreement</a></li>
        <li><a href='#'>Rent Payment</a></li>
        
      </ul>
    </div>
  )
}

export default Sidebar
