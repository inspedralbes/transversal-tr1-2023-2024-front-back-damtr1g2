<template>
  <div>
    <v-app-bar color="red" app>
      <v-toolbar-title>Barra superior</v-toolbar-title>


      <v-list class="d-flex">
  <v-list-item
    class="appbar_buttons"
    :class="{ 'active': selectedButton === 'Comandas' }"
    @click="selectNavItem('Comandas')"
  >
    Comandas
  </v-list-item>
  <v-list-item
    class="appbar_buttons"
    :class="{ 'active': selectedButton === 'Productes' }"
    @click="selectNavItem('Productes')"
  >
    Productes
  </v-list-item>
  <v-list-item
    class="appbar_buttons"
    :class="{ 'active': selectedButton === 'Resum' }"
    @click="selectNavItem('Resum')"
  >
    Resum
  </v-list-item>
</v-list>
      <v-avatar v-if="auth">
        <img :src="userPicture" alt="User Avatar" />
      </v-avatar>

      <v-btn v-if="auth" text @click="logout">Logout</v-btn>
      <v-btn v-else @click="loginOrRegister">{{ auth ? 'Logout' : 'Login/Register' }}</v-btn>
    </v-app-bar>


    <!-- Your main content goes here -->

  </div>
  <v-container class="fill-height container">
    <v-responsive class=" text-center fill-height">

      <div v-if="currentNavItem === 'Comandas'">
        <v-app-bar app class="filterBar">
          <v-toolbar-title>Comandas Top Bar</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn
  text
  :class="{ 'active': selectedFilter === 'pendents' }"
  @click="filterByStatus('pendents')"
>
  Pendents
</v-btn>
<v-btn
  text
  :class="{ 'active': selectedFilter === 'en-progres' }"
  @click="filterByStatus('en-progres')"
>
  En Progrès
</v-btn>
<v-btn
  text
  :class="{ 'active': selectedFilter === 'completades' }"
  @click="filterByStatus('completades')"
>
  Completades
</v-btn>
        </v-app-bar>

        <v-row class="fill-height comandas-row">
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
            <v-card color="green lighten-2" class="action-panel fill-height">
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
            <v-card color="	antiquewhite " class="prods">
              <v-btn class="afegirProd" @click="handleAccept">Afegir Nou Producte</v-btn>
              <v-card-title>Lista de productes</v-card-title>
              <v-card v-for="(producte, index) in productes" :key="index" color="	antiquewhite " class="mb-3">
                <v-card-title>{{ producte.nom }}</v-card-title>
                <v-img :src="producte.imatge" width="150px" height="auto"></v-img>
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
import { VWindow } from 'vuetify/lib/components/index.mjs';
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
      productes: [1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,0],
      selectedButton: null,
      selectedFilter: null,

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
      this.selectedButton = item;
    },
    flattenData(){
      
    },
    mostrarDialogo(dialogClass) {
      this.dialogVisible = true;
      this.claseDialog = dialogClass;
    },
    cerrarDialog() {
      this.dialogVisible = false;
      this.claseDialog = '';
    },
    saveData() {
      try {
        const obj = {
          nom: this.addInfo.nom,
          descripcio: this.addInfo.descripcio,
          preu: this.addInfo.preu,
          quantitat: this.addInfo.quantitat,
          imatge: this.addInfo.imatge,
          id_categoria: this.addInfo.id_categoria
        }
        funcionesCM.addProducto(this.addInfo)
      } catch {
        console.log('No ha sido posible añadir la información')
      }
    },
    filterByStatus(status) {
    this.selectedFilter = status;
  },
}
}

</script>

<style>
.afegirProd {
  top: 15px;
  margin: 10px;
  position: relative;
}

.appbar_buttons {
  margin: 5px;
}

.container {
max-width: 100vw;
margin-top:5vh;
}

.filterBar{
  position: relative !important;
  
}
.comandas-row{
  margin-top:10vh;
  position: relative;
}

.action-panel{
  height: min-content !important;
  position: fixed !important;
  transform: translateX(50%);

}

.v-container{
  padding: 0;
}

.appbar_buttons.active {
    background-color: lightblue; 
}
  .filterBar .v-btn.active {
    background-color: lightblue; 
}

</style>