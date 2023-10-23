<template>
  <div>
    <v-app-bar app>
      <v-toolbar-title>Barra superior</v-toolbar-title>


      <v-list class="d-flex">
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

  <v-btn text @click="filterByStatus('pendents')">Pendents</v-btn>
  <v-btn text @click="filterByStatus('en-progres')">En Progrès</v-btn>
  <v-btn text @click="filterByStatus('completades')">Completades</v-btn>
</v-app-bar>

        <v-row class="fill-height">
          <v-col cols="9">
            <v-card color="blue lighten-2" class="fill-height">
              <v-card-title>Lista de comandas</v-card-title>
              <v-card-text>
                <v-card v-for="(comanda, index) in productes" :key="index" color="blue lighten-3" class="mb-3">
                  <v-card-title>{{ comanda.title }}</v-card-title>
                  <v-card-text>{{ comanda.description }}</v-card-text>
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
      currentNavItem: "",
      comandas: [],
      productes: {
    "categories": [
        {
            "id": 1,
            "nom": "Higiene",
            "productes": [
                {
                    "idProducte": 1,
                    "nomProducte": "Pasta de dents",
                    "quantitat": 50,
                    "preu": 1.99,
                    "imatge": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Toothpaste_tube.jpg/1200px-Toothpaste_tube.jpg",
                    "descripció": "Pasta de dents refrescant amb fluor. Garanteix una alèa fresca i una boca saludable."
                },
                {
                    "idProducte": 2,
                    "nomProducte": "Xampú revitalitzant",
                    "quantitat": 30,
                    "preu": 4.49,
                    "imatge": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Shampoo_bottle_1.jpg/1200px-Shampoo_bottle_1.jpg",
                    "descripció": "Xampú que revitalitza i dona brillantor al cabell. Fórmula suau per a un cabell sedós i brillant."
                },
                {
                    "idProducte": 3,
                    "nomProducte": "Llàpiz labial hidratant",
                    "quantitat": 18,
                    "preu": 7.99,
                    "imatge": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Lipstick_02.jpg/1200px-Lipstick_02.jpg",
                    "descripció": "Llàpiz labial amb agents hidratants. Colors vius i llavis suaus i ben cuidats."
                }
            ]
        },
        {
            "id": 2,
            "nom": "Postres",
            "productes": [
                {
                    "idProducte": 4,
                    "nomProducte": "Pastís de xocolata",
                    "quantitat": 15,
                    "preu": 12.99,
                    "imatge": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Chocolate_cake.jpg/1200px-Chocolate_cake.jpg",
                    "descripció": "Pastís de xocolata fosc amb capes de crema."
                },
                {
                    "idProducte": 5,
                    "nomProducte": "Gelat de maduixa",
                    "quantitat": 20,
                    "preu": 5.49,
                    "imatge": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Ice_cream_strawberry.jpg/1200px-Ice_cream_strawberry.jpg",
                    "descripció": "Gelat cremós de maduixa."
                },
                {
                    "idProducte": 6,
                    "nomProducte": "Mousse de vainilla",
                    "quantitat": 18,
                    "preu": 3.79,
                    "imatge": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Mousse_au_chocolat.jpg/1200px-Mousse_au_chocolat.jpg",
                    "descripció": "Mousse lleugera amb gust de vainilla."
                }
            ]
        },
        {
            "id": 3,
            "nom": "Fruta",
            "productes": [
                {
                    "idProducte": 7,
                    "nomProducte": "Poma Gala",
                    "quantitat": 100,
                    "preu": 0.89,
                    "imatge": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Red_apple_on_tree.jpg/1200px-Red_apple_on_tree.jpg",
                    "descripció": "Pomes Gala fresques i dolces."},
                {"idProducte": 8, "nomProducte": "Plàtan", "quantitat": 80, "preu": 1.29, "imatge": "platans.jpg", "descripcio": "Plàtans madurs i llestos per menjar."},
                {"idProducte": 9, "nomProducte": "Maduixes", "quantitat": 50, "preu": 2.99, "imatge": "maduixes.jpg", "descripcio": "Maduixes vermelles i sucoses."}
            ]
        },
        {
            "id": 4,
            "nom": "Verdures",
            "productes": [
                {"idProducte": 10, "nomProducte": "Bròquil", "quantitat": 35, "preu": 1.79, "imatge": "broquil.jpg", "descripcio": "Bròquil fresc i verd."},
                {"idProducte": 11, "nomProducte": "Pastanaga", "quantitat": 45, "preu": 0.99, "imatge": "pastanaga.jpg", "descripcio": "Pastanaga dolça i cruixent."},
                {"idProducte": 12, "nomProducte": "Cogombre", "quantitat": 30, "preu": 1.49, "imatge": "cogombre.jpg", "descripcio": "Cogombre fresc i refrescant."}
            ]   
        },
        {
            "id": 5,
            "nom": "Carne",
            "productes": [
                {"idProducte": 13, "nomProducte": "Filet de pollastre", "quantitat": 20, "preu": 6.99, "imatge": "filet_pollastre.jpg", "descripcio": "Filet de pollastre fresc."},
                {"idProducte": 14, "nomProducte": "Costella de porc", "quantitat": 15, "preu": 8.49, "imatge": "costella_porc.jpg", "descripcio": "Costella de porc marinada."},
                {"idProducte": 15, "nomProducte": "Bistec de vedella", "quantitat": 10, "preu": 12.99, "imatge": "bistec_vedella.jpg", "descripcio": "Bistec de vedella tendre i suculent."}
            ]
        },
        {
            "id": 6,
            "nom": "Begudes",
            "productes": [
                {"idProducte": 16, "nomProducte": "Aigua mineral", "quantitat": 60, "preu": 0.79, "imatge": "aigua_mineral.jpg", "descripcio": "Aigua mineral natural i pura."},
                {"idProducte": 17, "nomProducte": "Suc de taronja", "quantitat": 25, "preu": 2.49, "imatge": "suc_taronja.jpg", "descripcio": "Suc de taronja fresc."},
                {"idProducte": 18, "nomProducte": "Cervesa artesanal", "quantitat": 18, "preu": 3.99, "imatge": "cervesa_artesanal.jpg", "descripcio": "Cervesa artesanal de malta."}
            ]
        },
        {
            "id": 7,
            "nom": "Làctics",
            "productes": [
                {"idProducte": 19, "nomProducte": "Llet sencera", "quantitat": 40, "preu": 1.29, "imatge": "llet_sencera.jpg", "descripcio": "Llet sencera fresca i nutritiva."},
                {"idProducte": 20, "nomProducte": "Iogurt natural", "quantitat": 35, "preu": 0.99, "imatge": "iogurt_natural.jpg", "descripcio": "Iogurt natural sense sucre."},
                {"idProducte": 21, "nomProducte": "Formatge Gruyère", "quantitat": 22, "preu": 6.49, "imatge": "formatge_gruyere.jpg", "descripcio": "Formatge Gruyère suís."}
            ]
        },
        {
            "id": 8,
            "nom": "Cafè i Tè",
            "productes": [
                {"idProducte": 22, "nomProducte": "Cafè mòlt premium", "quantitat": 25, "preu": 5.99, "imatge": "cafe_molt.jpg", "descripcio": "Cafè arabica premium mòlt."},
                {"idProducte": 23, "nomProducte": "Tè negre Earl Grey", "quantitat": 20, "preu": 4.49, "imatge": "te_earl_grey.jpg", "descripcio": "Tè negre aromatitzat amb bergamota."},
                {"idProducte": 24, "nomProducte": "Cafè Espresso Pods", "quantitat": 18, "preu": 7.99, "imatge": "cafe_espresso.jpg", "descripcio": "Cafè espresso en càpsules compatibles."}
            ]
        }
    ]
}
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
