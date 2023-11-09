<template>
  <div id="productes">
    <v-app>
      <v-container class="container">
    <v-btn absolute dark fab color="lightgreen"  class="afegirProd" 
    @click="mostrarDialogo('addDialog', null)"><v-icon color="white">mdi-plus</v-icon></v-btn>
    <v-row>
          <v-col v-for="(producte, index) in productes" :key="index" cols="12" sm="6" md="4" lg="3">
            <v-card class="product-card"  @mouseover="hoverProduct(index)" @mouseleave="unhoverProduct(index)">
              <div class="product-info">
                <v-card-title>{{ producte.nom }}</v-card-title>
                <v-img :src="producte.imatge"  class="product-image"></v-img>
              </div>
              <div class="hover-buttons" :class="{ active: hoveredIndex === index }">
                  <div class="button-row">
                    <v-btn @click="mostrarDialogo('editDialog', producte.id)" icon class="blue-circle">
                      <v-icon color="white">mdi-update</v-icon>
                    </v-btn>
                    <v-btn @click="deleteData(producte.id)" icon class="red-circle">
                      <v-icon color="white">mdi-delete</v-icon>
                    </v-btn>
                  </div>
                  <div class="checkbox-row">
                    <v-checkbox v-model="producte.activado" class="checkbox" label="Activo"></v-checkbox>
                  </div>
                </div>
                
                
              
              
            </v-card>
          </v-col>
        </v-row>
        <!--DIALOG TO ADD AND EDIT-->
        <v-dialog :class="claseDialog" v-model="dialogVisible">
          <v-form>
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
                  item-text="value"
                  item-value="key"
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
      </v-container>
      </v-app>
    </div>
    <v-dialog width="500" v-model="errorDialogVisible">
        
      
        
        <v-card title="Dialog">
          <v-card-text>
          Aquest producte està en us en comandes i no es pot esborrar, pots deshabilitar-ho  
          </v-card-text>
    
          <v-card-actions>
            <v-spacer></v-spacer>
    
            <v-btn
              text="Close Dialog"
              @click=closeDialog()
            ></v-btn>
          </v-card-actions>
        </v-card>
      
    </v-dialog>
</template>
<script>
import io from 'socket.io-client';
  const socket = io();
  import * as funcionesCM from '@/communicationsManager.js';
  import { VWindow } from 'vuetify/lib/components/index.mjs';

import md5 from 'md5';

export default {



data() {
  return {
    hoveredIndex: null,
    errorDialogVisible: false,
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
    options: new Map(),
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
    this.parseNumericToBoolean();
    console.log(this.productes);
  },
  methods: {
    hoverProduct(index) {
      this.hoveredIndex = index;
    },
    unhoverProduct(index) {
      this.hoveredIndex = null;
    },
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
        const optionsJson = await funcionesCM.getCategorias();
        this.options = new Map(optionsJson.map(item => [item.id, item.nom]));
        console.log("Categorías: ",this.options)
        console.log('Lista categorías: ', namesArray);
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
    parseNumericToBoolean() {
      this.productes = this.productes.map((item) => ({
        ...item,
        activado: item.activado === 1,
        
      }));
      console.log(this.productes)
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
      let res = await  funcionesCM.deleteProducto(productId)
      if(res.status == 500){
        this.openDialog()
      }
    /*funcionesCM.deleteProducto(productId).then(result => {
        console.log("result: "+result)
    if (result) {
      
      this.openDialog()
      
    }
    
  })*/
      
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
    },
    openDialog() {
      this.errorDialogVisible = true;
      console.log("opening dialog")
    },
    closeDialog() {
      this.errorDialogVisible = false;
    },
    
  }
}

</script>

<style>
.product-card {
  margin: 10px;
  border: 2px solid #3498db;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  transition: box-shadow 0.3s;
}

.product-card:hover {
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.hover-buttons {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(3px);
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: 8px;
}
.checkbox {
  position: absolute;
  top: 20px; /* Adjust the top value to position the checkbox vertically */
  left: 50%;
  transform: translateX(-50%);
}
.hover-buttons.active {
  opacity: 1;
}

.button-row v-btn {
  margin: 10px;
}


.product-info {
  flex: 1;
  text-align: center; 
  margin-bottom: 16px;
}
.product-buttons {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
.container {
  max-width: 100vw;
  margin-top: 5vh;
  position: relative;
}
.product-card {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .product-info {
    flex: 1; /* This will make the info take the remaining space */
  }
  
  .product-buttons {
    display: flex;
    flex-direction: row;
  }
.red-circle, .blue-circle {
    background-color: transparent;
    margin-bottom: 8px;;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-right: 8px; 
  }

  .red-circle {
    background-color: red;
  }

  .blue-circle {
    background-color: blue;
  }
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


.appbar_buttons {
margin: 5px;
}

.afegirProd {
  background-color: lightgreen;
  color: white;
bottom: 15px;
right: 15px;
margin: 10px;
position: fixed;
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
</style>