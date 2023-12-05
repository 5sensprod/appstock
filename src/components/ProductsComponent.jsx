import React, { useState, useCallback, useEffect } from 'react'
import useProducts from './hooks/useProducts'
import useSearch from './hooks/useSearch'
import useWebSocket from './hooks/useWebSocket'
import useGlobalScannedDataHandler from './hooks/useGlobalScannedDataHandler'
import {
  fetchApi,
  getApiBaseUrl,
  isRunningInElectron,
} from '../api/axiosConfig'

const ProductsComponent = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const products = useProducts()
  const filteredProducts = useSearch(products, searchTerm)
  const [wsUrl, setWsUrl] = useState('')

  const isAndroidWebView = navigator.userAgent.toLowerCase().includes('wv')
  useGlobalScannedDataHandler(setSearchTerm)

  useEffect(() => {
    if (isRunningInElectron()) {
      getApiBaseUrl().then((baseUrl) => {
        const wsBaseUrl = baseUrl.replace(/^http/, 'ws').replace('/api', '')
        setWsUrl(wsBaseUrl)
      })
    } else {
      fetchApi('getLocalIp')
        .then((data) => {
          const wsUrl = `ws://${data.ip}:5000`
          setWsUrl(wsUrl)
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération de l'IP:", error)
        })
    }
  }, [])

  // Définir les fonctions de rappel pour les événements WebSocket
  const handleWsMessage = useCallback((event) => {
    if (event.data instanceof Blob) {
      // Utiliser FileReader pour lire le contenu du Blob
      const reader = new FileReader()
      reader.onload = () => {
        // Une fois lu, le contenu du Blob se trouve dans reader.result
        setSearchTerm(reader.result)
      }
      reader.onerror = (error) => {
        console.error('Erreur lors de la lecture du Blob:', error)
      }
      reader.readAsText(event.data) // Commencer à lire le contenu du Blob en tant que texte
    } else {
      // Si ce n'est pas un Blob, on suppose que c'est une chaîne
      setSearchTerm(event.data)
    }
  }, [])

  const handleWsOpen = useCallback(() => {
    console.log('Connexion WebSocket établie')
  }, [])

  const handleWsError = useCallback((error) => {
    console.error('Erreur WebSocket:', error)
  }, [])

  const handleWsClose = useCallback(() => {
    console.log('Connexion WebSocket fermée')
  }, [])

  useEffect(() => {
    console.log('searchTerm a changé:', searchTerm)
  }, [searchTerm])

  // Utiliser useWebSocket avec l'URL de votre serveur WebSocket
  useWebSocket(
    wsUrl,
    handleWsMessage,
    handleWsError,
    handleWsOpen,
    handleWsClose,
  )

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleScanClick = () => {
    if (window.Android && isAndroidWebView) {
      window.Android.performScan() // Appeler la méthode de l'app Android
    }
  }

  return (
    <div>
      <h1>Produits</h1>
      {isAndroidWebView && (
        <button onClick={handleScanClick}>Scanner un code-barres</button>
      )}
      <input
        id="search-input"
        placeholder="Rechercher un produit"
        type="search"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <table>
        <thead>
          <tr>
            <th>Référence</th>
            <th>Marque</th>
            <th>Gencode</th>
            <th>Prix de vente</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id} style={{ cursor: 'pointer' }}>
              <td>{product.reference}</td>
              <td>{product.marque}</td>
              <td>{product.gencode}</td>
              <td>{product.prixVente} €</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductsComponent
