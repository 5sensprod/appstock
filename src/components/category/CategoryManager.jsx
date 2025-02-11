// src/components/category/CategoryManager.jsx
import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
  Collapse,
  Chip,
} from '@mui/material'
import {
  Refresh as RefreshIcon,
  FolderSpecial as FolderIcon,
  Save as SaveIcon,
  Sync as SyncIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { useCategoryManager } from '../../contexts/CategoryManagerContext'

const CategoryManager = () => {
  const {
    categories,
    loading,
    error,
    syncStatus,
    fetchCategories,
    createCategory,
    syncFromWoo,
    syncToWoo,
    buildCategoryHierarchy,
  } = useCategoryManager()

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    parent_id: '',
    slug: '',
  })
  const [expandedCategories, setExpandedCategories] = useState(new Set())

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewCategory((prev) => ({
      ...prev,
      [name]: value,
      slug:
        name === 'name' ? value.toLowerCase().replace(/\s+/g, '-') : prev.slug,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createCategory(newCategory)
      setNewCategory({
        name: '',
        description: '',
        parent_id: '',
        slug: '',
      })
    } catch (err) {
      console.error('Error creating category:', err)
    }
  }

  const handleSyncFromWoo = async () => {
    try {
      await syncFromWoo()
    } catch (err) {
      console.error('Error syncing from WooCommerce:', err)
    }
  }

  const handleSyncToWoo = async (categoryId) => {
    try {
      await syncToWoo(categoryId)
    } catch (err) {
      console.error('Error syncing to WooCommerce:', err)
    }
  }

  const toggleExpand = (categoryId) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const renderCategoryTree = (category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedCategories.has(category._id)

    return (
      <Box key={category._id} sx={{ ml: 2 * level }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            py: 1,
            '&:hover': {
              bgcolor: 'action.hover',
              borderRadius: 1,
            },
          }}
        >
          {hasChildren && (
            <IconButton size="small" onClick={() => toggleExpand(category._id)}>
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
          <FolderIcon sx={{ mx: 1, fontSize: 20, color: 'primary.light' }} />
          <Typography variant="body1" sx={{ flex: 1 }}>
            {category.name}
          </Typography>
          {category.woo_id && (
            <Chip
              size="small"
              label={`WooID: ${category.woo_id}`}
              sx={{ mr: 1 }}
            />
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Synchroniser avec WooCommerce">
              <IconButton
                size="small"
                onClick={() => handleSyncToWoo(category._id)}
                disabled={syncStatus.isSyncing}
              >
                <SyncIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Modifier">
              <IconButton size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {hasChildren && (
          <Collapse in={isExpanded}>
            <Box sx={{ ml: 2 }}>
              {category.children.map((child) =>
                renderCategoryTree(child, level + 1),
              )}
            </Box>
          </Collapse>
        )}
      </Box>
    )
  }

  return (
    <Card sx={{ maxWidth: 1200, mx: 'auto', mt: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <Typography variant="h5" component="h2">
            Gestion des Catégories
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {syncStatus.lastSync && (
              <Typography variant="caption" color="text.secondary">
                Dernière sync: {new Date(syncStatus.lastSync).toLocaleString()}
              </Typography>
            )}
            <Tooltip title="Synchroniser depuis WooCommerce">
              <IconButton
                onClick={handleSyncFromWoo}
                disabled={loading || syncStatus.isSyncing}
              >
                <SyncIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Rafraîchir">
              <IconButton
                onClick={fetchCategories}
                disabled={loading || syncStatus.isSyncing}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Formulaire de création */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Nouvelle Catégorie
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Nom de la catégorie"
                name="name"
                value={newCategory.name}
                onChange={handleInputChange}
                required
                fullWidth
                size="small"
              />

              <TextField
                label="Description"
                name="description"
                value={newCategory.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                fullWidth
                size="small"
              />

              <FormControl fullWidth size="small">
                <InputLabel>Catégorie parente</InputLabel>
                <Select
                  name="parent_id"
                  value={newCategory.parent_id}
                  onChange={handleInputChange}
                  label="Catégorie parente"
                >
                  <MenuItem value="">
                    <em>Aucun parent</em>
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Slug"
                name="slug"
                value={newCategory.slug}
                onChange={handleInputChange}
                required
                fullWidth
                size="small"
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading || syncStatus.isSyncing}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <AddIcon />
                }
              >
                {loading ? 'Création...' : 'Créer la catégorie'}
              </Button>
            </Box>
          </form>
        </Box>

        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Arborescence des catégories */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Hiérarchie des catégories
          </Typography>
          <Card variant="outlined" sx={{ p: 2 }}>
            {loading || syncStatus.isSyncing ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              buildCategoryHierarchy().map((category) =>
                renderCategoryTree(category),
              )
            )}
          </Card>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CategoryManager
