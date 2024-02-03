import { useMemo } from 'react'

const matchesSearchTerm = (value, searchTerm) => {
  return (
    value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
  )
}

const isSubCategoryOfSelected = (
  productCategoryId,
  selectedCategoryId,
  categories,
) => {
  if (!categories) {
    console.error('Categories is undefined in isSubCategoryOfSelected')
    return false
  }

  let currentCategory = categories.find((cat) => cat._id === productCategoryId)
  while (currentCategory) {
    if (currentCategory._id === selectedCategoryId) {
      return true
    }
    currentCategory = categories.find(
      (cat) => cat._id === currentCategory.parentId,
    )
  }
  return false
}

const matchesCategory = (product, selectedCategoryId, categories) => {
  return (
    !selectedCategoryId ||
    product.categorie === selectedCategoryId ||
    isSubCategoryOfSelected(product.categorie, selectedCategoryId, categories)
  )
}

const matchesSKU = (product, searchTerm) => {
  if (Array.isArray(product.SKU)) {
    return product.SKU.some(
      (skuItem) =>
        matchesSearchTerm(skuItem.diapason, searchTerm) ||
        matchesSearchTerm(skuItem.gencode, searchTerm),
    )
  }
  return matchesSearchTerm(product.SKU, searchTerm)
}

const useSearch = (products, searchTerm, selectedCategoryId, categories) => {
  // Supprimez useMemo et retournez directement le résultat du filtrage
  return products.filter(
    (product) =>
      matchesCategory(product, selectedCategoryId, categories) &&
      (matchesSearchTerm(product.reference, searchTerm) ||
        matchesSearchTerm(product.marque, searchTerm) ||
        matchesSearchTerm(product.gencode, searchTerm) ||
        matchesSearchTerm(product.descriptionCourte, searchTerm) ||
        matchesSearchTerm(product.description, searchTerm) ||
        matchesSKU(product, searchTerm)),
  )
}

export default useSearch
