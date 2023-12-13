import { useState } from 'react'

const useCategorySelection = (setValue) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('')

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value
    setSelectedCategoryId(categoryId)
    setValue('categorie', categoryId)
    setSelectedSubCategoryId('')
    setValue('sousCategorie', '')
  }

  const handleSubCategoryChange = (event) => {
    const subCategoryId = event.target.value
    setSelectedSubCategoryId(subCategoryId)
    setValue('sousCategorie', subCategoryId)
  }

  return {
    selectedCategoryId,
    selectedSubCategoryId,
    setSelectedCategoryId,
    setSelectedSubCategoryId,
    handleCategoryChange,
    handleSubCategoryChange,
  }
}

export default useCategorySelection
