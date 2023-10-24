<template>
  <div>
    <v-app-bar color="red" app>
      <v-toolbar-title>Barra superior</v-toolbar-title>


      <v-list class="d-flex" color="red">
        <v-list-item class="appbar_buttons" @click="selectNavItem('Comandas')">Comandas</v-list-item>
        <v-list-item class="appbar_buttons" @click="selectNavItem('Productes')">Productes</v-list-item>
        <v-list-item class="appbar_buttons" @click="selectNavItem('Resum')">Resum</v-list-item>
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

  <v-btn text @click="filterByStatus('pendents')">Pendents</v-btn>
  <v-btn text @click="filterByStatus('en-progres')">En Progrès</v-btn>
  <v-btn text @click="filterByStatus('completades')">Completades</v-btn>
</v-app-bar>

        <v-row class="fill-height">
          <v-col cols="9">
            <v-card color="blue lighten-2" class="fill-height">
              <v-card-title>Lista de comandas</v-card-title>
              <v-card-text>
                <v-card v-for="(producte, index) in productes" :key="index" color="blue lighten-3" class="mb-3">
                  <v-card-title>{{ producte.nom }}</v-card-title>
                  <v-card-text>{{ producte.description }}</v-card-text>
                </v-card>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="3">
            <v-card color="green lighten-2" class="fill-height">
              <v-card-title>Accions</v-card-title>
              <v-card-text class="d-flex flex-column">
                <v-btn @click="handleAccept">Acceptar</v-btn>
                <v-btn @click="handleReject">Rebutjar</v-btn>
                <v-btn @click="completarComanda">Completar</v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
      <div v-if="currentNavItem === 'Productes'" id="productes">
      <v-row class="fill-height">
          <v-col cols="9">
            <v-card color="blue lighten-2" class="fill-height">
              <v-card-title>Lista de productes</v-card-title>
                <v-card v-for="(producte, index) in this.productes" :key="index" color="blue lighten-3" class="mb-3">
                  <v-card-title >{{ producte.nom }}</v-card-title>
                  <v-card-image :src="producte.imatge"></v-card-image>
                  <v-btn @click="UpdateData">Actualitzar</v-btn>
                  <v-btn @click="DeleteData">Esborrar</v-btn>
                </v-card>
            </v-card>
          </v-col>
          <v-col cols="3">
            
          </v-col>
        </v-row>
      </div>
      <div v-if="currentNavItem === 'Resum'" id="resum">resum</div>

    </v-responsive>
  </v-container>
</template>

<script>
import { getProductes } from '@/communicationsManager.js';
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
      currentNavItem: "",
      comandas: [],
      productes: []
    };
  },
  async created() {
    
        try {
          this.productes = await getProductes();
          console.log(this.productes);
          console.log("Productos recibidos correctamente")
        } catch (error) {
          console.error('Error fetching questions:', error);
        }
      },
  methods: {
    selectNavItem(item) {
      this.currentNavItem = item;
      console.log(flattenedData())
    }},
    flattenData(){
      
    }
};

</script>

<style>
  .d-flex {
    color: red;
  }
  .appbar_buttons {
    margin: 5px;
  }
</style>