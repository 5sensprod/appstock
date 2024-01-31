export const stripHtml = (htmlString) => {
  const temporalDivElement = document.createElement('div')
  temporalDivElement.innerHTML = htmlString
  return temporalDivElement.textContent || temporalDivElement.innerText || ''
}

export const isEmptyContent = (html) => {
  if (html === null || html === undefined) {
    return true // Retourne true si la valeur est null ou undefined
  }

  // Supprimez toutes les balises HTML et espace blancs
  const text = stripHtml(html).trim()

  // Vérifiez si le texte est vide ou ne contient que '<br>'
  return text === '' || text === '<br>' // Ajoutez d'autres vérifications si nécessaire
}
