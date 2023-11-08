<template>
  <v-app>
    <v-layout class="rounded rounded-md">
    <DefaultBar/>
    <Login/>
    <default-view />
  </v-layout>
  </v-app>
</template>

<script setup>
  import DefaultBar from './AppBar.vue'
  import DefaultView from './View.vue'
  import Login from '@/components/Login.vue'
</script>
