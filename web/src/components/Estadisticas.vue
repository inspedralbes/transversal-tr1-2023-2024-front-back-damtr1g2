<template>
    <div id="grafics">
        <v-card v-for="(grafic, index) in grafics" :key="index" color="antiquewhite" class="mb-3">
        
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
            grafics: {}
        }
    },
    async created() {    
    await this.fetchGrafics()
  },
  methods: {
    async fetchGrafics() {
        try {
            this.grafics = await funcionesCM.getGrafics()
        } catch (error) {console.error('Error recuperant els grafics: ',error)}
    }
  }
}

</script>

<style></style>