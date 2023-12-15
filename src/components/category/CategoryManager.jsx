import React from 'react'
import { Grid, Box } from '@mui/material'
import CreateCategory from './CreateCategory'
import CategoryTableTree from './CategoryTableTree'

function CategoryManager() {
  return (
    <Grid container spacing={2} style={{ height: '100%' }}>
      <Grid item xs={12} md={2} style={{ height: '100%' }}>
        <Box style={{ height: '100%' }}>
          <CreateCategory />
        </Box>
      </Grid>
      <Grid item xs={12} md={10} style={{ height: '100%' }}>
        <Box style={{ height: '100%' }} mt={2}>
          <CategoryTableTree />
        </Box>
      </Grid>
    </Grid>
  )
}

export default CategoryManager
