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
      {/* Ajoutez d'autres champs ici */}
      <button type="submit">Enregistrer les modifications</button>
      <button type="button" onClick={onCancel}>
        Annuler
      </button>
    </form>
  )
}

export default EditUser
