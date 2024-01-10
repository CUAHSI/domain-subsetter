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
                <v-card class="nav-items mr-2 d-flex mr-4" :elevation="2">
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
        <template v-if="mobile">
            <v-list class="text-body-1">
                <v-list-item @click="logOutUser">
                    <span>Log out</span>
                </v-list-item>
            </v-list>
        </template>
        <template v-else>
            <v-card class="nav-items mr-2 d-flex mr-4" :elevation="2">
            <v-btn @click="logOutUser" :prepend-icon="mdiAccountKey" :elevation="0">Log Out {{ auth.user.email }}</v-btn>
        </v-card>
        </template>
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
.nav-items {
    border-radius: 2rem !important;
    overflow: hidden;

    .v-btn {
        margin: 0;
        border-radius: 0;
        height: 39px !important;
    }
}
</style>
  