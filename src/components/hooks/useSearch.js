import { useMemo } from 'react'

const useSearch = (products, searchTerm, selectedCategoryId) => {
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const lowerCaseSearchTerm = searchTerm.toString().toLowerCase()

      // Assurez-vous que les propriétés sont des chaînes de caractères avant d'appeler toLowerCase()
      const referenceIncludes =
        product.reference &&
        product.reference.toLowerCase().includes(lowerCaseSearchTerm)
      const marqueIncludes =
        product.marque &&
        product.marque.toLowerCase().includes(lowerCaseSearchTerm)

      const gencodeIncludes = product.gencode
        ? product.gencode.toString().includes(lowerCaseSearchTerm)
        : false

      const categoryMatches = selectedCategoryId
        ? product.categorie === selectedCategoryId ||
          product.sousCategorie === selectedCategoryId
        : true
      let skuArrayIncludes = false
      if (Array.isArray(product.SKU)) {
        skuArrayIncludes = product.SKU.some((skuItem) => {
          const diapasonIncludes =
            skuItem.diapason &&
            skuItem.diapason.toLowerCase().includes(lowerCaseSearchTerm)
          const skuGencodeIncludes = skuItem.gencode
            ? skuItem.gencode.toString().includes(lowerCaseSearchTerm)
            : false

          return diapasonIncludes || skuGencodeIncludes
        })
      }

      const skuStringIncludes =
        typeof product.SKU === 'string' &&
        product.SKU.includes(lowerCaseSearchTerm)

      return (
        categoryMatches &&
        (referenceIncludes ||
          marqueIncludes ||
          gencodeIncludes ||
          skuArrayIncludes ||
          skuStringIncludes)
      )
    })
  }, [products, searchTerm, selectedCategoryId])

  return filteredProducts
}

export default useSearch
