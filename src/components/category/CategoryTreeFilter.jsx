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
  productCountByCategory,
}) => {
  const [expanded, setExpanded] = useState([])
  const [selected, setSelected] = useState('')
  const navigate = useNavigate()

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

  const renderTree = (node) => {
    const productIds = getProductIdsByCategory(node._id)
    const hasProducts = productIds && productIds.length > 0
    const isDataLoaded = Object.keys(productCountByCategory).length > 0

    return (
      <TreeItem
        key={node._id}
        nodeId={node._id}
        label={node.name}
        style={{ opacity: hasProducts || !isDataLoaded ? 1 : 0.5 }}
        disabled={!hasProducts && isDataLoaded}
      >
        {node.children && node.children.map((child) => renderTree(child))}
      </TreeItem>
    )
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
