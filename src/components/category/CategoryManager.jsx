import React from 'react'
import { Grid, Box } from '@mui/material'
import CreateCategory from './CreateCategory'
import CategoryTableTree from './CategoryTableTree'
import SimplifiedCategoryTreeGrid from '../CATEGORIES/SimplifiedCategoryTreeGrid'

function CategoryManager() {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Box>
            <CreateCategory />
          </Box>
        </Grid>
        <Grid item xs={12} md={9}>
          <Box mt={2}>
            <SimplifiedCategoryTreeGrid />
          </Box>
        </Grid>
      </Grid>
    </div>
  )
}

export default CategoryManager
