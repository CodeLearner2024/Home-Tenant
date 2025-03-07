"use client"
import React, { useEffect, useState } from 'react'
import "../globals.css";
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
interface Home {
  id: number;
  code: string;
  name: string;
  adresse: string;
}

function Urupangu() {
  const [homes,setHomes] = useState<Home[]>([]);
  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const response = await fetch("https://tenant-home-production.up.railway.app/homes");
        const data = await response.json();
        setHomes(data);
        console.log("======================>"+data)
      } catch (error) {
        console.error("Erreur lors de la récupération des homes :", error);
      }
    };

    fetchHomes();
  }, []);
  

  
  return (
    
    <div className="container1">
      <div className="header1">
        <Header />
      </div>
  
      <div className="main-content1">
        <Sidebar />
        <div className="home1">
        <TableContainer>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Numero</TableCell>
            <TableCell align="right">code</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Adresse</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {homes.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.code}</TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.adresse}</TableCell>
              <TableCell align="right">
                <Button sx={{fontSize: '16px'}}> <DeleteOutlineOutlinedIcon sx={{
    fontSize: '16px',
    '&:hover': {
      fontSize: '20px',  
      color: 'red',     
    },
  }} /></Button>
                <Button sx={{fontSize: '16px'}}> <ModeEditOutlinedIcon sx={{
    fontSize: '16px',
    '&:hover': {
      fontSize: '20px',  
      color: 'blue',     
    },
  }} /></Button>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </div>
      </div>
</div>
  )
}

export default Urupangu