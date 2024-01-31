import React from 'react'
import ProductDescription from './ProductDescription'
import ProductFicheTechnique from './ProductFicheTechnique'

const ShowProductSimple = ({ productInfo }) => {
  return (
    <>
      <ProductFicheTechnique productInfo={productInfo} />
      <ProductDescription productInfo={productInfo} />
    </>
  )
}

export default ShowProductSimple
