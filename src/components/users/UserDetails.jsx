import React, { useContext, useState, useEffect } from 'react'
import { CompanyInfoContext } from '../../contexts/CompanyInfoContext'
import { updateUser } from '../../api/userService'

const UserDetails = () => {
  const companyInfo = useContext(CompanyInfoContext)
  const [userInfo, setUserInfo] = useState({})
  const [editMode, setEditMode] = useState(false)

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
      await updateUser(userInfo)
      setEditMode(false)
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error)
    }
  }

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
