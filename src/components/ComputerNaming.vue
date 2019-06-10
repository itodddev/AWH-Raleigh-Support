<template>
  <v-card>
    <v-card-title>
      <span class="headline accent--text">Computer Naming</span>
    </v-card-title>

    <v-card-text>
      <v-layout row wrap>
        <v-flex xs12 md6>
          <v-text-field color="accent" v-model="firstName" label="First Name" class="ma-3"></v-text-field>
        </v-flex>
        <v-flex xs12 md6>
          <v-text-field color="accent" v-model="lastName" label="Last Name" class="ma-3"></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 sm6 md3>
          <v-select
            :items="countries"
            item-text="name"
            item-value="letter"
            color="accent"
            v-model="country"
            label="Country"
            class="ma-3"
          ></v-select>
        </v-flex>
        <v-flex xs12 sm6 md3>
          <v-select
            :items="divisions"
            item-text="name"
            item-value="letter"
            color="accent"
            v-model="division"
            label="Division"
            class="ma-3"
          ></v-select>
        </v-flex>
        <v-flex xs12 sm6 md3>
          <v-select
            :items="companies"
            item-text="name"
            item-value="letter"
            color="accent"
            v-model="company"
            label="Company"
            class="ma-3"
          ></v-select>
        </v-flex>
        <v-flex xs12 sm6 md3>
          <v-select
            :items="computertypes"
            item-text="name"
            item-value="letter"
            color="accent"
            v-model="computertype"
            label="Computer Type"
            class="ma-3"
          ></v-select>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 sm6 md4>
          <v-select
            :items="ostypes"
            item-text="name"
            item-value="letter"
            color="accent"
            v-model="ostype"
            label="Computer OS"
            class="ma-3"
          ></v-select>
        </v-flex>
        <v-flex xs12 sm6 md4>
          <v-select
            :items="sortedYears"
            item-text="name"
            item-value="letter"
            color="accent"
            v-model="year"
            label="Install Year"
            class="ma-3"
          ></v-select>
        </v-flex>
        <v-flex xs12 sm6 md4>
          <v-select
            :items="sortedMonths"
            item-text="name"
            item-value="letter"
            color="accent"
            v-model="month"
            label="Install Month"
            class="ma-3"
          ></v-select>
        </v-flex>
      </v-layout>
      <v-flex xs12 d-flex class="mt-4">
        <div class="text-md-center text-sm-center subheading">
          <p>
            Computer Name:
            <span
              class="accent--text"
            >{{ country }}{{ division }}{{ company }}{{ computertype }}{{ ostype }}{{ year }}{{ month }}{{ first }}{{ last }}</span>
          </p>
        </div>
      </v-flex>
    </v-card-text>
  </v-card>
</template>

<script>
import db from "../firebase/init";
import * as helpers from "../helpers";

export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      countries: [],
      country: "",
      divisions: [],
      division: "",
      companies: [],
      company: "",
      computertypes: [],
      computertype: "",
      ostypes: [],
      ostype: "",
      years: [],
      year: "",
      months: [],
      month: ""
    };
  },
  created() {
    helpers.getConfigSetting(db, "configuration", "countries", this.countries);
    helpers.getConfigSetting(db, "configuration", "divisions", this.divisions);
    helpers.getConfigSetting(db, "configuration", "companies", this.companies);
    helpers.getConfigSetting(
      db,
      "configuration",
      "computertypes",
      this.computertypes
    );
    helpers.getConfigSetting(db, "configuration", "ostypes", this.ostypes);
    helpers.getConfigSetting(db, "configuration", "months", this.months);
    helpers.getConfigSetting(db, "configuration", "years", this.years);
  },
  computed: {
    sortedMonths() {
      return this.months.slice().sort((a, b) => a.letter - b.letter);
    },
    sortedYears() {
      // use slice() to get around side effects
      return this.years.slice().sort((a, b) => b.name - a.name);
    },
    first: function() {
      return this.firstName.slice(0, 1);
    },
    last: function() {
      return this.lastName.slice(0, 4).toUpperCase();
    }
  }
};
</script>

<style>
</style>
