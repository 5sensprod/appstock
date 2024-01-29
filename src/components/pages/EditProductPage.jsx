import React, { useState, useEffect } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditProductSimple from '../PRODUCTS/EditProductSimple'
import ShowProductSimple from '../PRODUCTS/ShowProductSimple'
import Media from '../PRODUCTS/Media' // Assurez-vous d'importer le composant Media
import { useParams } from 'react-router-dom'
import { useProductContext } from '../../contexts/ProductContext'
import { useConfig } from '../../contexts/ConfigContext' // Import si vous avez un contexte pour config

const EditProductPage = () => {
  const { id: productId } = useParams()
  const { products } = useProductContext()
  const { baseUrl } = useConfig() // Supposant que vous avez un contexte pour la config
  const [productName, setProductName] = useState('')
  const [productInfo, setProductInfo] = useState({
    description: '',
    descriptionCourte: '',
    photos: [],
  })
  const [isEditable, setIsEditable] = useState(false)
  const [selectedTab, setSelectedTab] = useState(0)

  useEffect(() => {
    const product = products.find((p) => p._id === productId)
    if (product) {
      setProductName(product.reference)
      setProductInfo({
        description: product.description,
        descriptionCourte: product.descriptionCourte,
        photos: product.photos,
      })
    }
  }, [products, productId])

  const toggleEditMode = () => {
    setIsEditable((prev) => !prev)
  }

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
  }

  const handleAddPhoto = (filename) => {
    // Construisez le chemin complet de la nouvelle photo
    const newPhotoPath = `${baseUrl}/catalogue/${filename}`

    // Ajoutez le chemin complet au tableau des photos
    setProductInfo((prevInfo) => ({
      ...prevInfo,
      photos: [...prevInfo.photos, newPhotoPath],
    }))
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box display="flex" alignItems="center" gap={2}>
        <h1>{productName || 'Produit'}</h1>
        {selectedTab === 0 && (
          <IconButton onClick={toggleEditMode} style={{ cursor: 'pointer' }}>
            {isEditable ? <VisibilityIcon /> : <EditIcon />}
          </IconButton>
        )}
      </Box>

      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="Présentation" />
        <Tab label="Médias" />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {selectedTab === 0 &&
          (isEditable ? (
            <EditProductSimple
              productId={productId}
              setInitialProductName={setProductName}
            />
          ) : (
            <ShowProductSimple productInfo={productInfo} />
          ))}

        {selectedTab === 1 && (
          <Media
            productId={productId}
            photos={productInfo.photos}
            baseUrl={baseUrl}
            onAddPhoto={handleAddPhoto} // Passez la fonction ici
          />
        )}
      </Box>
    </Box>
  )
}

export default EditProductPage
