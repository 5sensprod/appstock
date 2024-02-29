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

  const bodyFields = ['address', 'city', 'phone', 'email']

  return (
    <Box>
      {visibleFields.title && companyInfo?.name && (
        <Typography variant="body2" sx={{ ...styles.title }}>
          {companyInfo.name.toUpperCase()}
        </Typography>
      )}
      {visibleFields.body &&
        bodyFields.map(
          (info) =>
            companyInfo[info] && (
              <Typography key={info} variant="body2" sx={{ ...styles.body }}>
                {`${info.charAt(0).toUpperCase() + info.slice(1)}: ${companyInfo[info]}`}
              </Typography>
            ),
        )}
      {visibleFields.taxId && companyInfo?.taxId && (
        <Typography variant="body2" sx={{ ...styles.taxId }}>
          {`Tax ID: ${companyInfo.taxId}`}
        </Typography>
      )}
      {visibleFields.rcs && companyInfo?.rcs && (
        <Typography variant="body2" sx={{ ...styles.rcs }}>
          {`RCS: ${companyInfo.rcs}`}
        </Typography>
      )}
    </Box>
  )
}

export default HeaderCompany
