import React, { useState, useEffect } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditProductSimple from '../PRODUCTS/EditProductSimple'
import ShowProductSimple from '../PRODUCTS/ShowProductSimple'
import { useParams } from 'react-router-dom'
import { useProductContext } from '../../contexts/ProductContext'

const EditProductPage = () => {
  const { id: productId } = useParams()
  const { products } = useProductContext()
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
          <IconButton onClick={toggleEditMode} style={{ cursor: 'pointer' }}>
            <VisibilityIcon />
          </IconButton>
        ) : (
          <IconButton onClick={toggleEditMode} style={{ cursor: 'pointer' }}>
            <EditIcon />
          </IconButton>
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
