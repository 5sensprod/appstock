// IPContext.js
import React, { createContext, useState, useContext } from 'react'

const IPContext = createContext(null)

export const useIP = () => useContext(IPContext)

export const IPProvider = ({ children }) => {
  const [ipAddress, setIpAddress] = useState('')

  return (
    <IPContext.Provider value={{ ipAddress, setIpAddress }}>
      {children}
    </IPContext.Provider>
  )
}
