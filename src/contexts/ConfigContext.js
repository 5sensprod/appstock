import React, { createContext, useContext, useState, useEffect } from 'react'
import { getApiBaseUrl } from '../api/axiosConfig'

const ConfigContext = createContext()

export const ConfigProvider = ({ children }) => {
  const [baseUrl, setBaseUrl] = useState('')

  useEffect(() => {
    getApiBaseUrl().then((url) => {
      setBaseUrl(url.replace('/api', ''))
    })
  }, [])

  return (
    <ConfigContext.Provider value={{ baseUrl }}>
      {children}
    </ConfigContext.Provider>
  )
}

export const useConfig = () => {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error("useConfig doit être utilisé au sein d'un ConfigProvider")
  }
  return context
}
