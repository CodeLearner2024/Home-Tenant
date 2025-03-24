import React, { useState } from 'react';
import "../app/globals.css";
import { AppBar, Box, Button, Toolbar, Typography, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function Header() {
  const [languageAnchor, setLanguageAnchor] = useState(null);
  const [userAnchor, setUserAnchor] = useState(null);

  const handleLanguageClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setLanguageAnchor(event.currentTarget);
  };
  
  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setUserAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setLanguageAnchor(null);
    setUserAnchor(null);
  };

  return (
    <div className='header'>
      <AppBar position="sticky" sx={{ backgroundColor: 'cadetblue' }}>
        <Toolbar>
          {/* Logo à gauche */}
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }} className="logo">
            Logo
          </Typography>

          {/* Bouton de toggle du Sidebar */}
          <Button className="sidebarButton" color="inherit">
            Toggle Sidebar
          </Button>

          {/* Langue Dropdown */}
          <Box>
            <Button
              className="menuItem"
              color="inherit"
              onClick={handleLanguageClick}
              endIcon={<ArrowDropDownIcon />}
            >
              EN
            </Button>
            <Menu
              anchorEl={languageAnchor}
              open={Boolean(languageAnchor)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>EN</MenuItem>
              <MenuItem onClick={handleClose}>FR</MenuItem>
            </Menu>
          </Box>

          {/* User Popup */}
          <Box>
            <Button
              className="menuItem"
              color="inherit"
              onClick={handleUserClick}
              endIcon={<ArrowDropDownIcon />}
            >
              User
            </Button>
            <Menu
              anchorEl={userAnchor}
              open={Boolean(userAnchor)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>Settings</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
