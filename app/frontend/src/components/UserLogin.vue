<template>
    <v-dialog width="500">
        <template v-slot:activator="{ props }">
            <template v-if="mobile">
                <v-list-item-group class="text-body-1">
                    <v-list-item id="drawer-nav-login" v-if="!isLoggedIn" v-bind="props">
                        <v-icon class="mr-2">mdi-login</v-icon>
                        <span>Log In</span>
                    </v-list-item>
                </v-list-item-group>
            </template>
            <template v-else>
                <v-btn v-bind="props" id="navbar-login" v-if="!isLoggedIn" rounded>Log In</v-btn>
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
                    <v-btn id="orcid_login_continue" @click="openLogInDialog()" color="primary">
                        <!-- <v-icon class="mr-2">fab fa-orcid</v-icon> -->
                        <span>Log In Using CUAHSI SSO</span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>
  
<script setup>
defineProps(['mobile'])
//   import User from "@/models/user.model";
async function openLogInDialog() {
    // User.logIn(this.onLoggedIn);
}

// function onLoggedIn() {
//     this.$emit("logged-in");
// }
</script>
  
<style lang="scss" scoped>
::v-deep .v-card__text img {
    max-width: 12rem;
}
</style>
  