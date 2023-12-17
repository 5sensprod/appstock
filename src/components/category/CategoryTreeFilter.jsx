import React, { useState, useEffect } from 'react'
import { TreeView, TreeItem } from '@mui/x-tree-view'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useNavigate } from 'react-router-dom'

const buildTree = (categories, parentId = null) => {
  return categories
    .filter((category) => category.parentId === parentId)
    .map((category) => ({
      ...category,
      children: buildTree(categories, category._id),
    }))
}

const findParentIds = (categories, categoryId) => {
  let current = categories.find((cat) => cat._id === categoryId)
  const parentIds = []
  while (current && current.parentId) {
    parentIds.push(current.parentId)
    current = categories.find((cat) => cat._id === current.parentId)
  }
  return parentIds
}

const CategoryTreeFilter = ({
  categories,
  onCategorySelect,
  selectedCategoryId,
  getProductIdsByCategory,
}) => {
  const [expanded, setExpanded] = useState([])
  const [selected, setSelected] = useState('')
  const navigate = useNavigate()

  const renderTree = (node) => (
    <TreeItem key={node._id} nodeId={node._id} label={node.name}>
      {node.children && node.children.map((child) => renderTree(child))}
    </TreeItem>
  )

  useEffect(() => {
    if (selectedCategoryId) {
      setSelected(selectedCategoryId)
      const parentIds = findParentIds(categories, selectedCategoryId)
      setExpanded(parentIds)
    }
  }, [selectedCategoryId, categories])

  const handleNodeSelect = (event, nodeId) => {
    const productIds = getProductIdsByCategory(nodeId)
    const url = `/products/${productIds.join(',')}/${nodeId}`
    navigate(url)
    onCategorySelect(nodeId)
  }
  return (
    <TreeView
      expanded={expanded}
      selected={selected}
      onNodeToggle={(event, nodeIds) => setExpanded(nodeIds)}
      onNodeSelect={handleNodeSelect}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {buildTree(categories).map((category) => renderTree(category))}
    </TreeView>
  )
}

export default CategoryTreeFilter
