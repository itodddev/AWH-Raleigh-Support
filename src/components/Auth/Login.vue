<template>
  <div class="login">
    <v-container>
      <v-layout align-center justify-center row fill-height>
        <v-form @submit.prevent="login">
          <v-card width="400px">
            <v-card-title primary-title class="layout justify-center pb-1">
              <p class="headline accent--text">Login</p>
            </v-card-title>
            <v-card-text class="pt-0">
              <!-- <v-container> -->
              <v-layout column wrap>
                <v-flex xs12>
                  <v-text-field color="accent" v-model="email" label="Email" required type="email"></v-text-field>
                </v-flex>

                <v-flex xs12>
                  <v-text-field
                    color="accent"
                    v-model="password"
                    label="Password"
                    required
                    :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                    :type="showPassword ? 'text' : 'password'"
                    @click:append="showPassword = !showPassword"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <div>
                    <p
                      class="accent--text text-xs-right pa-0 pointer"
                      @click="forgotPassword"
                    >Forgot password?</p>
                  </div>
                </v-flex>
                <v-flex xs12>
                  <div v-if="feedback">
                    <p class="red--text text-xs-center pb-0">{{ feedback }}</p>
                  </div>
                </v-flex>
              </v-layout>
              <!-- </v-container> -->
            </v-card-text>
            <v-card-actions class="layout justify-center pt-0 pb-5">
              <v-btn color="accent" type="submit">Submit</v-btn>
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
  name: "Login",
  data() {
    return {
      email: null,
      password: null,
      userName: null,
      feedback: null,
      slug: null,
      showPassword: false
    };
  },
  methods: {
    login() {
      if (this.email && this.password) {
        db.app
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(cred => {
            db.collection("users")
              .where("user_id", "==", cred.user.uid)
              .get()
              .then(snapshot => {
                snapshot.forEach(doc => {
                  db.collection("users")
                    .doc(doc.id)
                    .update({
                      lastSignon: cred.user.metadata.lastSignInTime
                    });
                });
              });

            this.$router.push({ name: "home" });
          })
          .catch(err => {
            this.feedback = err.message;
          });
        this.feedback = null;
      } else {
        this.feedback = "Please fill in both fields";
      }
    },
    forgotPassword() {
      this.$router.push({ name: "ForgotPassword" });
    }
  }
};
</script>

<style>
.pointer {
  cursor: pointer;
  font-size: 12px;
}
</style>