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
      } else {
        console.log('Parent ID not found for:', category)
      }
    } else {
      tree.push(category)
    }
  })

  // Log pour vérifier la structure finale de l'arbre
  console.log('Final tree structure:', tree)

  return tree
}
