// src/services/CategoryService.js
const { Category } = require('../server/database/models/Category')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const FormData = require('form-data')
const { getWooConfig } = require('../config/woocommerce')
const config = require('../server/config/server.config')

class CategoryService {
  constructor(categoryRepository, wooCommerceClient) {
    this.categoryRepository = categoryRepository
    this.wooCommerceClient = wooCommerceClient
  }

  async uploadImageToWooCommerce(category) {
    try {
      if (!category.image || !category.image.local_path) {
        console.log(`📌 Pas d'image locale pour la catégorie ${category.name}`)
        return null
      }

      // 🔥 Correction : Utilisation de config.paths.catalogue
      const imagePath = path.join(
        config.paths.catalogue,
        'categories',
        category._id,
        path.basename(category.image.local_path),
      )

      if (!fs.existsSync(imagePath)) {
        console.error(`❌ Image introuvable : ${imagePath}`)
        return null
      }

      const wooConfig = getWooConfig()
      const formData = new FormData()
      formData.append('file', fs.createReadStream(imagePath))
      formData.append('title', category.name)
      formData.append('alt_text', `Image de la catégorie ${category.name}`)
      formData.append('description', `Téléversée depuis l'application`)

      console.log(`📤 Tentative d'upload de l'image : ${imagePath}`)

      const response = await axios.post(
        `${wooConfig.url}/wp-json/wp/v2/media`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Basic ${Buffer.from(
              `${wooConfig.wp.user}:${wooConfig.wp.appPassword}`,
            ).toString('base64')}`,
          },
        },
      )

      console.log(
        `✅ Image téléversée avec succès ! URL : ${response.data.source_url}`,
      )
      return response.data.id // Retourne l'ID de l'image WooCommerce
    } catch (error) {
      console.error(
        `❌ Erreur téléversement image :`,
        error.response?.data || error.message,
      )
      return null
    }
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
    try {
      const category = await this.categoryRepository.findById(categoryId)
      if (!category) throw new Error('Catégorie introuvable')

      let parentWooId = 0
      if (category.parent_id) {
        const parentCategory = await this.categoryRepository.findById(
          category.parent_id,
        )
        if (parentCategory && parentCategory.woo_id) {
          parentWooId = parentCategory.woo_id
        }
      }

      let wooImageId = null
      if (category.image && category.image.local_path) {
        wooImageId = await this.uploadImageToWooCommerce(category)
      }

      const wooData = {
        name: category.name,
        description: category.description || '',
        slug: category.slug || undefined,
        parent: parentWooId,
      }

      if (wooImageId) {
        wooData.image = { id: wooImageId } // ✅ Correction : Envoyer un objet, pas un nombre
      }

      console.log(
        `📤 Envoi des données WooCommerce :`,
        JSON.stringify(wooData, null, 2),
      )

      let response
      if (category.woo_id) {
        response = await this.wooCommerceClient.put(
          `products/categories/${category.woo_id}`,
          wooData,
        )
      } else {
        response = await this.wooCommerceClient.post(
          'products/categories',
          wooData,
        )
      }

      console.log(
        `✅ Catégorie synchronisée avec WooCommerce: ${response.data.id}`,
      )

      // Mise à jour en base locale
      await this.categoryRepository.update(categoryId, {
        woo_id: response.data.id,
        slug: response.data.slug,
        image: wooImageId
          ? { id: wooImageId, src: response.data.image?.src }
          : category.image,
        website_url: `${this.wooCommerceClient.url}/categorie-produit/${response.data.slug}/`,
      })

      return response.data
    } catch (error) {
      console.error(
        `❌ Erreur lors de la synchronisation:`,
        error.response?.data || error.message,
      )
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
