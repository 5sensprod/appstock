import { format } from 'date-fns'

export const createCategoryMap = (categories) => {
  return categories.reduce((acc, category) => {
    acc[category._id] = category.name
    return acc
  }, {})
}

// Fonction pour formater les produits
export const formatProducts = (products, categoryMap) => {
  return products.map((product) => ({
    ...product,
    id: product._id,
    categorie: categoryMap[product.categorie] || 'Non Catégorisé',
    sousCategorie: categoryMap[product.sousCategorie] || '',
    dateSoumission: product.dateSoumission
      ? format(new Date(product.dateSoumission), 'dd/MM/yyyy')
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
