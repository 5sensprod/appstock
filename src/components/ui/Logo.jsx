import React from 'react'
// Assurez-vous que le chemin vers l'image est correct
import logoImage from '../../assets/logo.png'

const Logo = () => {
  return (
    <img
      src={logoImage}
      alt="Logo"
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  )
}

export default Logo
