// src/components/users/ShowUser.jsx
import React from 'react'

const ShowUser = ({ userInfo, onEdit }) => {
  return (
    <div>
      <p>{userInfo.name}</p>
      <span>
        {userInfo.address} {userInfo.city}
      </span>
      <p>{userInfo.email}</p>
      <p>{userInfo.phone}</p>
      <p>{userInfo.taxId}</p>
      <button onClick={onEdit}>Modifier</button>
    </div>
  )
}

export default ShowUser
