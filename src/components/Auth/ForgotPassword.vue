<template>
  <div class="forgotpw">
    <v-container>
      <v-layout align-center justify-center row fill-height>
        <v-form v-if="!submitted" @submit.prevent="forgotPassword">
          <v-card width="400px">
            <v-card-title primary-title class="layout justify-center pb-1">
              <p class="headline accent--text">Forgot Password</p>
            </v-card-title>
            <v-card-text class="pt-0">
              <v-container>
                <v-layout column wrap>
                  <v-flex xs12>
                    <v-text-field
                      color="accent"
                      v-model="email"
                      label="Email"
                      required
                      type="email"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions class="layout justify-center pt-0 pb-5">
              <v-btn color="accent" type="submit">Submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>

        <v-form v-else @submit.prevent="continueOn">
          <v-card width="400px">
            <v-card-title primary-title class="layout justify-center pb-1">
              <p class="headline accent--text">Password Reset Email Sent</p>
            </v-card-title>
            <v-card-text class="pt-0">
              <v-container>
                <v-layout></v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions class="layout justify-center pt-0 pb-5">
              <v-btn color="accent" type="submit">Ok</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import db from "../../firebase/init";

export default {
  data() {
    return {
      email: null,
      submitted: false
    };
  },
  methods: {
    forgotPassword() {
      let auth = db.app.auth();
      let email = this.email;

      auth.sendPasswordResetEmail(email).then(() => {
        console.log("email sent");
      });
      this.submitted = true;
    },
    continueOn() {
      this.$router.push("Login");
    }
  }
};
</script>

<style>
</style>