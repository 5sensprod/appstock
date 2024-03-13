import React from 'react'
import { Box } from '@mui/material'

const ShadowBox = ({ children, ...props }) => {
  return (
    <Box
      sx={{
        borderRadius: 2, // Valeur de l'arrondi, ajustez selon vos besoins
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Ombre, ajustez selon vos besoins
        p: 2, // Padding interne, ajustez selon vos besoins
        backgroundColor: 'background.paper', // Couleur de fond, ajustez selon vos préférences
        ...props.sx, // Permet d'ajouter ou de surcharger des styles via props
      }}
      {...props} // Permet d'utiliser d'autres props Box si nécessaire
    >
      {children}
    </Box>
  )
}

export default ShadowBox
