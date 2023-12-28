import { useProductContextSimplified } from '../../../contexts/ProductContextSimplified'
import { useCategoryContext } from '../../../contexts/CategoryContext'

const useFilteredProducts = (selectedCategoryId) => {
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
    if (!selectedCategoryId) {
      return true
    } else {
      const subCategoryIds = findAllSubCategoryIds(selectedCategoryId)
      return subCategoryIds.includes(product.categorie)
    }
  })

  return filteredProducts
}

export default useFilteredProducts
