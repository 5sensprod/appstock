import React from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
} from '@mui/material'
import { getProductImageUrl } from '../../utils/imageUtils'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'

function productFactory(props) {
  const {
    _id,
    reference,
    descriptionCourte,
    prixVente,
    photos,
    baseUrl,
    handleOpenModal,
    redirectToEdit,
  } = props

  const cardStyles = {
    width: '200px',
    margin: '10px',
    display: 'flex',
    flexDirection: 'column',
  }

  const { url, isDefault } = getProductImageUrl(photos, baseUrl)

  const render = () => (
    <Card key={_id} style={cardStyles}>
      <CardMedia
        component="img"
        height="140"
        image={url}
        alt={`Image de ${reference}`}
        style={{ opacity: isDefault ? 0.1 : 1 }}
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
        <IconButton onClick={() => handleOpenModal(_id)}>
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
