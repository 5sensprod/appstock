import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

const MenuList = ({ menuItems, open }) => {
  const [openSubMenu, setOpenSubMenu] = useState({})
  const location = useLocation()

  const handleSubMenuClick = (itemText) => {
    setOpenSubMenu({ ...openSubMenu, [itemText]: !openSubMenu[itemText] })
  }

  return (
    <List>
      {menuItems.map((item) => (
        <React.Fragment key={item.text}>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              component={Link}
              to={item.link}
              onClick={() => item.subMenu && handleSubMenuClick(item.text)}
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
                    (location.pathname.startsWith(item.link) &&
                      item.link !== '/')
                      ? 'grey'
                      : 'lightgrey',
                  opacity:
                    (location.pathname === '/' && item.link === '/') ||
                    (location.pathname.startsWith(item.link) &&
                      item.link !== '/')
                      ? 1
                      : 0.99,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{ opacity: open ? 1 : 0 }}
              />
              {item.subMenu ? (
                openSubMenu[item.text] ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )
              ) : null}
            </ListItemButton>
          </ListItem>
          {item.subMenu && (
            <Collapse in={openSubMenu[item.text]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.subMenu.map((subItem) => (
                  <ListItemButton
                    key={subItem.text}
                    component={Link}
                    to={subItem.link}
                    sx={{ pl: 4 }}
                  >
                    <ListItemIcon>{subItem.icon}</ListItemIcon>
                    <ListItemText primary={subItem.text} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      ))}
    </List>
  )
}

export default MenuList
