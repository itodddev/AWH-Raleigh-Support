<template>
  <div class="inventory">
    <h1 class="subheading secondary--text">Computer Inventory</h1>
    <v-container class="my-5">
      <DataTable/>
    </v-container>
  </div>
</template>

<script>
import DataTable from "../components/DataTable";

export default {
  components: {
    DataTable
  }
};
</script>