import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
// import colors from 'vuetify/lib/util/colors'

// https://vuetifyjs.com/en/features/theme/#javascript

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
      dark,
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})
