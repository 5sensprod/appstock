import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  getSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
} from '../api/supplierService'
import { useConfig } from './ConfigContext'

const SupplierContext = createContext()

export const useSuppliers = () => useContext(SupplierContext)

export const SupplierProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const { baseUrl } = useConfig()

  const fetchSuppliers = async () => {
    setLoading(true)
    try {
      const data = await getSuppliers()
      setSuppliers(data)
    } catch (error) {
      console.error('Erreur lors de la récupération des fournisseurs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const eventSource = new EventSource(`${baseUrl}/api/events`)

    const handleEvent = (event) => {
      const data = JSON.parse(event.data)
      switch (data.type) {
        case 'supplier-added':
        case 'supplier-updated':
        case 'supplier-deleted':
          fetchSuppliers()
          break
        // Pas besoin d'une gestion de cas par défaut si aucun autre type d'événement n'est traité
      }
    }

    eventSource.onmessage = handleEvent
    eventSource.onerror = (error) => {
      console.error('SSE error:', error) // Garder pour déboguer les erreurs de connexion SSE
    }

    return () => {
      eventSource.close()
    }
  }, [baseUrl, fetchSuppliers])

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const createSupplier = async (supplierData) => {
    try {
      const newSupplier = await addSupplier(supplierData)
      fetchSuppliers()
      return newSupplier
    } catch (error) {
      console.error("Erreur lors de l'ajout du fournisseur:", error)
      throw error
    }
  }

  const modifySupplier = async (supplierId, supplierData) => {
    try {
      await updateSupplier(supplierId, supplierData)
      fetchSuppliers()
    } catch (error) {
      console.error('Erreur lors de la mise à jour du fournisseur:', error)
      throw error
    }
  }

  const removeSupplier = async (supplierId) => {
    try {
      await deleteSupplier(supplierId)
      fetchSuppliers()
    } catch (error) {
      console.error('Erreur lors de la suppression du fournisseur:', error)
      throw error
    }
  }

  return (
    <SupplierContext.Provider
      value={{
        suppliers,
        loading,
        createSupplier,
        modifySupplier,
        removeSupplier,
      }}
    >
      {children}
    </SupplierContext.Provider>
  )
}
