import React from 'react'
import "../globals.css";
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

function Urupangu() {
  return (
    
    <div className="container1">
      <div className="header1">
        <Header />
      </div>
  
      <div className="main-content1">
        <Sidebar />
        <div className="home1">
          <h3>Home page</h3>
        </div>
      </div>
</div>
  )
}

export default Urupangu