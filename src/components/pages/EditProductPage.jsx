import React, { useState, useEffect } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditProductSimple from '../PRODUCTS/EditProductSimple'
import ShowProductSimple from '../PRODUCTS/ShowProductSimple' // Import du nouveau composant
import { useParams } from 'react-router-dom'
import { useProductContext } from '../../contexts/ProductContext' // Import si nécessaire

const EditProductPage = () => {
  const { id: productId } = useParams()
  const { products } = useProductContext() // Utiliser le contexte produit si nécessaire
  const [productName, setProductName] = useState('')
  const [productInfo, setProductInfo] = useState({
    description: '',
    descriptionCourte: '',
  })
  const [isEditable, setIsEditable] = useState(false)

  useEffect(() => {
    const product = products.find((p) => p._id === productId)
    if (product) {
      setProductName(product.reference)
      setProductInfo({
        description: product.description,
        descriptionCourte: product.descriptionCourte,
      })
    }
  }, [products, productId])

  const toggleEditMode = () => {
    setIsEditable((prev) => !prev)
  }

  return (
    <div>
      <h1>
        {productName || 'Produit'}
        {isEditable ? (
          <VisibilityIcon
            onClick={toggleEditMode}
            style={{ cursor: 'pointer' }}
          />
        ) : (
          <EditIcon onClick={toggleEditMode} style={{ cursor: 'pointer' }} />
        )}
      </h1>
      {isEditable ? (
        <EditProductSimple
          productId={productId}
          setInitialProductName={setProductName}
        />
      ) : (
        <ShowProductSimple productInfo={productInfo} />
      )}
    </div>
  )
}

export default EditProductPage
