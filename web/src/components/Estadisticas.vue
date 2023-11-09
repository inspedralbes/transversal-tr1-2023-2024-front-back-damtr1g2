<template>
    <div id="grafics" style="column-span: 12; display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <v-btn @click="fetchGrafics()" style="margin-top: 25px; margin-bottom: 25px;">Actualitzar</v-btn>
      <div style="display: flex; flex-direction: column; align-items: center;">
        <v-card v-for="(grafic, index) in graficsUpdate" :key="index" color="antiquewhite" class="mb-3">
          <div>
            <v-img :src="grafic" style="width: 600px;"></v-img>
          </div>
        </v-card>
      </div>
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