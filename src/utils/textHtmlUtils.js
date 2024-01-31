export const stripHtml = (htmlString) => {
  const temporalDivElement = document.createElement('div')
  temporalDivElement.innerHTML = htmlString
  return temporalDivElement.textContent || temporalDivElement.innerText || ''
}
