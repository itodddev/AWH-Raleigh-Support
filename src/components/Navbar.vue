<template>
  <nav>
    <!-- Toolbar component -->
    <v-toolbar flat app>
      <v-toolbar-side-icon class="accent--text" @click="drawer = !drawer"></v-toolbar-side-icon>
      <router-link :to="{ name: 'home'}" tag="span">
        <v-toolbar-title>
          <span class="mr-1">AW</span>
          <span class="font-weight-light mr-1">Support Site -</span>
          <span>Raleigh</span>
        </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>

      <v-btn v-if="!user" flat :to="{ name: 'Signup'}">
        <span class="mr-1">SignUp</span>
        <v-icon class="accent--text"></v-icon>
      </v-btn>
      <v-btn v-if="!user" flat :to="{ name: 'Login'}">
        <span class="mr-1">Login</span>
        <v-icon class="accent--text"></v-icon>
      </v-btn>
      <v-btn v-if="user" flat @click="display">
        <v-icon class="left accent--text mr-2">account_circle</v-icon>
        <span class="mr-1">{{ user.email }}</span>
      </v-btn>
      <v-btn v-if="user" flat @click="logout">
        <span class="mr-1">Sign Out</span>
        <v-icon class="accent--text">exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>

    <!-- Navigation slideout component (activated by hamburger icon) -->
    <!-- temporary prop makes drawer sit above application and uses   -->
    <!-- a scrim (overlay) to darken the background                  -->
    <v-navigation-drawer
      app
      v-model="drawer"
      temporary
      dark
      class="secondary lighten-1 white--text"
    >
      <v-layout column align-center>
        <v-flex class="mt-4 mb-2">
          <v-responsive>
            <img src="aw-logo.png">
          </v-responsive>
        </v-flex>
      </v-layout>
      <v-list>
        <v-list-tile v-for="(link, index) in links" :key="index" :to="link.route">
          <v-list-tile-action>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="white--text title">{{ link.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import db from "../firebase/init";

export default {
  data() {
    return {
      drawer: false,
      links: [
        { icon: "home", text: "Home", route: "/" },
        { icon: "assignment", text: "Computer Inventory", route: "/inventory" },
        { icon: "computer", text: "Computer Naming", route: "/naming" },
        { icon: "folder", text: "IT Notes & FAQ", route: "/notes" }
      ],
      user: null
    };
  },
  methods: {
    logout() {
      db.app
        .auth()
        .signOut()
        .then(() => {
          this.$router.push({ name: "Login" });
        });
    },
    display() {
      let ref = db.collection("users");
      ref
        .where("user_id", "==", this.user.uid)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            this.$router.push({ name: "ViewProfile", params: { id: doc.id } });
          });
        });
      console.log("Profile");
      // console.log(this.user);
      // ref
      //   .doc(this.$route.params.id)
      //   .get()
      //   .then(user => {
      //     console.log(user);
      //     this.profile = user.data();
      //   });
    }
  },
  created() {
    //let user = db.app.auth().currentUser;
    db.app.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
        this.user.getIdTokenResult().then(idTokenResult => {
          console.log(idTokenResult.claims.admin);
          this.user.isAdmin = idTokenResult.claims.admin;
        });
      } else {
        this.user = null;
      }
    });
  }
};
</script>

<style>
.v-toolbar__title {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}
</style>