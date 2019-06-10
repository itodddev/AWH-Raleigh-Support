<template>
  <div>
    <v-toolbar flat color="white">
      <v-dialog v-model="dialog" max-width="700px">
        <template v-slot:activator="{ on }">
          <v-btn color="accent" dark class="mb-2" v-on="on">New Computer</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline accent--text">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field color="accent" v-model="editedItem.empname" label="Employee Name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-select
                    color="accent"
                    :items="depts"
                    v-model="editedItem.dept"
                    label="Department"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field color="accent" v-model="editedItem.serial" label="Serial #"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field color="accent" v-model="editedItem.purchdate" label="Purchase Date"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-select
                    color="accent"
                    :items="selectStatus"
                    label="Status"
                    v-model="editedItem.status"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-select
                    color="accent"
                    :items="oses"
                    label="Operating System"
                    v-model="editedItem.os"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-select
                    color="accent"
                    :items="locations"
                    label="Location"
                    v-model="editedItem.location"
                  ></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-textarea color="accent" label="Notes" v-model="editedItem.notes"></v-textarea>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="accent" flat @click="close">Cancel</v-btn>
            <v-btn color="accent" flat @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-spacer></v-spacer>
      <v-text-field
        color="accent"
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="filteredComputers"
      :search="search"
      :custom-filter="customFilter"
      class="elevation-1"
      sort-icon="mdi-menu-down"
      must-sort
      expand
      item-key="empname"
    >
      <template v-slot:items="props">
        <td @click="props.expanded = !props.expanded">{{ props.item.empname }}</td>
        <td class="text-xs-center">{{ props.item.dept }}</td>
        <td class="text-xs-center">{{ props.item.serial }}</td>
        <td class="text-xs-center">{{ props.item.purchdate}}</td>
        <td :class="`text-xs-center status ${ props.item.status } darken-1`">{{ props.item.status }}</td>
        <td class="justify-center layout px-0">
          <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>

          <v-icon small @click="deleteItem(props.item, true)">delete</v-icon>

          <!-- <v-btn color="primary" dark @click.stop="confirmed = true">Open Dialog</v-btn>

          <v-dialog v-model="confirmed" max-width="290">
            <v-card>
              <v-card-title class="headline">Use Google's location service?</v-card-title>

              <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="green darken-1" flat="flat" @click="confirmed = false">Disagree</v-btn>

                <v-btn
                  color="green darken-1"
                  flat="flat"
                  @click="deleteItem(props.item, true)"
                >Agree</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>-->
        </td>
      </template>
      <template v-slot:expand="props">
        <v-card flat color="grey lighten-4">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                OS:
                <span class="accent--text">{{ props.item.os }}</span>
              </v-flex>
              <v-flex xs12 sm6 md4>
                Computer Name:
                <span class="accent--text">{{ props.item.compname }}</span>
              </v-flex>
              <v-flex xs12 sm6 md4>
                Location:
                <span class="accent--text">{{ props.item.location }}</span>
              </v-flex>
              <v-flex xs12>
                Notes:
                <!-- <v-textarea class="accent--text" box :value="props.item.notes"></v-textarea> -->
                <span class="accent--text">{{ props.item.notes }}</span>
              </v-flex>
            </v-layout>
          </v-container>
          <!-- <v-card-text>OS: {{ props.item.os}} Computer Name: {{ props.item.compname }}</v-card-text> -->
        </v-card>
      </template>
      <template v-if="!loading" v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
      <template v-slot:footer>
        <td colspan="5"></td>
        <td>
          <v-layout row wrap justify-center>
            <v-flex xs12 md2>
              <v-switch hide-details v-model="retired_switch" class="pa-3" label="Retired"></v-switch>
            </v-flex>
          </v-layout>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import db from "../firebase/init";

export default {
  data() {
    return {
      loading: true,
      active_switch: false,
      spare_switch: false,
      retired_switch: false,
      dialog: false,
      confirmed: false,
      saved: false,
      search: "",
      headers: [
        {
          text: "Employee Name",
          align: "left",

          value: "empname"
        },
        { text: "Department", value: "dept", align: "center" },
        { text: "Serial #", value: "serial", align: "center" },
        { text: "Purchase Date", value: "purchdate", align: "center" },
        { text: "Status", value: "status", align: "center" },
        { text: "Actions", value: "name", align: "center", sortable: false }
      ],
      selectStatus: ["Active", "Spare", "Retired"],
      computers: [],
      depts: [],
      oses: [],
      locations: [],
      editedIndex: -1,
      editedItem: {
        empname: "",
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      },
      defaultItem: {
        name: "",
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      },
      currentUser: db.app.auth().currentUser.email
    };
  },
  // firestore() {
  //   return {
  //     computers: db.collection("computers")
  //   };
  // },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Computer" : "Edit Computer";
    },
    filteredComputers() {
      return this.computers.filter(computer => {
        if (!this.retired_switch) {
          return computer.status != "Retired";
        } else {
          return true;
        }
      });
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    // this.initialize();

    let ref = db.collection("computers");

    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        console.log(change.type);

        if (change.type == "added") {
          let doc = change.doc;
          this.computers.push({
            id: doc.id,
            empname: doc.data().empname,
            dept: doc.data().dept,
            serial: doc.data().serial,
            purchdate: doc.data().purchdate,
            status: doc.data().status,
            os: doc.data().os,
            location: doc.data().location
          });
        }

        if (change.type === "removed") {
          console.log("Delete triggered");
          console.log(change.doc.data());
          this.computers = this.computers.filter(item => {
            console.log("Item ID:" + item.id);
            console.log("change doc id: " + change.doc.id);
            return item.id != change.doc.id;
          });
        }
      });
    });

    // db.collection("computers")
    //   .get()
    //   .then(snapshot => {
    //     snapshot.forEach(doc => {
    //       let computer = doc.data();
    //       computer.id = doc.id;
    //       this.computers.push(computer);
    //       this.loading = false;
    //     });
    //   });

    db.collection("departments")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let dept = doc.data();
          this.depts = Object.values(dept);
          this.loading = false;
        });
      });

    db.collection("os")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let os = doc.data();
          this.oses = Object.values(os);
          this.loading = false;
        });
      });

    db.collection("locations")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let location = doc.data();
          this.locations = Object.values(location);
          this.loading = false;
        });
      });
  },

  methods: {
    initialize() {
      this.computers = [
        {
          empname: "Hall, Lannie",
          dept: "Sales",
          serial: "CNU2429TK1",
          purchdate: "12/3/2012",
          status: "Spare",
          os: ""
        }
      ];
    },
    customFilter(items, search) {
      return items.filter(
        computer =>
          JSON.stringify(computer)
            .toLowerCase()
            .indexOf(search.toLowerCase()) != -1
      );
    },

    editItem(item) {
      this.editedIndex = this.computers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item, answer) {
      // let deleteComputer = confirm(
      //   "Are you sure you want to delete this item?"
      // );
      let id = item.id;

      if (answer === true) {
        db.collection("computers")
          .doc(id)
          .delete()
          .then(() => {
            this.computers = this.computers.filter(item => {
              return item.id != id;
            });
          });
      }
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.computers[this.editedIndex], this.editedItem);
        console.log("Edited ID: " + this.editedItem.id);
        db.collection("computers")
          .doc(this.editedItem.id)
          .update({
            empname: this.editedItem.empname,
            dept: this.editedItem.dept,
            serial: this.editedItem.serial,
            purchdate: this.editedItem.purchdate,
            status: this.editedItem.status,
            os: this.editedItem.os,
            location: this.editedItem.location,
            notes: this.editedItem.notes
          })
          .then(() => {
            this.close();

            // this.$router.push({ name: "notes" });
          });
      } else {
        // this.computers.push(this.editedItem);
        db.collection("computers")
          .add({
            empname: this.editedItem.empname,
            dept: this.editedItem.dept,
            serial: this.editedItem.serial,
            purchdate: this.editedItem.purchdate,
            status: this.editedItem.status,
            os: this.editedItem.os,
            location: this.editedItem.location,
            notes: this.editedItem.notes
          })
          .then(() => {
            this.close();

            // this.$router.push({ name: "notes" });
          });
      }
      this.close();
    }
  }
};
</script>

<style scoped>
.status.Active {
  color: #43a047;
}

.status.Spare {
  color: #fdd835;
}

.status.Retired {
  color: #e53935;
}
</style>
