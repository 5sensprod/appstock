// src/components/users/EditUser.jsx
import React from 'react'

const EditUser = ({ userInfo, onChange, onSubmit, onCancel }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Nom:</label>
        <input
          type="text"
          name="name"
          value={userInfo.name || ''}
          onChange={onChange}
        />
      </div>
      <div>
        <label>Adresse:</label>
        <input
          type="text"
          name="address"
          value={userInfo.address || ''}
          onChange={onChange}
        />
      </div>
      <div>
        <label>Ville:</label>
        <input
          type="text"
          name="city"
          value={userInfo.city || ''}
          onChange={onChange}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="text"
          name="email"
          value={userInfo.email || ''}
          onChange={onChange}
        />
      </div>
      <div>
        <label>Téléphone:</label>
        <input
          type="text"
          name="phone"
          value={userInfo.phone || ''}
          onChange={onChange}
        />
      </div>
      <div>
        <label>Numéro d'identification fiscale:</label>
        <input
          type="text"
          name="taxId"
          value={userInfo.taxId || ''}
          onChange={onChange}
        />
      </div>
      <button type="submit">Enregistrer les modifications</button>
      <button type="button" onClick={onCancel}>
        Annuler
      </button>
    </form>
  )
}

export default EditUser
