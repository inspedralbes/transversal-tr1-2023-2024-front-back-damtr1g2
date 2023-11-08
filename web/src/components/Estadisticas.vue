<template>
    <v-layout>
        <v-flex>
            <v-container class="fill-height container">
                <v-responsive class=" text-center fill-height">
                    <h1>Estadístiques</h1>
                    <v-btn @click="fetchGrafics()" style="margin-top: 20px;margin-bottom: 20px;">Actualitzar</v-btn>
                    <v-card v-for="(grafic, index) in grafics" :key="index" color="antiquewhite" class="mb-3">
                        <div>
                            <v-img :src="grafic" width="600px" height="auto"></v-img>
                        </div>
                    </v-card>
                </v-responsive>
            </v-container>
        </v-flex>
    </v-layout>
</template>

<script>
import * as funcionesCM from '@/communicationsManager.js';
import * as spawnSync from 'child_process';
export default {
    data() {
        return {
            grafics: {},
        }
    },
    async created() {
        await this.fetchGrafics()
    },
    methods: {
        async fetchGrafics() {
            try {
                this.grafics = await funcionesCM.getGrafics()
                console.log('Lista graficos: ', this.grafics);
                console.log("Graficos recibidos correctamente")
            } catch (error) { console.error('Error recuperant els grafics: ', error) }
        }

    }
}

</script>

<style>
.centered-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    /* Ajusta la altura según tus necesidades */
}

.centered-element {
    text-align: center;
    /* Otra forma de centrar elementos dentro de la caja */
}
</style>