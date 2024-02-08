// src/server/routes/usersRoutes.js
const express = require('express')
const router = express.Router()

module.exports = (db) => {
  const { users } = db

  // Route existante pour récupérer tous les utilisateurs
  router.get('/', (req, res) => {
    users.find({}, (err, docs) => {
      if (err) res.status(500).send(err)
      else res.status(200).json(docs)
    })
  })

  // Nouvelle route pour mettre à jour un utilisateur
  router.put('/:id', (req, res) => {
    const { id } = req.params
    const updatedUser = req.body

    // Assurer que l'objet de mise à jour n'inclut pas l'ID en tant que champ modifiable
    delete updatedUser._id

    users.update({ _id: id }, { $set: updatedUser }, {}, (err, numReplaced) => {
      if (err) {
        res.status(500).send(err)
      } else if (numReplaced === 0) {
        res.status(404).send('Utilisateur non trouvé')
      } else {
        res.status(200).json({ message: 'Utilisateur mis à jour avec succès' })
      }
    })
  })

  // Ajoutez ici d'autres routes liées aux utilisateurs si nécessaire

  return router
}
