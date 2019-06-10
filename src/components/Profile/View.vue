<template>
  <div class="profile">
    <v-container>
      <v-layout align-center justify-center row fill-height>
        <v-form>
          <v-card v-if="profile" width="400px">
            <v-card-title primary-title class="layout justify-center">
              <p class="headline accent--text">Profile: {{ profile.username }}</p>
            </v-card-title>
            <v-card-text class="pt-0">
              <v-container>
                <v-layout column wrap>
                  <v-flex xs12>
                    <div>Last Login : {{ profile.lastSignon }}</div>
                    <div>Verified : {{ user.emailVerified }}</div>
                    <div>Admin: {{ user.isAdmin }}</div>
                  </v-flex>

                  <v-flex xs12></v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions class="layout justify-center pb-5">
              <v-btn color="accent" @click="forgotPassword">Forgot Password</v-btn>
              <v-btn color="accent" @click="addAdmin(user.email)">Add Admin</v-btn>
              <v-btn color="accent" @click="removeAdmin(user.email)">Remove Admin</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import db from "../../firebase/init";
import "firebase/functions";

export default {
  name: "ViewProfile",
  data() {
    return {
      profile: null,
      user: null,
      isAdmin: null
    };
  },
  created() {
    this.user = db.app.auth().currentUser;
    console.log(this.user);
    let ref = db.collection("users");
    ref
      .doc(this.$route.params.id)
      .get()
      .then(user => {
        console.log(user);
        this.profile = user.data();
      });
  },
  methods: {
    forgotPassword() {
      let auth = db.app.auth();
      let email = this.user.email;

      auth.sendPasswordResetEmail(email).then(() => {
        console.log("email sent");
      });
    },
    addAdmin(email) {
      let addAdminRole = db.app.functions().httpsCallable("addAdminRole");
      console.log(email);
      addAdminRole({ email: email }).then(result => {
        console.log(result);
        this.user.getIdTokenResult().then(idTokenResult => {
          console.log(idTokenResult.claims.admin);
          this.isAdmin = idTokenResult.claims.admin;
        });
      });
    },
    removeAdmin(email) {
      let addAdminRole = db.app.functions().httpsCallable("removeAdminRole");
      console.log(email);
      addAdminRole({ email: email }).then(result => {
        console.log(result);
        this.user.getIdTokenResult().then(idTokenResult => {
          console.log(idTokenResult.claims.admin);
          this.isAdmin = idTokenResult.claims.admin;
        });
      });
    }
  }
};
</script>

<style>
</style>