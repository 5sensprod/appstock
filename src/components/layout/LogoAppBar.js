import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { Box, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import logoImage from '../../assets/logo.png' // Assurez-vous que le chemin est correct

const LogoAppBar = ({ toggleDrawer }) => {
  return (
    <AppBar position="static">
      <Toolbar sx={{ alignItems: 'center' }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer}
        >
          <MenuIcon />
        </IconButton>
        <Box
          component="img"
          sx={{
            height: 48,
            marginLeft: 'auto',
          }}
          alt="Logo"
          src={logoImage}
        />
      </Toolbar>
    </AppBar>
  )
}

export default LogoAppBar
