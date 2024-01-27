import React from 'react'
import EditProductSimple from '../PRODUCTS/EditProductSimple'
import { useParams } from 'react-router-dom'

const EditProductPage = () => {
  const { id: productId } = useParams()

  return (
    <div>
      <h1>Modifier le Produit</h1>
      <EditProductSimple productId={productId} />
    </div>
  )
}

export default EditProductPage
