import React from 'react'

const NoMatchButton = ({ show, buttonText, onClick }) => {
  if (!show) {
    return null
  }

  return <button onClick={onClick}>{buttonText}</button>
}

export default NoMatchButton
