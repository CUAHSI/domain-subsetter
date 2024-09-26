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
                    <v-btn v-bind="props" id="navbar-login" :prepend-icon="mdiAccount" size="large">
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
                <v-list-item @click="showTokenDialog = true">
                    <span>Show Auth Token</span>
                </v-list-item>
                <v-list-item @click="logOutUser">
                    <span>Log out</span>
                </v-list-item>
            </v-list>
        </template>
        <template v-else>
            <v-card class="nav-items ma-2" :elevation="1">
                <v-tooltip text="Show Auth Token" location="start">
                    <template v-slot:activator="{ props }">
                        <v-btn icon v-bind="props" @click="showTokenDialog = true">
                            <v-icon :icon="mdiShieldKeyOutline"></v-icon>
                        </v-btn>
                    </template>
                </v-tooltip>
                <v-btn @click="logOutUser" :prepend-icon="mdiAccountKey" :elevation="1" class="ma-2">Log Out {{
                    auth.user.email }}</v-btn>
            </v-card>
        </template>
    </div>
    <v-dialog v-model="showTokenDialog" max-width="500">
        <v-card>
            <v-card-title>Auth Token</v-card-title>
            <v-card-text>
                <p class="text-body-1">
                    Your auth token is a secret key that allows you to access the Subsetter API.
                </p>
                <v-text-field variant="outlined" v-on:focus="$event.target.select()" ref="clone" readonly
                    :value="token" />
                <v-btn v-if="!hasCopied" @click="copyToken">Copy</v-btn>
                <v-btn color="green" v-else @click="copyToken">Copied to clipboard!</v-btn>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="Close" @click="showTokenDialog = false"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup>
import { mdiAccount, mdiAccountKey, mdiShieldKeyOutline } from '@mdi/js'
import { useAuthStore } from '../stores/auth';
import { useSubmissionsStore } from '../stores/submissions';
import { logIn, logOut } from '@/auth.js'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

defineProps(['mobile'])
const emit = defineEmits(['loggedIn', 'loggedOut'])

const submissionStore = useSubmissionsStore();
const auth = useAuthStore();
const router = useRouter()

const showTokenDialog = ref(false);
const token = auth.getToken();
let hasCopied = ref(false);


const copyToken = () => {
    navigator.clipboard.writeText(token);
    hasCopied.value = true;
}


async function openLogInDialog() {
    logIn(onLoggedIn);
}

async function logOutUser() {
    logOut(onLogOut);
}

function onLoggedIn() {
    emit("loggedIn");
    router.push({ name: 'map' })
}
function onLogOut() {
    emit("loggedOut");
    submissionStore.submissions = []
    router.push({ name: 'home' })
}
</script>
  
<style lang="scss" scoped>
.nav-items {
    overflow: hidden;

    .v-btn {
        margin: 0;

    }
}
</style>
  

