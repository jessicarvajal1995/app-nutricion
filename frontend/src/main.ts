import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';


// Crear la instancia de Pinia
const pinia = createPinia();


// Crear la aplicación Vue
const app = createApp(App);


// Registrar plugins
app.use(pinia);
app.use(router);


// Montar la aplicación
app.mount('#app');