// src/utils/dateUtils.js

import moment from 'moment'
import 'moment/locale/fr'

export const formatDateFrench = (date) => {
  if (!date) return ''
  return moment(date).locale('fr').format('DD/MM/YYYY')
}
