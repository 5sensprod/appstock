import React from 'react'
import { Typography, Box } from '@mui/material'
import DOMPurify from 'dompurify'
import { openExternalLink } from '../../ipcHelper'
import { isEmptyContent } from '../../utils/textHtmlUtils'

const ShowProductSimple = ({ productInfo }) => {
  const cleanDescription = isEmptyContent(productInfo.description)
    ? 'Aucune information'
    : DOMPurify.sanitize(productInfo.description)

  const cleanDescriptionCourte = isEmptyContent(productInfo.descriptionCourte)
    ? 'Aucune information'
    : DOMPurify.sanitize(productInfo.descriptionCourte)

  const handleLinkClick = (event) => {
    const target = event.target
    if (target.tagName === 'A' && target.href) {
      event.preventDefault()
      openExternalLink(target.href)
    }
  }

  return (
    <Box>
      {/* Fiche technique */}
      <Box marginBottom={1}>
        <Typography variant="h5">Fiche technique</Typography>
      </Box>
      <Box
        onClick={handleLinkClick}
        dangerouslySetInnerHTML={{ __html: cleanDescriptionCourte }}
        sx={{ wordWrap: 'break-word' }}
      />

      {/* Description */}
      <Box marginTop={3}>
        <Box marginBottom={1}>
          <Typography variant="h5">Description</Typography>
        </Box>
        <Box
          onClick={handleLinkClick}
          dangerouslySetInnerHTML={{ __html: cleanDescription }}
          sx={{ wordWrap: 'break-word' }}
        />
      </Box>
    </Box>
  )
}

export default ShowProductSimple
