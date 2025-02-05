import React, { useState, useContext, useEffect } from 'react'
import { TextField, Popover, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { TreeView, TreeItem } from '@mui/x-tree-view'
import { useCategoryContext } from '../../contexts/CategoryContext'
import { CategoryTreeSelectContext } from '../../contexts/CategoryTreeSelectContext'

const CategoryFilter = () => {
  const { categories } = useCategoryContext()
  const { selectedCategory, handleCategorySelect } = useContext(
    CategoryTreeSelectContext,
  )
  const [anchorEl, setAnchorEl] = useState(null)
  const [filterText, setFilterText] = useState('')

  const [expandedNodes, setExpandedNodes] = useState([])

  useEffect(() => {
    const expandNodes = (categoryId) => {
      const category = categories.find((cat) => cat._id === categoryId)
      if (!category) return []
      if (category.parentId) {
        return [category._id, ...expandNodes(category.parentId)]
      }
      return [category._id]
    }

    if (selectedCategory?.categoryId) {
      setExpandedNodes(expandNodes(selectedCategory.categoryId))
    } else {
      setExpandedNodes([])
    }
  }, [selectedCategory, categories])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const clearCategorySelection = (event) => {
    event.stopPropagation()
    handleCategorySelect(null, '')
    setFilterText('')
  }

  const localHandleCategorySelect = (event, categoryId) => {
    if (event.target.closest('.MuiTreeItem-iconContainer')) {
      return
    }
    const selectedCategory = categories.find((cat) => cat._id === categoryId)
    handleCategorySelect(
      categoryId,
      selectedCategory ? selectedCategory.name : '',
      categories, // Passons les catégories
    )
    handleClose()
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(filterText.toLowerCase()),
  )

  const buildTree = (categories, parentId = null) => {
    return categories
      .filter((category) => category.parentId === parentId)
      .map((category) => ({
        ...category,
        children: buildTree(categories, category._id),
      }))
  }

  const renderTree = (node) => (
    <TreeItem
      key={node._id}
      nodeId={node._id}
      label={node.name}
      className={node._id === selectedCategory?.categoryId ? 'highlighted' : ''}
      onClick={(event) => localHandleCategorySelect(event, node._id)}
    >
      {node.children && node.children.map((child) => renderTree(child))}
    </TreeItem>
  )

  return (
    <div>
      <TextField
        size="small"
        label="Filtrer par catégorie"
        variant="outlined"
        onClick={handleClick}
        value={selectedCategory?.categoryName || ''}
        onChange={(e) => setFilterText(e.target.value)}
        fullWidth
        style={{ marginBottom: 8 }}
        InputProps={{
          readOnly: true,
          endAdornment: selectedCategory ? (
            <IconButton onClick={clearCategorySelection}>
              <CloseIcon />
            </IconButton>
          ) : null,
        }}
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          expanded={expandedNodes}
          selected={selectedCategory?.categoryId}
          onNodeToggle={(event, nodeIds) => setExpandedNodes(nodeIds)}
        >
          {buildTree(categories).map((category) => renderTree(category))}
        </TreeView>
      </Popover>
    </div>
  )
}

export default CategoryFilter
