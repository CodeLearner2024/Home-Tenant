import React from 'react'
import "../globals.css";
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'



export default function page() {
  return (
    <div className="container1">
          <div className="header1">
            <Header />
          </div>
      
          <div className="main-content1">
            <Sidebar />
            <div className="home1">
              <h3>House page</h3>
            </div>
          </div>
    </div>
  )
}
