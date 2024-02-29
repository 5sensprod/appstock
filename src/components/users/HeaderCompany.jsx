import React, { useContext } from 'react'
import { Box, Typography } from '@mui/material'
import { CompanyInfoContext } from '../../contexts/CompanyInfoContext'

const HeaderCompany = ({
  styles = {
    title: { fontSize: '15px', fontWeight: 'bold' },
    body: { fontSize: '10px', fontWeight: 'normal' },
    taxId: { fontSize: '10px', fontWeight: 'normal' },
    rcs: { fontSize: '10px', fontWeight: 'normal' },
  },
  visibleFields = {
    title: true,
    body: true,
    taxId: true,
    rcs: true,
  },
}) => {
  const { companyInfo } = useContext(CompanyInfoContext)

  // Fonction pour rendre chaque champ avec le style correspondant
  const renderField = (field, content, customStyle) => {
    if (!visibleFields[field]) return null // Ne pas afficher si non visible

    return (
      <Typography variant="body2" sx={customStyle}>
        {content}
      </Typography>
    )
  }

  return (
    <Box>
      {renderField('title', companyInfo?.name.toUpperCase(), styles.title)}
      {['address', 'city', 'phone', 'email'].map((info) =>
        renderField('body', companyInfo[info], styles.body),
      )}
      {renderField('taxId', `${companyInfo?.taxId}`, styles.taxId)}
      {renderField('rcs', `${companyInfo?.rcs}`, styles.rcs)}
    </Box>
  )
}

export default HeaderCompany
