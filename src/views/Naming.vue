<template>
  <div class="comp-naming">
    <h1 class="subheading secondary--text">Computer Naming</h1>
    <v-container class="my-5">
      <ComputerNaming/>
    </v-container>
  </div>
</template>

<script>
import ComputerNaming from "../components/ComputerNaming";

export default {
  name: "Naming",
  data() {
    return {};
  },
  components: {
    ComputerNaming
  }
};
</script>