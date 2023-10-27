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
        <v-row class="fill-height productes-row">
          <v-col cols="9">
            <v-card color="	antiquewhite " class="prods">
              <v-btn class="afegirProd" @click="mostrarDialogo('addDialog', null)">Afegir Nou Producte</v-btn>
              <v-card-title>Lista de productes</v-card-title>
              <v-card v-for="(producte, index) in productes" :key="index" color="	antiquewhite " class="mb-3">
                <v-card-title>{{ producte.nom }}</v-card-title>
                <v-img :src="producte.imatge" width="150px" height="auto"></v-img>
                <v-btn class="editarProd" @click="mostrarDialogo('editDialog', producte.id)">Actualitzar</v-btn>
                <v-btn @click="DeleteData">Esborrar</v-btn>
              </v-card>
            </v-card>
          </v-col>
          <v-col cols="3">

          </v-col>
        </v-row>
        <v-dialog :class="claseDialog" v-model="dialogVisible">
          <v-form v-model="valido">
          <v-card v-if="claseDialog === 'addDialog'">
            <v-card-title>Afegeix un nou producte</v-card-title>
            <v-card-text>
              <v-text-field required class="nom" label="Nom" v-model="addInfo.nom"></v-text-field>
              <v-text-field required class="descripcio" label="Descripcio" v-model="addInfo.descripcio"></v-text-field>
              <v-text-field required class="preu" label="Preu" v-model="addInfo.preu"></v-text-field>
              <v-text-field required class="quantitat" label="Quantitat" v-model="addInfo.quantitat"></v-text-field>
              <v-text-field required class="imatge" label="Imatge" v-model="addInfo.imatge"></v-text-field>
              <v-text-field required class="icategoria" label="Id Categoría" v-model="addInfo.id_categoria"></v-text-field>
            </v-card-text>
            <v-card-actions>
            <v-btn @click="cerrarDialog()">Cancelar</v-btn>
            <v-btn @click="addData()">Guardar</v-btn>
          </v-card-actions>
          </v-card>
          <v-card v-if="claseDialog === 'editDialog'">
            <v-card-title>Editar producte</v-card-title>
            <v-card-text>
              <v-text-field required class="nom" label="Nom" v-model="editInfo.campoNom"></v-text-field>
              <v-text-field required class="descripcio" label="Descripcio" v-model="editInfo.campoDesc"></v-text-field>
              <v-text-field required class="preu" label="Preu" v-model="editInfo.campoPreu"></v-text-field>
              <v-text-field required class="quantitat" label="Quantitat" v-model="editInfo.campoQuantitat"></v-text-field>
              <v-text-field required class="imatge" label="Imatge" v-model="editInfo.campoImg"></v-text-field>
              <v-text-field required class="icategoria" label="Id Categoría" v-model="editInfo.campoCat"></v-text-field>
            </v-card-text>
            <v-card-actions>
            <v-btn @click="cerrarDialog()">Cancelar</v-btn>
            <v-btn @click="editData()">Guardar</v-btn>
          </v-card-actions>
          </v-card>
        </v-form>
        </v-dialog>
        
      </div>
      <div v-if="currentNavItem === 'Resum'" id="resum">resum</div>

    </v-responsive>
  </v-container>
</template>

<script>
import * as funcionesCM from '@/communicationsManager.js';
import { VWindow } from 'vuetify/lib/components/index.mjs';
export default {



  data() {
    return {
      drawer: false,
      auth: false,
      dialogVisible: false,
      claseDialog: "",
      username: "",
      opcioSeleccionada: undefined,
      userPicture: {
        type: String,
        default: "",
      },
      addInfo: {
        campoNom: undefined,
        campoDesc: undefined,
        campoPreu: null,
        campoQuantitat: null,
        campoImg: undefined,
        campoCat: null
      },
      editInfo: {
        campoNom: '',
        campoDesc: '',
        campoPreu: null,
        campoQuantitat: null,
        campoImg: '',
        campoCat: null
      },
      currentNavItem: "",
      comandas: [],
      productes: [] ,
      selectedButton: null,
      selectedFilter: null,

    };
  },
  async created() {

    try {
      this.productes = await funcionesCM.getProductes();
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
    },
    flattenData(){
      
    },
    mostrarDialogo(dialogClass, producteId) {
      console.log(`ID del producto a editar: `,producteId)
      if (producteId!=null) {
        this.opcioSeleccionada = producteId
        const selectedProd = this.productes.find(product => product.id = producteId);
        console.log(`Producto a editar: `,selectedProd)
        this.editInfo = {
          campoNom: selectedProd.nom,
          campoDesc: selectedProd.descripcio,
          campoPreu: selectedProd.preu,
          campoQuantitat: selectedProd.quantitat,
          campoImg: selectedProd.imatge,
          campoCat: selectedProd.id_categoria
        }
      }
      this.dialogVisible = true;
      this.claseDialog = dialogClass;
    },
    cerrarDialog() {
      this.dialogVisible = false;
      this.claseDialog = '';
    },
    async addData() {
      try {
        await funcionesCM.addProducto(this.addInfo)
        dialogVisible = false
      } catch {
        console.log('No ha sido posible añadir la información')
      }
    },
    editData() {
      try {
        
        funcionesCM.updateProducto(this.editInfo, this.opcioSeleccionada);
        
      } catch {
        console.log('No ha sido posible actualizar la información')
      }
    }
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
.productes-row {
  margin-top:9vh;
  margin-bottom:10vh;
  position: relative;
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