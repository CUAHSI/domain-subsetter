<template>
  <v-app-bar color="navbar" ref="appBar" id="app-bar" elevate-on-scroll fixed app>
    <v-container class="d-flex align-end full-height pa-0 align-center">
      <router-link :to="{ path: `/` }" class="logo">
        <img src="@/assets/logo.png" alt="home" />
      </router-link>
      <v-spacer></v-spacer>
      <v-card class="nav-items mr-2 d-flex mr-4" :elevation="2" v-if="!mdAndDown">
        <nav>
          <v-btn v-for="path of paths" :key="path.attrs.to || path.attrs.href" v-bind="path.attrs"
            :id="`navbar-nav-${path.label.replaceAll(/[\/\s]/g, ``)}`" :elevation="0" active-class="primary"
            :class="path.isActive?.() ? 'primary' : ''">
            {{ path.label }}
          </v-btn>
        </nav>
      </v-card>

      <template v-if="!mdAndDown">
        <v-btn id="navbar-login" v-if="!isLoggedIn" rounded>Log In</v-btn>
        <template v-else>
          <v-menu bottom left offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn :color="$route.matched.some((p) => p.name === 'profile')
                ? 'primary'
                : ''
                " elevation="2" rounded v-bind="attrs" v-on="on">
                <v-icon>mdi-account-circle</v-icon>
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </template>

            <v-list class="pa-0">
              <v-list-item id="navbar-logout" @click="logOut()">
                <v-list-item-icon class="mr-2">
                  <v-icon>mdi-logout</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Log Out</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </template>

      <v-app-bar-nav-icon @click.stop="showMobileNavigation = true" v-if="mdAndDown" />
      <ThemeButton />
    </v-container>
  </v-app-bar>
</template>
<script setup>
import { RouterLink } from 'vue-router'
import { useDisplay } from 'vuetify'
import ThemeButton from './ThemeButton.vue';
const { mdAndDown } = useDisplay()

const paths = [
  {
    attrs: { to: "/" },
    label: "Map",
    icon: "mdi-home",
  },
  {
    attrs: { to: "/home" },
    label: "Home",
    icon: "mdi-magnify",
  },
  {
    attrs: { to: "/about" },
    label: "About",
    icon: "mdi-book-multiple",
  },
  {
    attrs: { to: "/wire" },
    label: "Wire",
    icon: "mdi-book-plus",
  },
];
const isLoggedIn = true;
</script>

<style lang="scss" scoped>
.logo {
  height: 100%;
  cursor: pointer;

  img {
    height: 100%;
  }
}

#footer {
  width: 100%;
  margin: 0;
  min-height: unset;
  margin-top: 4rem;
  box-shadow: none;
}

.v-toolbar.v-app-bar--is-scrolled>.v-toolbar__content>.container {
  align-items: center !important;
  will-change: padding;
  padding-top: 0;
  padding-bottom: 0;
}

.nav-items {
  border-radius: 2rem !important;
  overflow: hidden;

  &>a.v-btn:first-child {
    border-top-left-radius: 2rem !important;
    border-bottom-left-radius: 2rem !important;
  }

  &>a.v-btn:last-child {
    border-top-right-radius: 2rem !important;
    border-bottom-right-radius: 2rem !important;
  }

  .v-btn {
    margin: 0;
    border-radius: 0;
    height: 39px !important;
  }
}

// .nav-items .v-btn.is-active,
// .mobile-nav-items .v-list-item.is-active {
//   background-color: #1976d2 !important;
//   color: #FFF;
// }
</style>
