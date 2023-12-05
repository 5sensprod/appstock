function errorHandler(err, req, res, next) {
  console.error(err.stack)
  res.status(500).send({ error: 'Une erreur s’est produite.' })
}

module.exports = errorHandler
