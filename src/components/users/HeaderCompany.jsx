import React, { useContext } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { CompanyInfoContext } from '../../contexts/CompanyInfoContext' // Ajustez le chemin d'accès selon l'emplacement de votre contexte

const HeaderCompany = () => {
  const { companyInfo } = useContext(CompanyInfoContext)

  return (
    <Box>
      <Typography variant="body2" fontWeight={'bold'}>
        {companyInfo?.name.toUpperCase()}
      </Typography>
      {[
        'address',
        'city',
        'phone',
        'email',
        `Tax ID: ${companyInfo?.taxId}`,
      ].map((info, index) => (
        <Typography key={index} variant="body2" fontSize={10}>
          {companyInfo?.[info] || info}
        </Typography>
      ))}
    </Box>
  )
}

export default HeaderCompany
