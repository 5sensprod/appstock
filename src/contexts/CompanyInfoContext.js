// src/contexts/CompanyInfoContext.js

import React, { createContext, useState, useEffect } from 'react'
import { getCompanyInfo } from '../api/userService'

export const CompanyInfoContext = createContext()

export const CompanyInfoProvider = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState(null)

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const info = await getCompanyInfo()
        setCompanyInfo(info[0])
      } catch (error) {
        console.error('Failed to fetch company info:', error)
      }
    }

    fetchCompanyInfo()
  }, [])

  // Ajoutez cette fonction pour permettre la mise à jour du contexte
  const updateCompanyInfo = (updatedInfo) => {
    setCompanyInfo(updatedInfo)
  }

  return (
    <CompanyInfoContext.Provider value={{ companyInfo, updateCompanyInfo }}>
      {children}
    </CompanyInfoContext.Provider>
  )
}
