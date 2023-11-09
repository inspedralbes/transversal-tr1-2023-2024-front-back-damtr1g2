import { reactive } from "vue";
import { io } from "socket.io-client";
import { SERVER_URL } from "@/communicationsManager.js"
import store from './store';

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: []
});

export const socket = io(SERVER_URL);

socket.on("connect", () => {
  state.connected = true;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on('comandaActualitzada',(updatedComanda) => {
    console.log('Received comanda:', updatedComanda)
    if(store.state.comandes.length != 0){
        store.state.comandes.forEach(comanda => {
            if(comanda.id == updatedComanda.id){
                console.log("Comanda updated", updatedComanda);
                comanda.estado = updatedComanda.estado;
            }
        });
    }
  })