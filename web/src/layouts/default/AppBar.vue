<template>
  <div>
    <v-app-bar color="red" app>

      <v-img @click="goTo('/home')" style="cursor: pointer" src="../../assets/fastmarket_logos_black.png" height="50px"
        contain width="50px" position="top left" />
      <v-toolbar-title style="cursor: pointer" @click="goTo('/home')">FASTMARKET</v-toolbar-title>


      <v-list class="d-flex custom-list">
        <v-list-item class="appbar_buttons hidden-sm-and-down" :class="{ 'active': selectedButton === 'Comandas' }"
          @click="goTo('/comandas')">
          Comandas
        </v-list-item>
        <v-list-item class="appbar_buttons hidden-sm-and-down" :class="{ 'active': selectedButton === 'Productes' }"
          @click="goTo('/productes')">
          Productes
        </v-list-item>
        <v-list-item class="appbar_buttons hidden-sm-and-down" :class="{ 'active': selectedButton === 'Resum' }"
          @click="goTo('/estadisticas')">
          Estadisticas
        </v-list-item>
      </v-list>
      <v-avatar class="custom-avatar" v-if="isAuthenticated">
        <img :src="userPicture" alt="User Avatar" />
      </v-avatar>

      <v-btn class="custom-btn" v-if="isAuthenticated" text @click="logout()">Logout</v-btn>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  props: {
    username: {
      type: String,
      default: "username",
    },
    userPicture: {
      type: String,
      default: "",
    },
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
  },
  data() {
    return {
      drawer: false,
      selectedButton: "",
      userPicture: {
        type: String,
        default: "",
      },
    };
  },
  methods: {
    goTo(page) {
      this.$router.push(page)
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    logout() {
      
      this.$store.dispatch('logout')
        .then(() => {
          this.$router.push("/");
        });

    }
  },
};
</script>
<style>
#d-flex {
  background-color: rgba(255, 255, 255, 0);
}
</style>
