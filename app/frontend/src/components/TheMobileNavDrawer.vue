<template>
  <v-navigation-drawer :model-value="props.show" class="mobile-nav-items" temporary app>
    <v-list nav dense class="nav-items">
      <v-list class="text-body-1">
        <v-list-item v-for="path of paths" @click="$emit('toggleMobileNav')"
          :id="`drawer-nav-${path.label.replaceAll(/[\/\s]/g, ``)}`" :key="path.attrs.to || path.attrs.href"
          active-class="primary darken-3 white--text" :class="path.isActive?.() ? 'primary darken-4 white--text' : ''"
          v-bind="path.attrs">
          <v-icon :class="path.isActive?.() ? 'white--text' : ''" class="mr-2">{{ path.icon }}</v-icon>
          <span>{{ path.label }}</span>
        </v-list-item>
      </v-list>
      <v-divider class="my-4"></v-divider>

      <v-list class="text-body-1">
        <UserLogin mobile="true" />
      </v-list>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
const props = defineProps(['show', 'paths'])
defineEmits(['toggleMobileNav'])
import UserLogin from '@/components/UserLogin.vue'
</script>