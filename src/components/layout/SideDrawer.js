import React from 'react'
import { styled } from '@mui/material/styles'
import MuiDrawer from '@mui/material/Drawer'
import MenuList from './MenuList'
import Divider from '@mui/material/Divider'
import DrawerHeader from './DrawerHeader'

const drawerWidth = 240

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))

const SideDrawer = ({
  open,
  handleDrawerClose,
  menuItems,
  productItems,
  clientMenuItems,
  supplierMenuItems, // Ajout
}) => {
  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader handleDrawerClose={handleDrawerClose} />
      <Divider />
      <MenuList menuItems={menuItems} open={open} />
      <Divider />
      <MenuList menuItems={productItems} open={open} />
      <Divider />
      <MenuList menuItems={clientMenuItems} open={open} />
      <Divider />
      <MenuList menuItems={supplierMenuItems} open={open} /> {/* Ajout */}
    </Drawer>
  )
}

export default SideDrawer
