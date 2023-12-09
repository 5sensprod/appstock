import React from 'react'
import { useProductContext } from '../../contexts/ProductContext'
import SelectCategory from '../category/SelectCategory'

const BulkEditForm = ({ onSubmit }) => {
  const { fieldsToEdit, handleFieldSelect, categories, cancelBulkEdit } =
    useProductContext()
  const [formValues, setFormValues] = React.useState({})

  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formValues)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          <input
            type="checkbox"
            checked={fieldsToEdit['prixVente'] || false}
            onChange={() => handleFieldSelect('prixVente')}
          />
          Prix de Vente
        </label>
        {fieldsToEdit['prixVente'] && (
          <input
            type="number"
            onChange={(e) => handleInputChange('prixVente', e.target.value)}
          />
        )}
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={fieldsToEdit['prixAchat'] || false}
            onChange={() => handleFieldSelect('prixAchat')}
          />
          Prix d'achat
        </label>
        {fieldsToEdit['prixAchat'] && (
          <input
            type="number"
            onChange={(e) => handleInputChange('prixAchat', e.target.value)}
          />
        )}
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={fieldsToEdit['stock'] || false}
            onChange={() => handleFieldSelect('stock')}
          />
          Stock
        </label>
        {fieldsToEdit['stock'] && (
          <input
            type="number"
            onChange={(e) => handleInputChange('stock', e.target.value)}
          />
        )}
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={fieldsToEdit['categorie'] || false}
            onChange={() => handleFieldSelect('categorie')}
          />
          Catégorie
        </label>
        {fieldsToEdit['categorie'] && (
          <SelectCategory
            categories={categories}
            selectedCategoryId={formValues['categorie'] || ''}
            onCategoryChange={(e) =>
              handleInputChange('categorie', e.target.value)
            }
          />
        )}
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={fieldsToEdit['sousCategorie'] || false}
            onChange={() => handleFieldSelect('sousCategorie')}
          />
          Sous-Catégorie
        </label>
        {fieldsToEdit['sousCategorie'] && (
          <SelectCategory
            categories={categories}
            selectedCategoryId={formValues['sousCategorie'] || ''}
            onCategoryChange={(e) =>
              handleInputChange('sousCategorie', e.target.value)
            }
            parentFilter={formValues['categorie']} // Utiliser la catégorie sélectionnée comme filtre
          />
        )}
      </div>

      <button type="submit">Appliquer les Modifications</button>
      <button type="button" onClick={cancelBulkEdit}>
        Annuler
      </button>
    </form>
  )
}

export default BulkEditForm
