import React from 'react'

const SelectCategory = ({
  categories,
  selectedCategoryId,
  onCategoryChange,
}) => {
  return (
    <select value={selectedCategoryId} onChange={onCategoryChange}>
      <option value="">Toutes les catégories</option>
      {categories.map((category) => (
        <option key={category._id} value={category._id}>
          {category.name}
        </option>
      ))}
    </select>
  )
}

export default SelectCategory
