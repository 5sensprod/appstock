import { useState, useEffect, useCallback } from 'react'
import {
  buildCategoryPath,
  findAllChildCategories,
} from '../../utils/categoryUtils'

const useCategoryData = (
  categories,
  deleteCategoryFromContext,
  showToast,
  showConfirmDialog,
) => {
  const [rowData, setRowData] = useState([])

  useEffect(() => {
    const idToCategoryMap = categories.reduce((acc, category) => {
      acc[category._id] = category
      return acc
    }, {})

    const processedData = categories.map((category) => ({
      ...category,
      path: buildCategoryPath(category, idToCategoryMap),
    }))

    setRowData(processedData)
  }, [categories])

  const promptDeleteWithConfirmation = useCallback(
    (category) => {
      const childCategories = findAllChildCategories(category._id, categories)
      const isParentCategory = childCategories.length > 0
      const categoryNames = isParentCategory
        ? [category.name, ...childCategories.map((cat) => cat.name)].join(', ')
        : category.name

      const confirmMessage = isParentCategory
        ? `Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" et ses sous-catégories? Les catégories suivantes seront supprimées : ${categoryNames}. Cette action est irréversible.`
        : `Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}"? Cette action est irréversible.`

      showConfirmDialog('Confirmer la suppression', confirmMessage, () =>
        handleRecursiveDelete(category._id, categoryNames),
      )
    },
    [categories, showConfirmDialog],
  )

  const handleRecursiveDelete = useCallback(
    async (categoryId, categoryNames) => {
      const childCategories = findAllChildCategories(categoryId, categories)
      for (const cat of childCategories) {
        await deleteCategoryFromContext(cat._id)
      }
      await deleteCategoryFromContext(categoryId)
      showToast(
        `Catégories supprimées avec succès: ${categoryNames}`,
        'success',
      )
    },
    [categories, deleteCategoryFromContext, showToast],
  )

  return { rowData, promptDeleteWithConfirmation, handleRecursiveDelete }
}

export default useCategoryData
