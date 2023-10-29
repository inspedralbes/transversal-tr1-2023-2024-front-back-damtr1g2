<template>
  <div>
    <v-app-bar color="red" app>
      <v-toolbar-title style="cursor: pointer" @click="selectNavItem('')">FASTMARKET</v-toolbar-title>


      <v-list class="d-flex">
        <v-list-item class="appbar_buttons" :class="{ 'active': selectedButton === 'Comandas' }"
          @click="selectNavItem('Comandas')">
          Comandas
        </v-list-item>
        <v-list-item class="appbar_buttons" :class="{ 'active': selectedButton === 'Productes' }"
          @click="selectNavItem('Productes')">
          Productes
        </v-list-item>
        <v-list-item class="appbar_buttons" :class="{ 'active': selectedButton === 'Resum' }"
          @click="selectNavItem('Resum')">
          Resum
        </v-list-item>
      </v-list>
      <v-avatar v-if="auth">
        <img :src="userPicture" alt="User Avatar" />
      </v-avatar>

      <v-btn v-if="auth" text @click="logout()">Logout</v-btn>
      <v-btn v-else @click="loginOrRegister">{{ auth ? 'Logout' : 'Login/Register' }}</v-btn>
    </v-app-bar>



  </div>
  <v-container class="fill-height container">
    <v-responsive class=" text-center fill-height">
      <div v-if="auth">
        <div v-if="currentNavItem === ''">
          <v-card>
            <h1>Bienvenido a FastMarket</h1>
          </v-card>

        </div>
        <div v-if="currentNavItem === 'Comandas'">
          <v-app-bar app class="filterBar">
            <v-toolbar-title>Comandas Top Bar</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-btn text :class="{ 'active': selectedFilter === 0 }" @click="filterByStatus(0)"><!--Pendiente-->
              Pendents
            </v-btn>
            <v-btn text :class="{ 'active': selectedFilter === 1 }" @click="filterByStatus(1)"><!--Preparacion-->
              En preparació
            </v-btn>
            <v-btn text :class="{ 'active': selectedFilter === 2 }" @click="filterByStatus(2)"><!--Listo-->
              Llest
            </v-btn>
            <v-btn text :class="{ 'active': selectedFilter === 3 }" @click="filterByStatus(3)"><!--Recogido-->
              Recogit
            </v-btn>
          </v-app-bar>

        <v-row class="fill-height comandas-row">
          <v-col cols="13">
            <v-card color="blue lighten-2" class="fill-height">
              <v-card-title>Lista de comandas</v-card-title>
              <v-card-text>
                <v-card  @click="selectComanda(comanda.id)" v-for="(comanda, index) in filteredComandas" :key="index" color="white lighten-3" class="mb-3">
                  <v-card-text>Comanda {{ comanda.id }}</v-card-text>
                  
                  <v-btn variant="plain" @click="mostrarDatosComanda(comanda.id)">Datos Comanda</v-btn>
                  <v-btn v-if="selectedFilter === 0" @click="aceptarComanda(comanda.id)">Aceptar</v-btn>
                  <v-btn v-if="selectedFilter === 0" @click="rechazarComanda(comanda.id)">Rechazar</v-btn>
                  <v-btn v-if="selectedFilter === 1" @click="prepararComanda(comanda.id)">Preparado para recoger</v-btn>
                </v-card>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-dialog class="dialogProds" v-model="dialogComVisible">
            <!--COMANDAINFO-->
            <v-card class="justify-center">
              <v-card-title>DATOS COMANDA</v-card-title>
              <v-card v-for="(producto,index) in this.comandaSeleccionada.lista_productos" :key="index" color="white lighten-3" class="mb-3 justify-center">
              <v-card-text>
                <v-row class="fill-height">
                  <v-col cols="3">
                    <v-img :src="producto.imatge" width="100px" height="auto"></v-img>
                  </v-col>
                  <v-col cols="4">
                    <v-card-text class="nom" label="Nom">{{ producto.nom }}</v-card-text>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-card-text class="nom" label="Preu">Precio Individual: {{ producto.preu }}€</v-card-text>
                  </v-col>
                  <v-col cols="4">
                    <v-card-text class="nom" label="Quantitat">Cantidad: {{ producto.quantitat }}</v-card-text>
                  </v-col>
                  <v-col cols="4">
                    <v-card-text class="nom" label="PreuTotal">Precio Total: {{ producto.preuTotal }}€</v-card-text>
                  </v-col>
                </v-row>
              </v-card-text>
              
            </v-card>
            <v-btn @click="cerrarDialog()">Salir</v-btn>
          </v-card>
        </v-dialog>
<!--SECCION PRODUCTES-->
      </div>
      <div v-if="currentNavItem === 'Productes'" id="productes">
        <v-row class="fill-height">
          <v-col cols="9">
            <v-card color="	antiquewhite " class="prods">
              <v-btn class="afegirProd" @click="mostrarDialogo('addDialog', null)">Afegir Nou Producte</v-btn>
              <v-card-title>Lista de productes</v-card-title>
              <v-card v-for="(producte, index) in productes" :key="index" color="	antiquewhite " class="mb-3">
                <v-card-title>{{ producte.nom }}</v-card-title>
                <v-img :src="producte.imatge" width="150px" height="auto"></v-img>
                <v-btn @click="mostrarDialogo('editDialog', producte.id)">Actualitzar</v-btn>
                <v-btn @click="deleteData(producte.id)">Esborrar</v-btn>
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
                  <v-text-field required class="icategoria" label="Id Categoría"
                    v-model="addInfo.id_categoria"></v-text-field>
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
                  <v-text-field required class="icategoria" label="Id Categoría"
                    v-model="editInfo.campoCat"></v-text-field>
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
      </div>
      <div v-else>
        <v-card>
          <h1>Identifica't</h1>
        </v-card>
        <v-form validate-on="submit lazy" @submit.prevent="submit">
          <v-responsive class="mx-auto" max-width="30rem" style="margin-top: 10em;">
            <v-alert v-if="loginInvalid" density="compact" type="error" title="Error"
              text="Usuari o contrasenya incorrectes" style="margin-bottom: 1em;"></v-alert>
            <v-text-field hide-details="auto" label="Correu electrònic" placeholder="example@gmail.com"
              :rules="[rules.required]" type="email" v-model="usuari.email"></v-text-field>
            <v-text-field style="margin-top: 1em;" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required]" :type="show1 ? 'text' : 'password'" label="Contrasenya"
              @click:append="show1 = !show1" @input="handleHashing($event.target.value)"></v-text-field>
          </v-responsive>

          <v-btn :loading="loading" type="submit" style="margin-top: 1em;"> Iniciar sessió</v-btn>
        </v-form>
      </div>
    </v-responsive>
  </v-container>
</template>
<script>
import io from 'socket.io-client';
  const socket = io('http://dam.inspedralbes.cat:3593');
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
    await this.fetchComandas();
  },
  methods: {

    selectNavItem(item) {
      this.currentNavItem = item;
      this.selectedButton = item;
      console.log(flattenedData())
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
    async fetchComandas() {
      try {
        this.comandas = await funcionesCM.getComandas();
        console.log('Lista comandas: ', this.comandas);
        console.log("Comandas recibidos correctamente")
      } catch (error) {
        console.error('Error fetching comandas:', error);
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

        funcionesCM.addProducto(this.addInfo).then((response) => {
          this.cerrarDialog()
          console.log(response)
          this.productes = funcionesCM.getProductes();
          this.$forceUpdate();
        }).catch((error) => {
          this.cerrarDialog()
          console.error("Error:", error);
        });
      } catch (error) {
        console.log('No ha sido posible añadir la información' + error)
      }
      this.cerrarDialog()
      console.log("cerrando dialog")

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


        funcionesCM.updateProducto(obj).then((response) => {
          this.productes = funcionesCM.getProductes();
          console.log("Response: ", response)

        });
        this.cerrarDialog()


      } catch {
        console.log('No ha sido posible actualizar la información')
      }
    },
    async deleteData(productId) {
      funcionesCM.deleteProducto(productId)
      this.productes = funcionesCM.getProductes().then((response) => {
        console.log(response)
        console.log(this.productes);
      });

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

