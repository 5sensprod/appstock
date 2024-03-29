const { app } = require('electron');
const Datastore = require('nedb');
const path = require('path');

// Exporter une fonction pour initialiser les bases de données
module.exports = function initializeDatabases() {
  return app.whenReady().then(() => {
    const userDataPath = app.getPath('userData');

    const users = new Datastore({ filename: path.join(userDataPath, 'users.db'), autoload: true });
    const products = new Datastore({ filename: path.join(userDataPath, 'products.db'), autoload: true });
    const categories = new Datastore({ filename: path.join(userDataPath, 'categories.db'), autoload: true });
    const invoices = new Datastore({ filename: path.join(userDataPath, 'invoices.db'), autoload: true });

    return { users, products, categories, invoices };
  });
};