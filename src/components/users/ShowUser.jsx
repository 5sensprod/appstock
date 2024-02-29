import React from 'react'
// Assurez-vous d'importer Typography depuis la bonne source
import Typography from '@mui/material/Typography' // ou '@material-ui/core/Typography' pour les versions plus anciennes

const ShowUser = ({ userInfo }) => {
  return (
    <div>
      {/* Remplacez les balises <p> par <Typography> avec les props correspondants */}
      <Typography variant="subtitle1" component="h2">
        {userInfo.name}
      </Typography>
      <span>
        {userInfo.address} {userInfo.city}
      </span>
      {/* Répétez pour chaque élément que vous souhaitez afficher avec Typography */}
      <Typography variant="subtitle1" component="h2">
        {userInfo.email}
      </Typography>
      <Typography variant="subtitle1" component="h2">
        {userInfo.phone}
      </Typography>
      <Typography variant="subtitle1" component="h2">
        {userInfo.taxId}
      </Typography>
      <Typography variant="subtitle1" component="h2">
        {userInfo.rcs}
      </Typography>
    </div>
  )
}

export default ShowUser
