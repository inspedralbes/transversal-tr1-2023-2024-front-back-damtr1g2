<template>
  <div>
    <v-app-bar app>
      <v-toolbar-title>Barra superior</v-toolbar-title>

      
      <v-list class = "d-flex">
        <v-list-item @click="selectNavItem('Comandas')">Comandas</v-list-item>
        <v-list-item @click="selectNavItem('Productes')">Productes</v-list-item>
        <v-list-item @click="selectNavItem('Resum')">Resum</v-list-item>
      </v-list>
      <v-avatar v-if="auth">
        <img :src="userPicture" alt="User Avatar" />
      </v-avatar>

      <v-btn v-if="auth" text @click="logout">Logout</v-btn>
      <v-btn v-else @click="loginOrRegister">{{ auth ? 'Logout' : 'Login/Register' }}</v-btn>
    </v-app-bar>

    
    <!-- Your main content goes here -->

  </div>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      
      <div v-if="currentNavItem === 'Comandas'">
          <v-app-bar app>
            <v-toolbar-title>Comandas Top Bar</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-app-bar>

          <v-row class="fill-height">
            <v-col cols = "9">
              <v-card color="blue lighten-2" class="fill-height">
                <v-card-title>Lista de comandas</v-card-title>
                <v-card-text>
                  
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="3">
              <v-card color="green lighten-2" class="fill-height">
                <v-card-title>Acciones</v-card-title>
                <v-card-text>
                  
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
        <div v-if="currentNavItem === 'Productes'" id="productes">productes</div>
        <div v-if="currentNavItem === 'Resum'" id="resum">resum</div>
      
    </v-responsive>
  </v-container>
</template>

<script>
  export default {
  
    
  
  data() {
    return {
      drawer: false,
      auth: false,
      username: "",
    userPicture: {
      type: String,
      default: "",
    },
    currentNavItem: ""
    };
  },
  methods: {
    selectNavItem(item) {
      this.currentNavItem = item;
      console.log(this.currentNavItem)
    },
  },
};
</script>
