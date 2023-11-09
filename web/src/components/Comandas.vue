<template>
  <div>
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
        <v-card color="amber-darken-2" class="fill-height">
          <v-card-title>Lista de comandas</v-card-title>
          <v-card-text>
            <v-card @click="selectComanda(comanda.id)" v-for="(comanda, index) in filteredComandas" :key="index"
              color="white lighten-3" class="mb-3">
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
        <v-card v-for="(producto, index) in this.comandaSeleccionada.lista_productos" :key="index" color="white lighten-3"
          class="mb-3 justify-center">
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
  </div>
</template>
<script>

import { socket, state } from '@/socket.js';
import * as funcionesCM from '@/communicationsManager.js';
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
      comandas: [],
      filteredComandas: [],
      selectedButton: null,
      selectedFilter: null,

    };
  },
  async created() {
    console.log(this.$store.state.user);
    socket.emit('autentificacion', this.$store.state.user);
    await this.fetchComandas();
  },
  methods: {
    clearFilters() {
      this.selectedFilter = null;
      this.filteredComandas = this.comandas;
    },
    async fetchComandas() {
      try {
        this.comandas = await funcionesCM.getComandas();
        this.$store.commit('setComandes', this.comandas);
        this.filteredComandas = this.comandas;
        console.log('Lista comandas: ', this.comandas);
        console.log("Comandas recibidos correctamente")
        return true
      } catch (error) {
        console.error('Error fetching comandas:', error);
        return false
      }
    },
    filterByStatus(status) {
      if (status == null) {
        this.filteredComandas = this.comandas
      }
      else {
        this.selectedFilter = status
        this.filteredComandas = this.$store.state.comandes.filter(comanda => comanda.estado === status)
      }
    },
    aceptarComanda(id) {
      console.log(`Aceptando comanda ${id} ...`);
      try {
        socket.emit('aceptarComanda', { idComanda: id }, (data) => {
          this.fetchComandas().then((isFetchSuccessful) => {
            if (isFetchSuccessful) {
              console.log('Comandas fetched successfully!');
              this.filterByStatus(0)
              
            } else {
              console.log('Failed to fetch comandas.');
            }
          });
          this.$forceUpdate
        });
      } catch (error) {
        console.error('Error emitting aceptarComanda:', error);
      }
    },
    rechazarComanda(id) {
      socket.emit('rechazarComanda', { idComanda: id }, (data) => {
          this.fetchComandas().then((isFetchSuccessful) => {
            if (isFetchSuccessful) {
              console.log('Comandas fetched successfully!');
              this.filterByStatus(0)
              
            } else {
              console.log('Failed to fetch comandas.');
            }
          });
          this.$forceUpdate
        });
    },
    prepararComanda(id) {
      socket.emit('prepararComanda', { idComanda: id }, (data) => {
          this.fetchComandas().then((isFetchSuccessful) => {
            if (isFetchSuccessful) {
              console.log('Comandas fetched successfully!');
              this.filterByStatus(1)
              
            } else {
              console.log('Failed to fetch comandas.');
            }
          });
          this.$forceUpdate
        });
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
      this.comandaSeleccionada = this.$store.state.comandes.find(comanda => comanda.id === comandaId);
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
    logout() {
      this.auth = false;

    },
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