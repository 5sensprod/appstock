import React, { useState, useEffect } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import { Box, Tabs, Tab, Typography } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditProductSimple from '../PRODUCTS/EditProductSimple'
import ShowProductSimple from '../PRODUCTS/ShowProductSimple'
import Media from '../PRODUCTS/Media'
import { useParams } from 'react-router-dom'
import { useProductContext } from '../../contexts/ProductContext'
import { useConfig } from '../../contexts/ConfigContext'
import { formatPrice } from '../../utils/priceUtils'
import ShadowBox from '../ui/ShadowBox'
import { useSuppliers } from '../../contexts/SupplierContext'

const EditProductPage = () => {
  const { id: productId } = useParams()
  const { products, getCategoryPath } = useProductContext()
  const { baseUrl } = useConfig()
  const [productName, setProductName] = useState('')
  const [productInfo, setProductInfo] = useState({
    description: '',
    descriptionCourte: '',
  })
  const [isEditable, setIsEditable] = useState(false)
  const [selectedTab, setSelectedTab] = useState(0)
  const [categoryPath, setCategoryPath] = useState('')
  const [brandName, setBrandName] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [gencode, setGencode] = useState('')
  const { suppliers } = useSuppliers()
  const [supplierName, setSupplierName] = useState('')

  useEffect(() => {
    const product = products.find((p) => p._id === productId)
    if (product) {
      setProductName(product.reference)
      setProductInfo({
        description: product.description,
        descriptionCourte: product.descriptionCourte,
        photos: product.photos,
      })
      const path = getCategoryPath(product.categorie)
      setCategoryPath(path)
      const supplier = suppliers.find((s) => s._id === product.supplierId)
      setSupplierName(supplier?.name || 'Non spécifié')
      setBrandName(product.marque || 'Non spécifiée')
      setSalePrice(formatPrice(product.prixVente))
      setGencode(product.gencode || 'Gencode non spécifié')
    }
  }, [products, productId, getCategoryPath, suppliers])

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
      <Box maxWidth={'500px'} p={4} mt={2}>
        <ShadowBox>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h4" component="h2">
              {productName || 'Produit'}
            </Typography>
            {/* Affichez le chemin de la catégorie ici, sous le titre du produit */}

            {selectedTab === 0 && (
              <IconButton
                onClick={toggleEditMode}
                style={{ cursor: 'pointer' }}
              >
                {isEditable ? <VisibilityIcon /> : <EditIcon />}
              </IconButton>
            )}
          </Box>
          <Typography variant="subtitle2" component="h2">
            {categoryPath}
          </Typography>
          <Typography variant="subtitle2" component="h2">
            Fournisseur : {supplierName}
          </Typography>
          <Typography variant="subtitle2" component="h2">
            Marque : {brandName}
          </Typography>
          <Typography variant="subtitle2" component="h2">
            Prix public : {salePrice}
          </Typography>
          <Typography variant="subtitle2" component="h2" mb={2}>
            Gencode : {gencode}
          </Typography>
        </ShadowBox>
      </Box>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Présentation" sx={{ minWidth: 160, width: 160 }} />{' '}
        {/* Appliquer un style spécifique à chaque Tab */}
        <Tab label="Médias" sx={{ minWidth: 160, width: 160 }} />
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
          <Box maxWidth={'800px'}>
            <Media
              productId={productId}
              baseUrl={baseUrl}
              onAddPhoto={handleAddPhoto}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default EditProductPage
