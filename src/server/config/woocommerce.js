// src/config/woocommerce.js
const Store = require('electron-store')
const store = new Store()

const getWooConfig = () => {
  // Essayer d'obtenir la configuration stockée
  const storedConfig = store.get('woocommerce')

  if (
    storedConfig?.url &&
    storedConfig?.consumerKey &&
    storedConfig?.consumerSecret
  ) {
    return storedConfig
  }

  // Configuration par défaut (à remplacer par vos vraies valeurs)
  const defaultConfig = {
    url: 'https://axemusique.shop',
    consumerKey: 'ck_f0757e22e7bb7365f6ea3e1ef5108af1b2634b64',
    consumerSecret: 'cs_df7031b1d320ee93fd8677405bcd6190e8e06979',
    version: 'wc/v3',
  }

  // Stocker la configuration par défaut
  store.set('woocommerce', defaultConfig)

  return defaultConfig
}

const setWooConfig = (config) => {
  store.set('woocommerce', {
    ...config,
    version: 'wc/v3',
  })
}

module.exports = {
  getWooConfig,
  setWooConfig,
}
