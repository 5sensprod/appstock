import React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const DrawerHeaderStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}))

const DrawerHeader = ({ isOpen, handleDrawerClose }) => {
  const theme = useTheme()
  return (
    <DrawerHeaderStyle>
      <IconButton onClick={handleDrawerClose}>
        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </IconButton>
    </DrawerHeaderStyle>
  )
}

export default DrawerHeader
