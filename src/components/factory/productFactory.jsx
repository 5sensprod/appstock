import React from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
} from '@mui/material'
// import { getProductImageUrl } from '../../utils/imageUtils'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'

function productFactory(props) {
  const {
    _id,
    reference,
    descriptionCourte,
    prixVente,
    featuredImageUrl,
    handleOpenModal,
    redirectToEdit,
  } = props

  const cardStyles = {
    width: '280px',
    // heigth: '450px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'box-shadow 0.3s ease-in-out',
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      cursor: 'pointer',
      boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)',
    },
  }

  const onCardClick = () => {
    redirectToEdit(_id)
  }

  const render = () => (
    <Card key={_id} sx={cardStyles} onClick={onCardClick}>
      <CardMedia
        component="img"
        height="140"
        image={featuredImageUrl}
        alt={`Image de ${reference}`}
        style={{ opacity: featuredImageUrl.includes('default.png') ? 0.1 : 1 }} // Réglage de l'opacité si c'est l'image par défaut
      />
      <Box flexGrow={1} overflow="hidden">
        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {reference}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              overflow: 'hidden',
            }}
          >
            {descriptionCourte}
          </Typography>
        </CardContent>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={2}
      >
        <IconButton onClick={() => redirectToEdit(_id)}>
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={(e) => {
            e.stopPropagation()
            handleOpenModal(_id)
          }}
        >
          <VisibilityIcon />
        </IconButton>
        <Typography variant="body1" color="text.primary">
          {`Prix: ${prixVente} €`}
        </Typography>
      </Box>
    </Card>
  )

  return { ...props, render }
}

export { productFactory }
