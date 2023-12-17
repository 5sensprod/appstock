import React, { useEffect, useState } from 'react'
import { useProductContext } from '../../contexts/ProductContext'
const buildBreadcrumb = (categoryId, categories) => {
  let breadcrumb = []
  let currentCategory = categories.find((c) => c._id === categoryId)

  while (currentCategory) {
    breadcrumb.unshift(currentCategory)
    currentCategory = categories.find((c) => c._id === currentCategory.parentId)
  }

  return breadcrumb.map((cat) => cat.name).join(' > ')
}
const CategoryWithChildren = ({ categoryId }) => {
  const { categories } = useProductContext()
  const [breadcrumb, setBreadcrumb] = useState('')

  useEffect(() => {
    if (categoryId) {
      const breadcrumbString = buildBreadcrumb(categoryId, categories)
      console.log('Breadcrumb:', breadcrumbString) // Ajouter pour le débogage
      setBreadcrumb(breadcrumbString)
    }
  }, [categoryId, categories])

  return <div>{breadcrumb && <p>Fil d'Ariane : {breadcrumb}</p>}</div>
}

export default CategoryWithChildren
