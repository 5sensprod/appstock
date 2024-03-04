export const transformCategoriesToTree = (categories) => {
  let categoriesCopy = categories.map((category) => ({ ...category }))

  let categoriesMap = categoriesCopy.reduce((acc, category) => {
    acc[category._id] = category
    category.children = []
    return acc
  }, {})

  let tree = []
  categoriesCopy.forEach((category) => {
    if (category.parentId) {
      if (categoriesMap[category.parentId]) {
        categoriesMap[category.parentId].children.push(category)
      }
    } else {
      tree.push(category)
    }
  })

  return tree
}
