import React, { useContext, useState, useEffect } from 'react'
import { CompanyInfoContext } from '../../contexts/CompanyInfoContext'
import { updateUser } from '../../api/userService'

const UserDetails = () => {
  const companyInfo = useContext(CompanyInfoContext)
  const [userInfo, setUserInfo] = useState({}) // Initialise avec les infos de l'entreprise ou un objet vide
  const [editMode, setEditMode] = useState(false)

  // Pas besoin d'utiliser useEffect pour récupérer l'utilisateur si on suppose que CompanyInfoContext fournit déjà les détails complets

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  useEffect(() => {
    if (companyInfo) {
      setUserInfo(companyInfo)
    }
  }, [companyInfo])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateUser(userInfo) // Assurez-vous que cette fonction gère l'_id correctement pour la mise à jour
      alert('Mise à jour réussie!')
      setEditMode(false) // Retour au mode lecture
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error)
      alert('Erreur lors de la mise à jour.')
    }
  }

  console.log(companyInfo)

  // Rendu conditionnel basé sur editMode
  if (!editMode) {
    return (
      <div>
        <p>Nom: {userInfo.name}</p>
        <p>Adresse: {userInfo.address}</p>
        <p>Ville: {userInfo.city}</p>
        <p>Email: {userInfo.email}</p>
        <p>Téléphone: {userInfo.phone}</p>
        <button onClick={() => setEditMode(true)}>Modifier</button>
      </div>
    )
  } else {
    return (
      <form onSubmit={handleSubmit}>
        {/* Exemple de champ pour modifier le nom, répétez pour les autres propriétés */}
        <div>
          <label>Nom:</label>
          <input
            type="text"
            name="name"
            value={userInfo.name || ''}
            onChange={handleChange}
          />
        </div>
        {/* Ajoutez d'autres champs ici */}
        <button type="submit">Enregistrer les modifications</button>
        <button type="button" onClick={() => setEditMode(false)}>
          Annuler
        </button>
      </form>
    )
  }
}

export default UserDetails
