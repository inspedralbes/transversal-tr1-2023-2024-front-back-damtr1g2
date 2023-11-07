<template>
  <v-app>
  <div>
    <app-bar/>
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
</div>
</v-app>
</template>

<script>
  import AppBar from "@/layouts/default/AppBar.vue"

  export default {
    components: {
      AppBar
    }
  }
</script>
