import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import StorefrontIcon from '@mui/icons-material/Storefront'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import PeopleIcon from '@mui/icons-material/People'
import ReceiptIcon from '@mui/icons-material/Receipt'
import SellIcon from '@mui/icons-material/Sell'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import DrawerHeader from './DrawerHeader'
import CatalogCreateButton from './CatalogCreateButton'
import BackButton from './BackButton'
import SideDrawer from './SideDrawer'
import TopAppBar from './TopAppBar'
import { useUI } from '../../contexts/UIContext'

export default function MiniDrawer({ children }) {
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const { updatePageTitle, pageTitle } = useUI()
  const location = useLocation()

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const menuItems = [
    { text: 'Tableau de bord', icon: <DashboardIcon />, link: '/dashboard' },
    { text: 'Caisse', icon: <PointOfSaleIcon />, link: '/' },
    { text: 'Catalogue', icon: <StorefrontIcon />, link: '/products' },
    { text: 'Catégorie', icon: <BookmarkIcon />, link: '/category' },
  ]

  const clientMenuItems = [
    { text: 'Client', icon: <PeopleIcon />, link: '/client' },
    { text: 'Facture', icon: <ReceiptIcon />, link: '/invoice' },
  ]

  const supplierMenuItems = [
    { text: 'Commande', icon: <SellIcon />, link: '/order' },
    { text: 'Fournisseur', icon: <LocalShippingIcon />, link: '/supplier' },
  ]

  React.useEffect(() => {
    const currentItem = menuItems
      .concat(clientMenuItems, supplierMenuItems)
      .find((item) => item.link === location.pathname)
    if (currentItem) {
      updatePageTitle(currentItem.text) // Mettez à jour le titre en utilisant le contexte
    }
  }, [location.pathname, updatePageTitle])

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopAppBar
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        pageTitle={pageTitle}
      />
      <SideDrawer
        open={open}
        handleDrawerClose={handleDrawerClose}
        menuItems={menuItems}
        clientMenuItems={clientMenuItems}
        supplierMenuItems={supplierMenuItems}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <CatalogCreateButton theme={theme} />
        <BackButton theme={theme} />
        {children}
      </Box>
    </Box>
  )
}
