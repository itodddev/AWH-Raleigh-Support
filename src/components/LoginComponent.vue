<template>
  <div class="login">
    <h3>Sign In</h3>
    <v-text-field v-model="email" type="text" placeholder="Email"></v-text-field>
    <v-text-field v-model="password" type="password" placeholder="Password"></v-text-field>
    <v-btn @click="login" color="accent">Login</v-btn>
  </div>
</template>

<script>
import db from "../firebase/auth";

export default {
  name: "login",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    login: function() {
      console.log(db);
      console.log(this);
      db.auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          function(user) {
            alert("logged in");
            console.log(user);
            console.log("Current User: " + db.auth().currentUser.email);
          },
          function(err) {
            alert("Error: " + err.message);
          }
        );
    }
  }
};
</script>

<style>
</style>
