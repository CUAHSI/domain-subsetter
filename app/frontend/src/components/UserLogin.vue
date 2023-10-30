<template>
    <v-dialog width="500">
        <template v-slot:activator="{ props }">
            <template v-if="mobile">
                <v-list-item-group class="text-body-1">
                    <v-list-item id="drawer-nav-login" v-if="!auth.isLoggedIn" v-bind="props">
                        <v-icon class="mr-2">mdi-login</v-icon>
                        <span v-if="!auth.isLoggedIn">Log In</span>
                        <span v-else>Hello {{ auth.user.email }}!</span>
                    </v-list-item>
                </v-list-item-group>
            </template>
            <template v-else>
                <v-btn v-bind="props" id="navbar-login" v-if="!auth.isLoggedIn" rounded>Log In</v-btn>
                <span v-else>Welcome {{ auth.user.email }}</span>
            </template>
        </template>
        <template v-slot:default="{ isActive }">
            <v-card class="cd-login">
                <v-card-title>Log In</v-card-title>
                <v-card-text>
                    <p class="text-body-1">
                        User accounts in the Subsetter are managed using CUAHSI SSO.
                        You will be redirected to CUAHSI SSO where you can login or create an account.
                    </p>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="Cancel" @click="isActive.value = false"></v-btn>
                    <v-btn id="login_continue" @click="openLogInDialog()" color="primary">
                        <span>Log In Using CUAHSI SSO</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>
  
<script setup>
import { useAuthStore } from '../stores/auth';
import { logIn } from '@/auth.js'
// import { ref } from 'vue'
defineProps(['mobile'])
const emit = defineEmits(['loggedIn'])

const auth = useAuthStore();
// const isActive = ref(false)

async function openLogInDialog() {
    logIn(onLoggedIn);
}

function onLoggedIn() {
    emit("loggedIn");
    // TODO: isactive close dialog
    console.log("logged in user callback")
}
</script>
  
<style lang="scss" scoped>
::v-deep .v-card__text img {
    max-width: 12rem;
}
</style>
  