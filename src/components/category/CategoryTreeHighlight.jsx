// src/components/category/CategoryTreeHighlight.jsx
import React, { useEffect, useState } from 'react'
import { TreeView, TreeItem } from '@mui/x-tree-view'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const buildTree = (categories, parentId = null) => {
  return categories
    .filter((category) => category.parentId === parentId)
    .map((category) => ({
      ...category,
      children: buildTree(categories, category._id),
    }))
}

const findParentCategoryId = (categoryId, categories) => {
  const category = categories.find((c) => c._id === categoryId)
  return category ? category.parentId : null
}

const CategoryTreeHighlight = ({ categoryId, categories }) => {
  const [expanded, setExpanded] = useState([])
  const [selected, setSelected] = useState('')
  const rootCategories = buildTree(categories)

  useEffect(() => {
    const parentCategoryId = findParentCategoryId(categoryId, categories)

    // Si la catégorie a un parent, déplier le parent, sinon ne rien déplier
    if (parentCategoryId) {
      setExpanded([parentCategoryId])
    } else {
      setExpanded([])
    }

    // Définir la catégorie sélectionnée
    setSelected(categoryId)
  }, [categoryId, categories])

  const renderTree = (node) => (
    <TreeItem key={node._id} nodeId={node._id} label={node.name}>
      {node.children && node.children.map((child) => renderTree(child))}
    </TreeItem>
  )

  return (
    <TreeView
      expanded={expanded}
      selected={selected}
      onNodeToggle={(event, nodeIds) => setExpanded(nodeIds)}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {rootCategories.map((category) => renderTree(category))}
    </TreeView>
  )
}

export default CategoryTreeHighlight
