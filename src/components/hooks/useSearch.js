import { useMemo } from 'react'

const matchesSearchTerm = (value, searchTerm) => {
  return (
    value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
  )
}

const matchesCategory = (product, selectedCategoryId) => {
  return (
    !selectedCategoryId ||
    product.categorie === selectedCategoryId ||
    product.sousCategorie === selectedCategoryId
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

const useSearch = (products, searchTerm, selectedCategoryId) => {
  return useMemo(() => {
    return products.filter(
      (product) =>
        matchesCategory(product, selectedCategoryId) &&
        (matchesSearchTerm(product.reference, searchTerm) ||
          matchesSearchTerm(product.marque, searchTerm) ||
          matchesSearchTerm(product.gencode, searchTerm) ||
          matchesSearchTerm(product.descriptionCourte, searchTerm) ||
          matchesSearchTerm(product.description, searchTerm) ||
          matchesSKU(product, searchTerm)),
    )
  }, [products, searchTerm, selectedCategoryId])
}

export default useSearch
