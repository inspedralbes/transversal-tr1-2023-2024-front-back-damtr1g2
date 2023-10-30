<template>
    <v-container class="fill-height container">
      <v-responsive class=" text-center fill-height">
        
        <div>
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
        username: "",
        opcioSeleccionada: undefined,
        selectedButton: '',
        userPicture: {
          type: String,
          default: "",
        },
        comandas: [],
        filteredComandas: [],
        productes: [],
        selectedButton: null,
  
      };
    },
    methods: {
      async fetchComandas() {
        try {
          this.comandas = await funcionesCM.getComandas();
          this.filteredComandas = this.comandas;
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
              this.$router.push("/home")

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