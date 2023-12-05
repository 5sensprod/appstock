import { useMemo } from 'react'

const useSearch = (products, searchTerm) => {
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()

      // Vérifier si le SKU est un tableau et utiliser .some() si c'est le cas
      const skuArrayIncludes =
        Array.isArray(product.SKU) &&
        product.SKU.some(
          (skuItem) =>
            skuItem.diapason.toLowerCase().includes(lowerCaseSearchTerm) ||
            (skuItem.gencode &&
              skuItem.gencode.toString().includes(lowerCaseSearchTerm)),
        )

      // Vérifier si le SKU est une chaîne de caractères et l'inclure dans la recherche
      const skuStringIncludes =
        typeof product.SKU === 'string' &&
        product.SKU.includes(lowerCaseSearchTerm)

      // Vérifier si gencode n'est pas null avant de l'appeler toString()
      const gencodeIncludes = product.gencode
        ? product.gencode.toString().includes(lowerCaseSearchTerm)
        : false

      return (
        product.reference.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.marque.toLowerCase().includes(lowerCaseSearchTerm) ||
        gencodeIncludes ||
        skuArrayIncludes ||
        skuStringIncludes
      )
    })
  }, [products, searchTerm])

  return filteredProducts
}

export default useSearch
