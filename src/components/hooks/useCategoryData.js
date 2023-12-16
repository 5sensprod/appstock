import { useState, useEffect, useCallback } from 'react'
import {
  buildCategoryPath,
  findAllChildCategories,
} from '../../utils/categoryUtils'

const useCategoryData = (
  categories,
  deleteCategoryAndUpdateProducts,
  showToast,
  showConfirmDialog,
) => {
  const [rowData, setRowData] = useState([])

  useEffect(() => {
    const idToCategoryMap = categories.reduce((acc, category) => {
      acc[category._id] = category
      return acc
    }, {})

    const processedData = categories.map((category) => {
      const childCategories = findAllChildCategories(category._id, categories)
      return {
        ...category,
        path: buildCategoryPath(category, idToCategoryMap),
        numberOfChildren: childCategories.length,
      }
    })

    setRowData(processedData)
  }, [categories])

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
