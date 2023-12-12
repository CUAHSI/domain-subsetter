<template>
    <v-dialog v-if="!auth.isLoggedIn" width="500">
        <template v-slot:activator="{ props }">
            <template v-if="mobile">
                <v-list class="text-body-1">
                    <v-list-item id="drawer-nav-login" v-bind="props">
                        <span>Log In</span>
                    </v-list-item>
                </v-list>
            </template>
            <template v-else>
                <v-card :elevation="2">
                    <v-btn v-bind="props" id="navbar-login" :prepend-icon="mdiAccount">
                        Log In
                    </v-btn>
                </v-card>
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
    <div v-else>
        <v-card class="pa-2" :elevation="2">
            <v-icon size="x-small" :icon="mdiAccountKey" />
            <span class="pr-4">{{ auth.user.email }}</span>
            <v-btn @click="logOutUser" rounded>Log Out</v-btn>
        </v-card>
    </div>
</template>
  
<script setup>
import { mdiAccount, mdiAccountKey } from '@mdi/js'
import { useAuthStore } from '../stores/auth';
import { useSubmissionsStore } from '../stores/submissions';
import { logIn, logOut } from '@/auth.js'
defineProps(['mobile'])
const emit = defineEmits(['loggedIn', 'loggedOut'])

const submissionStore = useSubmissionsStore();
const auth = useAuthStore();

async function openLogInDialog() {
    logIn(onLoggedIn);
}

async function logOutUser() {
    logOut(onLogOut);
}

function onLoggedIn() {
    emit("loggedIn");
    // submissionStore.refreshWorkflows()
    submissionStore.getSubmissions()
}
function onLogOut() {
    emit("loggedOut");
    submissionStore.submissions = []
}
</script>
  
<style lang="scss" scoped>
/* ::v-deep .v-card__text img {
    max-width: 12rem;
}
*/
</style>
  