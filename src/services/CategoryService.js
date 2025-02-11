// src/services/CategoryService.js
const { Category } = require('../database/models/Category')

class CategoryService {
  constructor(categoryRepository, wooCommerceClient) {
    this.categoryRepository = categoryRepository
    this.wooCommerceClient = wooCommerceClient
  }

  async create(data) {
    try {
      // 1. Validation des données avec le modèle
      const validatedData = Category.sanitize(data)

      // 2. Logique métier : calcul du level
      if (validatedData.parent_id) {
        const parentCategory = await this.categoryRepository.findById(
          validatedData.parent_id,
        )
        if (!parentCategory) {
          throw new Error('Parent category not found')
        }
        validatedData.level = parentCategory.level + 1
      } else {
        validatedData.level = 0 // Catégorie racine
      }

      // 3. Création via le repository
      const createdCategory =
        await this.categoryRepository.create(validatedData)

      return createdCategory
    } catch (error) {
      if (error.details) {
        // Erreur de validation Joi
        throw new Error(`Validation error: ${error.details[0].message}`)
      }
      throw error
    }
  }

  async syncFromWooCommerce() {
    try {
      // Récupérer les catégories de WooCommerce
      const response = await this.wooCommerceClient.get('products/categories')
      const wooCategories = response.data
      console.log(
        'WooCommerce category example:',
        JSON.stringify(wooCategories[0], null, 2),
      )
      // Première passe : créer ou mettre à jour toutes les catégories
      const wooToLocalMap = new Map() // Pour stocker la correspondance woo_id -> _id local

      for (const wooCat of wooCategories) {
        const existingCategory = await this.categoryRepository.findByWooId(
          wooCat.id,
        )

        const categoryData = {
          name: wooCat.name,
          woo_id: wooCat.id,
          slug: wooCat.slug,
          description: wooCat.description,
          image: wooCat.image
            ? {
                id: wooCat.image.id,
                src: wooCat.image.src,
                local_path: null,
              }
            : null,
          website_url: `${this.wooCommerceClient.url}/categorie-produit/${wooCat.slug}/`,
          parent_id: null,
          level: 0,
        }

        let localCategory
        if (existingCategory) {
          localCategory = await this.categoryRepository.update(
            existingCategory._id,
            categoryData,
          )
        } else {
          localCategory = await this.categoryRepository.create(categoryData)
        }

        wooToLocalMap.set(wooCat.id, localCategory._id)
      }

      // Deuxième passe : mettre à jour les relations parent/enfant
      for (const wooCat of wooCategories) {
        if (wooCat.parent) {
          const localCategoryId = wooToLocalMap.get(wooCat.id)
          const localParentId = wooToLocalMap.get(wooCat.parent)

          if (localCategoryId && localParentId) {
            // Récupérer le parent pour avoir son niveau
            const parentCategory =
              await this.categoryRepository.findById(localParentId)
            const parentLevel = parentCategory ? parentCategory.level : 0

            await this.categoryRepository.update(localCategoryId, {
              parent_id: localParentId,
              level: parentLevel + 1, // Le niveau sera celui du parent + 1
            })
          }
        }
      }
    } catch (error) {
      throw new Error(`Sync failed: ${error.message}`)
    }
  }

  async pushToWooCommerce(categoryId) {
    const category = await this.categoryRepository.findById(categoryId)
    if (!category) throw new Error('Category not found')

    let parentWooId = 0
    if (category.parent_id) {
      const parentCategory = await this.categoryRepository.findById(
        category.parent_id,
      )
      if (parentCategory && parentCategory.woo_id) {
        parentWooId = parentCategory.woo_id
      }
    }

    const wooData = {
      name: category.name,
      description: category.description || '',
      slug: category.slug || undefined,
      parent: parentWooId,
    }

    try {
      if (category.woo_id) {
        const response = await this.wooCommerceClient.put(
          `products/categories/${category.woo_id}`,
          wooData,
        )
        return response.data
      } else {
        const response = await this.wooCommerceClient.post(
          'products/categories',
          wooData,
        )
        console.log(
          'WooCommerce response:',
          JSON.stringify(response.data, null, 2),
        )
        // Mise à jour avec toutes les données retournées par WooCommerce
        await this.categoryRepository.update(categoryId, {
          woo_id: response.data.id,
          slug: response.data.slug,
          description: response.data.description,
          image: response.data.image,
          website_url: `${this.wooCommerceClient.url}/categorie-produit/${response.data.slug}/`,
          level: category.parent_id ? 1 : 0,
        })
        return response.data
      }
    } catch (error) {
      if (error.response) {
        console.error('WooCommerce error details:', error.response.data)
        throw new Error(
          `WooCommerce sync failed: ${JSON.stringify(error.response.data)}`,
        )
      }
      throw new Error(`WooCommerce sync failed: ${error.message}`)
    }
  }

  async getHierarchy() {
    const categories = await this.categoryRepository.list()
    console.log('Categories from DB:', categories)
    const tree = this.buildHierarchyTree(categories)
    console.log('Built tree:', tree)
    return tree
  }

  buildHierarchyTree(categories, parentId = null) {
    return categories
      .filter((cat) => {
        // Gérer à la fois null et undefined comme catégorie racine
        if (parentId === null) {
          return !cat.parent_id
        }
        return cat.parent_id === parentId
      })
      .map((cat) => ({
        ...cat,
        children: this.buildHierarchyTree(categories, cat._id),
      }))
  }
}

module.exports = CategoryService
