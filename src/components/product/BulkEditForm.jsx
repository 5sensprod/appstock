import React from 'react'
import { useProductContext } from '../../contexts/ProductContext'

const BulkEditForm = ({ onSubmit }) => {
  const { fieldsToEdit, handleFieldSelect } = useProductContext()
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
      {/* Répétez pour les autres champs: categorie et sousCategorie */}
      <button type="submit">Appliquer les Modifications</button>
    </form>
  )
}

export default BulkEditForm
