import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

const MenuList = ({ menuItems, open }) => {
  const location = useLocation()

  return (
    <List>
      {menuItems.map((item) => (
        <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            component={Link}
            to={item.link}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
                color:
                  (location.pathname === '/' && item.link === '/') ||
                  (location.pathname.startsWith(item.link) && item.link !== '/')
                    ? 'grey'
                    : 'lightgrey',
                opacity:
                  (location.pathname === '/' && item.link === '/') ||
                  (location.pathname.startsWith(item.link) && item.link !== '/')
                    ? 1
                    : 0.99,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}

export default MenuList
