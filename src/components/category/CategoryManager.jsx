import React from 'react'
import Grid from '@mui/material/Grid'
import CreateCategory from './CreateCategory'
import CategoryTableTree from './CategoryTableTree'

function CategoryManager() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        <CreateCategory />
      </Grid>
      <Grid item xs={12} md={10}>
        <CategoryTableTree />
      </Grid>
    </Grid>
  )
}

export default CategoryManager
