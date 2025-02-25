const { app } = require('electron')
const Datastore = require('nedb')
const path = require('path')

module.exports = function initializeDatabases() {
  return app.whenReady().then(() => {
    const userDataPath = app.getPath('userData')

    const users = new Datastore({
      filename: path.join(userDataPath, 'users.db'),
      autoload: true,
    })
    const products = new Datastore({
      filename: path.join(userDataPath, 'products.db'),
      autoload: true,
    })
    const categories = new Datastore({
      filename: path.join(userDataPath, 'categories.db'),
      autoload: true,
    })
    const invoices = new Datastore({
      filename: path.join(userDataPath, 'invoices.db'),
      autoload: true,
    })
    const quotes = new Datastore({
      filename: path.join(userDataPath, 'quotes.db'),
      autoload: true,
    })
    const tickets = new Datastore({
      filename: path.join(userDataPath, 'tickets.db'),
      autoload: true,
    })
    const suppliers = new Datastore({
      filename: path.join(userDataPath, 'suppliers.db'),
      autoload: true,
    })
    const categoriesV2 = new Datastore({
      filename: path.join(userDataPath, 'categoriesV2.db'),
      autoload: true,
    })

    return {
      users,
      products,
      categories,
      invoices,
      quotes,
      tickets,
      suppliers,
      categoriesV2,
    }
  })
}
