<template>
  <v-app-bar v-if="!$route.meta.hideNavigation" color="navbar" ref="appBar" id="app-bar" elevate-on-scroll fixed app>
    <div class="d-flex align-end full-height pa-2 align-center w-100">
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
      <v-spacer></v-spacer>
      <UserLogin @logged-in="login" v-if="!mdAndDown" :mobile="false" />

      <v-app-bar-nav-icon @click="$emit('toggleMobileNav')" v-else />
    </div>
  </v-app-bar>
</template>
<script setup>
import { RouterLink } from 'vue-router'
import { useDisplay } from 'vuetify'
import UserLogin from "@/components/UserLogin.vue";
import { useAuthStore } from '../stores/auth';
defineProps(['paths'])
defineEmits(['toggleMobileNav'])

const auth = useAuthStore();
const { mdAndDown } = useDisplay()

function login(){
  auth.isLoggedIn = true
}

</script>

<style lang="scss" scoped>
.logo {
  height: 100%;
  cursor: pointer;

  img {
    height: 100%;
  }
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
