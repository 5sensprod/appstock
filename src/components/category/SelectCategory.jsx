import React from 'react'

const SelectCategory = ({
  categories,
  selectedCategoryId,
  onCategoryChange,
  parentFilter = null, // ajouter un nouveau prop pour le filtre
}) => {
  // Filtrer les catégories basées sur le parentFilter si spécifié
  const filteredCategories = parentFilter
    ? categories.filter((cat) => cat.parentId === parentFilter)
    : categories.filter((cat) => cat.parentId === null)

  return (
    <select value={selectedCategoryId} onChange={onCategoryChange}>
      <option value="">Toutes les catégories</option>
      {filteredCategories.map((category) => (
        <option key={category._id} value={category._id}>
          {category.name}
        </option>
      ))}
    </select>
  )
}

export default SelectCategory
