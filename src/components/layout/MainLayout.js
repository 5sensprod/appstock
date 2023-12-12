import React, { useState } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import StorefrontIcon from '@mui/icons-material/Storefront'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import PeopleIcon from '@mui/icons-material/People'
import ReceiptIcon from '@mui/icons-material/Receipt'
import SellIcon from '@mui/icons-material/Sell'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Link, useLocation } from 'react-router-dom'

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

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

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

export default function MiniDrawer({ children }) {
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const [pageTitle, setPageTitle] = useState('Tableau de bord') // État initial
  const location = useLocation()

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  // Fonction pour afficher le bouton sur la route '/catalog'
  const renderCatalogButton = () => {
    if (location.pathname === '/catalog') {
      return (
        <Button
          component={Link}
          to="/create-product"
          variant="contained"
          color="primary"
          sx={{ margin: theme.spacing(2) }}
        >
          Créer un Produit
        </Button>
      )
    }
    return null
  }

  const renderBackButton = () => {
    const matchCreateOrEdit = location.pathname.match(
      /\/create-product|\/edit-product\/.+/,
    )
    if (matchCreateOrEdit) {
      return (
        <Button
          component={Link}
          to="/catalog"
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          sx={{ margin: theme.spacing(2) }}
        >
          Retour
        </Button>
      )
    }
    return null
  }

  const menuItems = [
    { text: 'Tableau de bord', icon: <DashboardIcon />, link: '/dashboard' },
    { text: 'Caisse', icon: <PointOfSaleIcon />, link: '/' },
    { text: 'Catalogue', icon: <StorefrontIcon />, link: '/catalog' },
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
      setPageTitle(currentItem.text)
    }
  }, [location.pathname])

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {pageTitle}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
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
                    // Modifiez la couleur ici en fonction de la page actuelle
                    color:
                      location.pathname === item.link ? 'grey' : 'lightgrey',
                    opacity: location.pathname === item.link ? 1 : 0.99, // Réduire l'opacité pour les icônes non actives
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />
        <List>
          {clientMenuItems.map((item) => (
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
                    // Modifiez la couleur et l'opacité ici
                    color:
                      location.pathname === item.link ? 'grey' : 'lightgrey',
                    opacity: location.pathname === item.link ? 1 : 0.95,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />
        <List>
          {['Commande', 'Fournisseur'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
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
                    color: 'lightgrey', // Ici, on fixe la couleur des icônes à gris
                  }}
                >
                  {index === 0 ? <SellIcon /> : <LocalShippingIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {renderCatalogButton()}
        {renderBackButton()}
        {children}
      </Box>
    </Box>
  )
}
