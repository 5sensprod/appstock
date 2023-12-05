// src/contexts/CompanyInfoContext.js
import React, { createContext, useState, useEffect } from 'react'
import { getCompanyInfo } from '../api/userService'

export const CompanyInfoContext = createContext()

export const CompanyInfoProvider = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState(null)

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      // Logique pour récupérer les informations de l'entreprise
      try {
        const info = await getCompanyInfo()
        setCompanyInfo(info)
      } catch (error) {
        console.error('Failed to fetch company info:', error)
      }
    }

    fetchCompanyInfo()
  }, [])

  return (
    <CompanyInfoContext.Provider value={companyInfo}>
      {children}
    </CompanyInfoContext.Provider>
  )
}
