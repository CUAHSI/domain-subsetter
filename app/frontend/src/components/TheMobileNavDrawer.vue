<template>
  <v-navigation-drawer
    v-if="mdAndDown"
    :model-value="props.show"
    class="mobile-nav-items"
    temporary
    app
  >
    <v-list nav dense class="nav-items">
      <v-list class="text-body-1">
        <v-list-item
          v-for="path of paths"
          @click="$emit('toggleMobileNav')"
          :id="`drawer-nav-${path.label.replaceAll(/[\/\s]/g, ``)}`"
          :key="path.attrs.to || path.attrs.href"
          active-class="primary darken-3 white--text"
          :class="path.isActive?.() ? 'primary darken-4 white--text' : ''"
          v-bind="path.attrs"
        >
          <span>{{ path.label }}</span>
        </v-list-item>
      </v-list>
      <v-divider class="my-4"></v-divider>

      <v-list class="text-body-1">
        <UserLogin @logged-in="login" mobile="true" />
      </v-list>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import UserLogin from '@/components/UserLogin.vue'
import { useAuthStore } from '../stores/auth'
import { useDisplay } from 'vuetify'

const props = defineProps(['show', 'paths'])
defineEmits(['toggleMobileNav'])

const auth = useAuthStore()
const { mdAndDown } = useDisplay()

function login() {
  auth.isLoggedIn = true
}
</script>
