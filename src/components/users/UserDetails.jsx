// src/components/users/UserDetails.jsx
import React, { useContext, useState, useEffect } from 'react'
import { CompanyInfoContext } from '../../contexts/CompanyInfoContext'
import { updateUser } from '../../api/userService'
import ShowUser from './ShowUser'
import EditUser from './EditUser'

const UserDetails = () => {
  const companyInfo = useContext(CompanyInfoContext)
  const [userInfo, setUserInfo] = useState({})
  const [initialUserInfo, setInitialUserInfo] = useState({})
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
      setInitialUserInfo(companyInfo)
    }
  }, [companyInfo])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateUser(userInfo)
      setEditMode(false)
      setInitialUserInfo(userInfo)
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error)
    }
  }

  const handleCancel = () => {
    setUserInfo(initialUserInfo)
    setEditMode(false)
  }

  return !editMode ? (
    <ShowUser
      userInfo={userInfo}
      onEdit={() => {
        setEditMode(true)
        setInitialUserInfo(userInfo)
      }}
    />
  ) : (
    <EditUser
      userInfo={userInfo}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  )
}

export default UserDetails
