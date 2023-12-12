import React from 'react'
import EditProduct from '../product/EditProduct'
import { useParams } from 'react-router-dom'

const EditProductPage = () => {
  const { id: productId } = useParams()

  return (
    <div>
      <h1>Modifier le Produit</h1>
      <EditProduct productId={productId} />
    </div>
  )
}

export default EditProductPage
