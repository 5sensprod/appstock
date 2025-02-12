// src/database/models/Category.js
const Joi = require('joi')

const imageSchema = Joi.object({
  id: Joi.number().required(),
  src: Joi.string().required(),
  local_path: Joi.string().allow(null),
})

const categorySchema = Joi.object({
  _id: Joi.string(),
  name: Joi.string().required().min(2).max(100),
  parent_id: Joi.string().allow(null),
  level: Joi.number().integer().min(0).default(0),
  woo_id: Joi.number().allow(null),
  slug: Joi.string().required(),
  description: Joi.string().allow(''),
  image: imageSchema.allow(null),
  created_at: Joi.date().default(() => new Date()),
  website_url: Joi.string().uri().allow(null),
  last_sync: Joi.date(),
})

class Category {
  static validate(categoryData) {
    return categorySchema.validate(categoryData)
  }

  static sanitize(categoryData) {
    const { value, error } = this.validate(categoryData)
    if (error) throw error
    return value
  }
}

module.exports = {
  Category,
  categorySchema,
}
