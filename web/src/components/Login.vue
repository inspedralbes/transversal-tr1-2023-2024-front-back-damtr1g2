<template>
  <v-app id="back_container">
    <v-content class="fill-height">
    <v-container  fluid >
      <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="8">
            <v-card class="elevation-12 mt-15">
              <v-window>
                <v-window-item>
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-card-text class="mt-12">
                        <h1 class="custom-header text-center display-2 amber-darken-2 24">Identifica't</h1>
                        <h4 class="text-center mt-10">Interfaç de administració y gestió</h4>
                      <v-form validate-on="submit lazy" @submit.prevent="submit">
                        <v-responsive class="mx-auto" max-width="30rem" style="margin-top: 8em;">
                          <v-alert v-if="loginInvalid" density="compact" type="error" title="Error"
                            text="Usuari o contrasenya incorrectes" style="margin-bottom: 1em;"></v-alert>
                          <v-text-field prepend-icon="mdi-email" color="amber-darken-2" hide-details="auto" label="Correu electrònic" placeholder="example@gmail.com"
                            :rules="[rules.required]" type="email" v-model="usuari.email"></v-text-field>
                          <v-text-field prepend-icon="mdi-lock" color="amber-darken-2" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :rules="[rules.required]" :type="show1 ? 'text' : 'password'" label="Contrasenya"
                            @click:append="show1 = !show1" @input="handleHashing($event.target.value)"></v-text-field>
                        </v-responsive>
                        
                          <div class="text-center mt-3">
                            <v-btn rounded color="amber-darken-2" dark :loading="loading" type="submit"> Iniciar sessió</v-btn>
                          </div>
                      </v-form>

                    </v-card-text>
                  </v-col>
                    
                  <v-col class="logoCol">
                    <v-img src="..\assets\fastmarket_logos_black.png"/>
                  </v-col>
                    </v-row>
              </v-window-item>
            </v-window>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
  </v-app>
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
        username: "",
        opcioSeleccionada: undefined,
        selectedButton: '',
        userPicture: {
          type: String,
          default: "",
        },
        selectedButton: null,
  
      };
    },
    methods: {
      logout() {
        funcionesCM.logout
        this.$store.dispatch('logout')
        .then(() => {
          this.$router.push("/"); 
        });
      },
      async submit() {
        this.loading = true
  
      this.$store.commit('setEmail', this.usuari.email);
      this.$store.commit('setPassword', this.usuari.password);

      this.$store.dispatch('login')
        .then((isAuthenticated) => {
          this.loading = false;
          if (isAuthenticated) {
            this.loginInvalid = false;
            this.$router.push("/home"); 
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
  
  <style scoped>
  #back_container {
    background-image: url("..\assets\backgroundLogin.webp");
    background-size: cover;
    background-position: center;
    min-height: 100vh;
  }
  .custom-header {
    font-size: 5em;
    color: orange;
  }
  .logoCol {
    background-color: orange;   
    text-align: center;
    padding: 2em;
  }
  .logoCol img {
    max-width: 100%;
    height: auto;
  }

  .appbar_buttons {
    margin: 5px;
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
  
  </style>