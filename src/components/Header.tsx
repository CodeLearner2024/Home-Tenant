import React from 'react'
import "../app/globals.css";
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';


function Header() {
  return (
    <div className='header'>
        <AppBar position="sticky" sx={{ backgroundColor: 'cadetblue' }}>
      <Toolbar>
        {/* Logo à gauche */}
        <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }} className="logo">
          Logo
        </Typography>

        {/* Bouton de toggle du Sidebar */}
        <Button
          className="sidebarButton"
          color="inherit"
          // onClick={toggleSidebar}
        >
          Toggle Sidebar
        </Button>

        {/* Langue (EN) et utilisateur à droite */}
        <Box display="flex" alignItems="center">
          <Button className="menuItem" color="inherit">
            EN
          </Button>
          <Button className="menuItem" color="inherit">
            User
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
    </div>
  )
}

export default Header
