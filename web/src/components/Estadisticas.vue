<template>
    <div id="grafics">
        <v-btn @click="fetchGrafics()">Actualitzar</v-btn>
        <v-card v-for="(grafic, index) in graficsUpdate" :key="index" color="antiquewhite" class="mb-3">

            <div>
                <v-img :src="grafic"></v-img>
            </div>


        </v-card>

    </div>
</template>

<script>
import * as funcionesCM from '@/communicationsManager.js';
export default {
    data() {
        return {
            grafics: [],
            graficsUpdate: []
        }
    },
    async created() {
        await this.fetchGrafics()
    },
    methods: {
        async fetchGrafics() {
            try {
                this.graficsUpdate = []
                this.grafics = await funcionesCM.getGrafics()

                console.log("MIDA",this.grafics.length)
                
                this.grafics.forEach((grafic)=>{
                    
                    grafic = grafic+"?"+Math.floor(Math.random() * 1000)
                    console.log(grafic)
                    this.graficsUpdate.push(grafic)

                })

                console.log('Lista graficos: ', this.graficsUpdate);
                console.log("Graficos recibidos correctamente")


            } catch (error) { console.error('Error recuperant els grafics: ', error) }
        }

    }
}

</script>

<style></style>