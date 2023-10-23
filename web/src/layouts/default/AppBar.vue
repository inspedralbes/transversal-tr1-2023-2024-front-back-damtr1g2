<template>
  
</template>

<script>
export default {
  props: {
    auth: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      default: "username",
    },
    userPicture: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      drawer: false,
    };
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    loginOrRegister() {
      // Your logic for handling login or register
    },
    logout() {
      // Your logic for handling logout
    },
  },
};
</script>
