import React, { useContext, useState, useEffect } from 'react'
import { CompanyInfoContext } from '../../contexts/CompanyInfoContext'
import { updateUser } from '../../api/userService'
import ShowUser from './ShowUser'
import EditUser from './EditUser'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import IconButton from '@mui/material/IconButton'

const UserDetails = () => {
  const { companyInfo, updateCompanyInfo } = useContext(CompanyInfoContext)
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
      const updatedUser = await updateUser(userInfo)
      updateCompanyInfo(updatedUser)
      setUserInfo(updatedUser)
      setEditMode(false)
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error)
    }
  }
  const handleCancel = () => {
    setUserInfo(initialUserInfo)
    setEditMode(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <h1>{companyInfo?.name}</h1>
        <IconButton onClick={editMode ? handleCancel : () => setEditMode(true)}>
          {editMode ? <VisibilityIcon /> : <EditIcon />}
        </IconButton>
      </div>

      {!editMode ? (
        <ShowUser userInfo={userInfo} />
      ) : (
        <EditUser
          userInfo={userInfo}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}

export default UserDetails
