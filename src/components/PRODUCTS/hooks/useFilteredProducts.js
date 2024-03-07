import { useProductContextSimplified } from '../../../contexts/ProductContextSimplified'
import { useCategoryContext } from '../../../contexts/CategoryContext'

const useFilteredProducts = (selectedCategoryId, searchTerm = '') => {
  const { products } = useProductContextSimplified()
  const { categories } = useCategoryContext()

  const findAllSubCategoryIds = (categoryId) => {
    const subCategoryIds = [categoryId]

    const findSubIds = (id) => {
      categories.forEach((cat) => {
        if (cat.parentId === id) {
          subCategoryIds.push(cat._id)
          findSubIds(cat._id)
        }
      })
    }

    findSubIds(categoryId)
    return subCategoryIds
  }

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !selectedCategoryId ||
      findAllSubCategoryIds(selectedCategoryId).includes(product.categorie)

    // Vérifie si searchTerm correspond à l'un des champs
    const matchesSearchTerm =
      searchTerm.trim() === '' ||
      (product.reference &&
        product.reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.marque &&
        product.marque.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.gencode &&
        product.gencode.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesCategory && matchesSearchTerm
  })

  return filteredProducts
}

export default useFilteredProducts
