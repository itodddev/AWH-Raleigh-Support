<template>
  <div class="signup">
    <v-container>
      <v-layout align-center justify-center row fill-height>
        <v-form @submit.prevent="signup">
          <v-card width="400px">
            <v-card-title primary-title class="layout justify-center">
              <p class="headline accent--text">Signup</p>
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
                    <v-text-field color="accent" v-model="userName" label="User Name" required></v-text-field>
                    <p class="red--text" v-if="feedback">{{ feedback }}</p>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions class="layout justify-center pb-5">
              <v-btn color="accent" type="submit">Submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import slugify from "slugify";
import db from "../../firebase/init";
import "firebase/functions";

export default {
  name: "Signup",
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
    signup() {
      if (this.email && this.password && this.userName) {
        this.slug = slugify(this.userName, {
          replacement: "-",
          remove: /[$*_+~.()'"!\-:@]/g,
          lower: true
        });
        // set the document id to the slug, instead of the auto generated one
        // let ref = db.collection("users").doc(this.slug);

        let checkUserName = db.app.functions().httpsCallable("checkUserName");
        checkUserName({ slug: this.slug }).then(result => {
          console.log(result);
          //console.log(functions);

          if (!result.data.unique) {
            this.feedback = "Username already exists";
          } else {
            db.app
              .auth()
              .createUserWithEmailAndPassword(this.email, this.password)
              // in firebase 4 you used to get a "user" object back, now its a credential obj with a "user" property
              .then(cred => {
                // sets properties on the document referenced by "ref"
                db.collection("users")
                  .doc(this.slug)
                  .set({
                    username: this.userName,
                    // adds the uid from auth db entry to user db entry
                    user_id: cred.user.uid,
                    slug: this.slug
                  });
                cred.user.updateProfile({
                  displayName: this.userName
                });

                console.log(cred.user);
                //send verification emal
                cred.user
                  .sendEmailVerification()
                  .then(function() {
                    console.log("Email sent");
                  })
                  .catch(function(error) {
                    // An error happened.
                    this.feedback = error.message;
                  });
              })
              .then(() => {
                this.$router.push({ name: "home" });
              })
              .catch(err => {
                console.log(err);
                this.feedback = err.message;
              });
          }
        });

        console.log(this.slug);
        this.feedback = null;
      } else {
        this.feedback = "You must complete all fields";
      }
    }
  }
};
</script>

<style>
</style>
