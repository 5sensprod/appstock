// Fonction pour générer l'en-tête du ticket
export function generateHeaderTicket(documentData, formattedDateTime) {
  return `
        <p class="header">TICKET</p>
        <p class="content">${documentData.number}</p>
        <p class="content" style="font-size: 14px;">le ${formattedDateTime}</p>
      `
}
