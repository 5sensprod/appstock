import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    background: {
      default: 'rgb(252, 252, 254)', // Définir la couleur de fond pour tout le body
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          height: '70px',
          // backgroundColor: 'rgb(255, 255, 255)', // Paramètres spécifiques pour AppBar
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgb(255, 255, 255)', // Couleur de fond pour DataGrid
        },
        columnHeader: {
          backgroundColor: 'rgb(240, 240, 240)',
          // color: 'black',
        },
      },
    },
  },
})

export default theme
