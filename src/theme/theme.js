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
          backgroundColor: 'rgb(255, 255, 255)', // Paramètres spécifiques pour AppBar
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ff0000',
        },
        gutters: {
          '&.MuiTablePagination-toolbar': {
            backgroundColor: 'white',
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgb(255, 255, 255)',
        },
        columnHeader: {
          backgroundColor: 'rgb(240, 240, 240)',
        },
        toolbar: {
          backgroundColor: '#1976d2',
        },
        footerContainer: {
          // backgroundColor: '#1976d2',
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          backgroundColor: '#1976d2',
        },
      },
    },
  },
})

export default theme
