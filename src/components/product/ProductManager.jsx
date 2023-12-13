import React, { useEffect, useState } from 'react'
import useSearch from '../hooks/useSearch'
import AddProductForm from './AddProductForm'
import ProductTable from './ProductTable'
import SelectCategory from '../category/SelectCategory'
import NoMatchButton from '../ui/NoMatchButton'
import ProductSearch from './ProductSearch'
import { useProductContext } from '../../contexts/ProductContext'
import { Button } from '@mui/material'

const ProductManager = () => {
  const {
    products,
    searchTerm,
    setSearchTerm,
    selectedCategoryId,
    setSelectedCategoryId,
    categories,
  } = useProductContext()

  const [showAddProductForm, setShowAddProductForm] = useState(false)
  const isGencode = !isNaN(searchTerm) && searchTerm.trim() !== ''

  const filteredProducts = useSearch(products, searchTerm, selectedCategoryId)

  const isSearchingByReferenceOnly =
    searchTerm.trim() !== '' && selectedCategoryId === ''

  const showAddProductButton =
    !showAddProductForm &&
    filteredProducts.length === 0 &&
    isSearchingByReferenceOnly

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setShowAddProductForm(false)
    }
  }, [searchTerm])

  const handleProductSubmit = () => {
    setShowAddProductForm(false)
    setSearchTerm('')
  }

  const handleShowAddForm = () => {
    setShowAddProductForm(true)
  }

  const handleCancel = () => {
    setShowAddProductForm(false)
    setSearchTerm('')
  }

  const renderProductTableOrMessage = () => {
    if (filteredProducts.length > 0) {
      return <ProductTable products={filteredProducts} />
    }

    return (
      <div>
        {showAddProductForm ? (
          <p>Ajouter un nouveau produit</p>
        ) : (
          <p>Aucun produit trouvé.</p>
        )}
        <NoMatchButton
          show={!showAddProductForm && showAddProductButton}
          buttonText="Ajouter"
          onClick={handleShowAddForm}
        />
      </div>
    )
  }

  const renderAddProductForm = () => {
    if (!showAddProductForm) return null

    return (
      <>
        <AddProductForm
          initialGencode={isGencode ? searchTerm : ''}
          initialReference={!isGencode ? searchTerm : ''}
          onProductAdd={handleProductSubmit}
        />
        <Button variant="contained" onClick={handleCancel}>
          Annuler
        </Button>
      </>
    )
  }

  return (
    <div>
      <ProductSearch />
      <SelectCategory
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={(e) => setSelectedCategoryId(e.target.value)}
      />
      {renderProductTableOrMessage()}
      {renderAddProductForm()}
    </div>
  )
}

export default ProductManager
