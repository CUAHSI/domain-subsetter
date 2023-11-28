import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
// import colors from 'vuetify/lib/util/colors'

// https://vuetifyjs.com/en/features/theme/#javascript
const light = {
  dark: false,
  colors:{
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#6200EE',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  }
}

const dark = {
  dark: true,
  colors:{
    primary: "#009688",
    secondary: "#607D8B",
    accent: "#2196F3",
    error: "#FF1744",
    success: "#00BFA5",
    info: "#607D8B",
    navbar: "#37474F",
  }
}

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      light,
      dark,
    }
  }
})
