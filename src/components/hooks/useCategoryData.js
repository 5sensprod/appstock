import { useState, useEffect, useCallback } from 'react'
import { buildCategoryPath } from '../../utils/categoryUtils'

const useCategoryData = (
  categories,
  deleteCategoryAndUpdateProducts,
  showToast,
  showConfirmDialog,
  productCountByCategory,
) => {
  const [rowData, setRowData] = useState([])

  useEffect(() => {
    // Créer une map pour construire facilement les chemins de catégorie
    const idToCategoryMap = categories.reduce((acc, category) => {
      acc[category._id] = category
      return acc
    }, {})

    const processedData = categories.map((category) => {
      const productCountData = productCountByCategory[category._id] || {}
      const productCount = productCountData.count || 0
      const childCount = productCountData.childCount || 0 // Utilisez childCount ici

      return {
        ...category,
        path: buildCategoryPath(category, idToCategoryMap),
        numberOfChildren: childCount, // Remplacez par childCount
        productCount: productCount, // Gardez cela si vous voulez afficher le comptage des produits
      }
    })

    setRowData(processedData)
  }, [categories, productCountByCategory])
  const promptDeleteWithConfirmation = useCallback(
    (category) => {
      const confirmMessage = `Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}"? Cette action est irréversible.`

      showConfirmDialog('Confirmer la suppression', confirmMessage, () =>
        handleDelete(category._id, category.name),
      )
    },
    [showConfirmDialog],
  )

  const handleDelete = async (categoryId, categoryName) => {
    try {
      await deleteCategoryAndUpdateProducts(categoryId)
      showToast(`Catégorie supprimée avec succès: ${categoryName}`, 'success')
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie', error)
      showToast(
        `Erreur lors de la suppression de la catégorie: ${categoryName}`,
        'error',
      )
    }
  }
  return { rowData, promptDeleteWithConfirmation, handleDelete }
}

export default useCategoryData
