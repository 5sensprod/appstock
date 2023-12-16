import { format, parseISO } from 'date-fns'

export const createCategoryMap = (categories) => {
  return categories.reduce((acc, category) => {
    acc[category._id] = category.name
    return acc
  }, {})
}

export const formatProducts = (products, categoryMap) => {
  return products.map((product) => ({
    ...product,
    id: product._id,
    categorie: categoryMap[product.categorie] || 'Non Catégorisé',
    categorieId: product.categorie,
    sousCategorie: categoryMap[product.sousCategorie] || '',
    sousCategorieId: product.sousCategorie,
    dateSoumissionFormatted: product.dateSoumission
      ? format(parseISO(product.dateSoumission), 'dd/MM/yyyy')
      : '',
    // ... autres champs ...
  }))
}

// Nouvelle fonction pour filtrer et formater les produits
export const filterAndFormatProducts = (products, productIds, categories) => {
  const categoryMap = createCategoryMap(categories)

  // Filtrer les produits
  const filteredProducts = products.filter((product) =>
    productIds.includes(product._id),
  )

  // Appliquer la fonction formatProducts aux produits filtrés
  return formatProducts(filteredProducts, categoryMap)
}
