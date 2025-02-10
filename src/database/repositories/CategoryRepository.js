// src/database/repositories/CategoryRepository.js
class CategoryRepository {
  constructor(db) {
    this.db = db.categoriesV2
  }

  async list(query = {}) {
    return new Promise((resolve, reject) => {
      this.db
        .find(query)
        .sort({ level: 1, name: 1 })
        .exec((err, documents) => {
          if (err) {
            reject(err)
            return
          }
          // Ne retourner que les données pertinentes
          const cleanedDocuments = documents.map((doc) => ({
            _id: doc._id,
            name: doc.name,
            parent_id: doc.parent_id,
            level: doc.level,
            woo_id: doc.woo_id,
            slug: doc.slug,
            description: doc.description,
            image: doc.image,
            created_at: doc.created_at,
            website_url: doc.website_url,
            last_sync: doc.last_sync,
          }))
          resolve(cleanedDocuments)
        })
    })
  }

  async create(categoryData) {
    return new Promise((resolve, reject) => {
      const category = {
        ...categoryData,
        created_at: new Date(),
        last_sync: new Date(),
      }

      this.db.insert(category, (err, newDoc) => {
        if (err) {
          reject(err)
          return
        }
        resolve(newDoc)
      })
    })
  }

  async findById(id) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: id }, (err, doc) => {
        if (err) {
          reject(err)
          return
        }
        resolve(doc)
      })
    })
  }

  async findByWooId(wooId) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ woo_id: wooId }, (err, doc) => {
        if (err) {
          reject(err)
          return
        }
        resolve(doc)
      })
    })
  }

  async update(id, categoryData) {
    return new Promise((resolve, reject) => {
      this.db.update(
        { _id: id },
        { $set: { ...categoryData, last_sync: new Date() } },
        { returnUpdatedDocs: true },
        (err, numAffected, affectedDocuments) => {
          if (err) {
            reject(err)
            return
          }
          resolve(affectedDocuments)
        },
      )
    })
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      this.db.remove({ _id: id }, {}, (err, numRemoved) => {
        if (err) {
          reject(err)
          return
        }
        resolve(numRemoved)
      })
    })
  }
}

module.exports = CategoryRepository
