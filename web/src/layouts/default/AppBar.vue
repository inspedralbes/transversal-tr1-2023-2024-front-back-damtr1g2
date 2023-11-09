<template>
  <div>
  <v-app-bar id="appbar" color="amber-darken-2" app>
      
      <v-img @click="goTo('/home')" style="cursor: pointer" src="../../assets/fastmarket_logos_black.png" id="imagelogo" v-if="isAuthenticated"/>
      <v-toolbar-title  id="title" style="cursor: pointer" @click="goTo('/home')">FASTMARKET</v-toolbar-title>
        

      <v-list class="d-flex custom-list" background-color="amber-darken-2" v-if="isAuthenticated">
        <v-list-item class="appbar_buttons"
          @click="goTo('/comandas')">
          Comandas
        </v-list-item>
        <v-list-item class="appbar_buttons" :class="{ 'active': selectedButton === 'Productes' }"
          @click="goTo('/productes')">
          Productes
        </v-list-item>
        <v-list-item class="appbar_buttonsn" :class="{ 'active': selectedButton === 'Resum' }"
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
import * as funcionesCM from '@/communicationsManager.js';
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
      funcionesCM.logout
      this.$store.dispatch('logout')
        .then(() => {
          this.$router.push("/");
        });

    }
  },
};
</script>
<style scoped>
#title {
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  font-size: 24px;
  left: 45%;
}
#appbar {
  height: 5em;
  padding: 5px;
}
#imageLogo {
  height: auto;
  width:10% !important;
}
</style>
