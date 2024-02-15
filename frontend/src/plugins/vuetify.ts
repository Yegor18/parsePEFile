import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: {
        primary: colors.indigo.darken1,
      },
      dark: {
        primary: colors.indigo.darken1,
      }
    }
  },
  icons: {
    iconfont: 'mdi',
  },
});
