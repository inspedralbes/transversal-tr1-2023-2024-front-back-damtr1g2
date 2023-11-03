<template>
  <div id="productes">
      <v-row class="fill-height">
        <v-col cols="9">
          <v-card color="	antiquewhite " class="prods">
            <v-btn class="afegirProd" @click="mostrarDialogo('addDialog', null)">Afegir Nou Producte</v-btn>
            <v-card-title>Lista de productes</v-card-title>
            <v-card v-for="(producte, index) in productes" :key="index" color="	antiquewhite " class="mb-3">
              <div :disabled="!producte.activado">
                <v-card-title>{{ producte.nom }}</v-card-title>
                <v-img :src="producte.imatge" width="150px" height="auto"></v-img>
                <v-btn @click="mostrarDialogo('editDialog', producte.id)">Actualitzar</v-btn>
                <v-btn @click="deleteData(producte.id)">Esborrar</v-btn>
              </div>
              <v-checkbox v-model="producte.activado" @click="cambiarActivo(producte.id, producte.activado)" label="Activo"></v-checkbox>
            </v-card>
          </v-card>
        </v-col>
        <v-col cols="3">

          </v-col>
        </v-row>
        <!--DIALOG TO ADD AND EDIT-->
        <v-dialog :class="claseDialog" v-model="dialogVisible">
          <v-form v-model="valido">
            <!--ADD-->
            <v-card v-if="claseDialog === 'addDialog'">
              <v-card-title>Afegeix un nou producte</v-card-title>
              <v-card-text>
                <v-text-field required class="nom" label="Nom" v-model="addInfo.nom"></v-text-field>
                <v-text-field required class="descripcio" label="Descripcio"
                  v-model="addInfo.descripcio"></v-text-field>
                <v-text-field required class="preu" label="Preu" v-model="addInfo.preu"></v-text-field>
                <v-text-field required class="quantitat" label="Quantitat" v-model="addInfo.quantitat"></v-text-field>
                <v-text-field required class="imatge" label="Imatge" v-model="addInfo.imatge"></v-text-field>
                <v-select
                  v-model="addInfo.id_categoria"
                  :items="this.options"
                  item-text="options.nom"
                  item-value="options.id"
                  label="Categoría"
                  return-object
                  single-line
                ></v-select>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="cerrarDialog()">Cancelar</v-btn>
                <v-btn @click="addData()">Guardar</v-btn>
              </v-card-actions>
            </v-card>
            <!--EDIT-->
            <v-card v-if="claseDialog === 'editDialog'">
              <v-card-title>Editar producte</v-card-title>
              <v-card-text>
                <v-text-field required class="nom" label="Nom" v-model="editInfo.campoNom"></v-text-field>
                <v-text-field required class="descripcio" label="Descripcio"
                  v-model="editInfo.campoDesc"></v-text-field>
                <v-text-field required class="preu" label="Preu" v-model="editInfo.campoPreu"></v-text-field>
                <v-text-field required class="quantitat" label="Quantitat"
                  v-model="editInfo.campoQuantitat"></v-text-field>
                <v-text-field required class="imatge" label="Imatge" v-model="editInfo.campoImg"></v-text-field>
                <v-select
                  v-model="editInfo.id_categoria"
                  :items="this.options"
                  item-text="nom"
                  item-value="id"
                  label="Categoría"
                  return-object
                  single-line
                ></v-select>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="cerrarDialog()">Cancelar</v-btn>
                <v-btn @click="editData()">Guardar</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>

      
    </div>
</template>
<script>
import io from 'socket.io-client';
  const socket = io('http://localhost:3539');
  import * as funcionesCM from '@/communicationsManager.js';
  import { VWindow } from 'vuetify/lib/components/index.mjs';

import md5 from 'md5';
export default {



data() {
  return {
    loginInvalid: false,
    usuari: {
      nom: '',
      cognoms: '',
      email: '',
      password: '',
    },
    loading: false,
    show1: false,
    rules: {
      required: value => !!value || 'Requerit'
    },
    drawer: false,
    auth: false,
    dialogVisible: false,
    dialogComVisible: false,
    claseDialog: "",
    username: "",
      estadoComanda: null,
      comandaSeleccionada: undefined,
    options:[],
    opcioSeleccionada: undefined,
      selectedFilter: null,
    selectedButton: '',
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
    filteredComandas: [],
    productes: [],
    selectedButton: null,
    selectedFilter: null,

  };
},
  async created() {
    
    await this.fetchProductes();
    await this.fetchCategorias();
  },
  methods: {
    clearFilters(){
      this.selectedFilter=null;
      this.filteredComandas = this.comandas;
    },
    async fetchProductes() {
      try {
        this.productes = await funcionesCM.getProductes();
        console.log('Lista productos: ', this.productes);
        console.log("Productos recibidos correctamente")
      } catch (error) {
        console.error('Error fetching productos:', error);
      }
    },
    async fetchCategorias() {
      try {
        this.options = await funcionesCM.getCategorias();
        this.options = this.options.sort((a, b) => a.id - b.id);
        console.log('Lista categorías: ', this.options['']);
        console.log("Categorías recibidas correctamente")
      } catch (error) {
        console.error('Error fetching categorias:', error);
      }
    },
    filterByStatus(status){
      if (status == null) {
        this.filteredComandas = this.comandas
      }
      else {
        this.selectedFilter = status
        this.filteredComandas = this.comandas.filter(comanda => comanda.estado === status)
      }
    },
    aceptarComanda(id) {
      socket.emit('aceptarComanda', id)
    },
    rechazarComanda(id) {
      socket.emit('rechazarComanda', id)
    },
    prepararComanda(id) {
      socket.emit('prepararComanda', id)
    },
    mostrarDialogo(dialogClass, producteId) {

    console.log(`ID del producto a editar: `, producteId)
    if (producteId != null) {
      this.opcioSeleccionada = producteId
      const selectedProd = this.productes.find(product => product.id === producteId);
      console.log(`Producto a editar: `, selectedProd)
      this.editInfo = {
        campoNom: selectedProd.nom,
        campoDesc: selectedProd.descripcio,
        campoPreu: selectedProd.preu,
        campoQuantitat: selectedProd.quantitat,
        campoImg: selectedProd.imatge,
        campoCat: selectedProd.id_categoria,
        campoId: selectedProd.id
      }
    }
    this.dialogVisible = true;
    this.claseDialog = dialogClass;
  },
    selectComanda(id) {
      this.estadoComanda = id
    },
  cerrarDialog() {
    this.dialogVisible = false;
    this.dialogComVisible = false;
    this.claseDialog = '';
    },
    mostrarDatosComanda(comandaId) {
      this.comandaSeleccionada = this.comandas.find(comanda => comanda.id === comandaId);
      console.log(this.comandaSeleccionada)
      if (this.comandaSeleccionada && this.comandaSeleccionada.lista_productos) {
        this.dialogComVisible = true
      }
      else {
        console.error('Undefined comanda or lista_productos')
      }

  },
  cambiarActivo(id, activo) {
  const product = this.productes.find((p) => p.id === id);
  if (product) {
    product.activado = activo;
  }
    funcionesCM.productoActivado(id,activo)
    .then(() => {
    })
    .catch((error) => {
      console.error('Error updating activado:', error);
    });
  },
  async addData() {
    try {
      const obj = {
        nom: this.addInfo.nom,
        descripcio: this.addInfo.descripcio,
        preu: this.addInfo.preu,
        quantitat: this.addInfo.quantitat,
        imatge: this.addInfo.imatge,
        id_categoria: this.addInfo.id_categoria
      }

        await funcionesCM.addProducto(this.addInfo).then((response) => {
          
          
          console.log("añadiendo producto")
          this.cerrarDialog()
        }).catch((error) => {
          this.cerrarDialog()
          console.error("Error:", error);
        });
       

        await this.fetchProductes();
        
        
      } catch (error) {
        console.log('No ha sido posible añadir la información' + error)
      }
      

  },
  async editData() {
    try {
      const obj = {
        nom: this.editInfo.campoNom,
        descripcio: this.editInfo.campoDesc,
        preu: this.editInfo.campoPreu,
        quantitat: this.editInfo.campoQuantitat,
        imatge: this.editInfo.campoImg,
        id_categoria: this.editInfo.campoCat,
        id: this.editInfo.campoId
      }
      console.log()


        await funcionesCM.updateProducto(obj).then((response) => {
          
          console.log("Response: ", response)

        });
        await this.fetchProductes()
        this.cerrarDialog()
        

      } catch {
        console.log('No ha sido posible actualizar la información')
      }
    },
    async deleteData(productId) {
      await funcionesCM.deleteProducto(productId)
      this.fetchProductes();
      },
    logout() {
      this.auth = false;
    },
    async submit() {
      this.loading = true

      funcionesCM.login(this.usuari).then((response) => response.json())
        .then((data) => {
          this.usuari = data;
          this.loading = false;
          if (this.usuari.email != '') {
            this.loginInvalid = false;
            this.auth = true;
          } else {
            this.loginInvalid = true;
          }
        });


    },
    handleHashing(data) {
      this.usuari.password = md5(data).toUpperCase()
    }
    
  }
}

</script>

<style>
.dialogProds {
width: auto;
}

.addDialog {
width: 500px;
}

.editDialog {
width: 500px;
}

.descripcion {
height: 100px;
}

.afegirProd {
top: 15px;
margin: 10px;
position: relative;
}

.appbar_buttons {
margin: 5px;
}

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
margin-top: 5vh;
}

.filterBar {
position: relative !important;

}

.productes-row {
margin-top: 9vh;
margin-bottom: 10vh;
position: relative;
}

.comandas-row {
margin-top: 10vh;
position: relative;
}

.action-panel {
height: min-content !important;
position: fixed !important;
transform: translateX(50%);

}

.v-container {
padding: 0;
}

.appbar_buttons.active {
background-color: lightblue;
}

.filterBar .v-btn.active {
background-color: lightblue;
}
</style>