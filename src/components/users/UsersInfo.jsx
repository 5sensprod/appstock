import React, { useContext, useState, useEffect } from 'react'
import { CompanyInfoContext } from '../../contexts/CompanyInfoContext'
import { updateUser } from '../../api/userService' // Importez seulement ce qui est nécessaire

const UsersInfo = () => {
  const { companyInfo, updateCompanyInfo } = useContext(CompanyInfoContext)
  const [editMode, setEditMode] = useState(false)
  const [editedInfo, setEditedInfo] = useState({
    _id: '', // Initialiser avec des chaînes vides ou des valeurs par défaut
    name: '',
    address: '',
    city: '',
    phone: '',
    taxId: '',
    email: '',
  })

  useEffect(() => {
    if (companyInfo) {
      setEditedInfo(companyInfo)
    }
  }, [companyInfo])

  const handleEditToggle = () => setEditMode(!editMode)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedInfo((prev) => ({ ...prev, [name]: value }))
  }

  const saveChanges = async (e) => {
    e.preventDefault()
    try {
      // Assurez-vous d'avoir un _id valide pour la mise à jour
      if (!editedInfo._id) {
        console.error('ID utilisateur manquant.')
        return
      }
      await updateUser(editedInfo._id, editedInfo)
      // Pas besoin de mettre à jour `editedInfo` ici si `updateCompanyInfo` du contexte met à jour `companyInfo`
      alert('Informations mises à jour avec succès')
    } catch (error) {
      console.error('Erreur lors de la mise à jour des informations:', error)
      alert('Erreur lors de la mise à jour des informations')
    }
  }

  if (!companyInfo) return <div>Chargement...</div>

  return (
    <div>
      {editMode ? (
        <form onSubmit={saveChanges}>
          <label>
            Nom :
            <input
              name="name"
              value={editedInfo.name}
              onChange={handleInputChange}
            />
          </label>
          {/* Répétez pour les autres champs */}
          <button type="submit">Sauvegarder</button>
          <button type="button" onClick={handleEditToggle}>
            Annuler
          </button>
        </form>
      ) : (
        <div>
          <p>Nom: {companyInfo.name}</p>
          {/* Affichez les autres champs ici */}
          <button onClick={handleEditToggle}>Modifier</button>
        </div>
      )}
    </div>
  )
}

export default UsersInfo
