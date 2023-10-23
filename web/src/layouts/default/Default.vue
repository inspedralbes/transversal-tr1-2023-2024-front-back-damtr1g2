<template>
  <v-app>
    <v-layout class="rounded rounded-md">
    <Content />
    
    <default-view />
  </v-layout>
  </v-app>
</template>

<script setup>
  import DefaultBar from './AppBar.vue'
  import DefaultView from './View.vue'
  import Content from '@/components/Content.vue'
</script>
