<template>
    <div id="grafics">
        <v-btn @click="updateGraficsVUE()">Actualitzar</v-btn>
        <h1>AAAAA</h1>
        <v-card v-for="(grafic, index) in grafics" :key="index" color="antiquewhite" class="mb-3">

            <div>
                <v-img :src="grafic"></v-img>
            </div>


        </v-card>

    </div>
</template>

<script>
import * as funcionesCM from '@/communicationsManager.js';
import * as spawnSync from 'child_process';
export default {
    data() {
        return {
            grafics: {},
            pythonCommand: 'python ../../../server/stats.py'
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

<style></style>