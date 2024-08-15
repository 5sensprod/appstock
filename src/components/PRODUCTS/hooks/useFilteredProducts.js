import { useProductContextSimplified } from '../../../contexts/ProductContextSimplified'
import { useCategoryContext } from '../../../contexts/CategoryContext'
import { useSuppliers } from '../../../contexts/SupplierContext'

const useFilteredProducts = (selectedCategoryId, searchTerm = '') => {
  const { products } = useProductContextSimplified()
  const { categories } = useCategoryContext()
  const { suppliers } = useSuppliers()

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

  // Associe chaque produit avec son fournisseur
  const enrichedProducts = products.map((product) => {
    const supplier = suppliers.find((s) => s._id === product.supplierId)
    return {
      ...product,
      supplierName: supplier ? supplier.name : 'Inconnu',
    }
  })

  const filteredProducts = enrichedProducts.filter((product) => {
    const matchesCategory =
      !selectedCategoryId ||
      findAllSubCategoryIds(selectedCategoryId).includes(product.categorie)

    const matchesSearchTerm =
      searchTerm.trim() === '' ||
      (product.reference &&
        product.reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.marque &&
        product.marque.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.supplierName &&
        product.supplierName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) || // Ajout du filtre par fournisseur
      (product.gencode &&
        product.gencode.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesCategory && matchesSearchTerm
  })

  return filteredProducts
}

export default useFilteredProducts
