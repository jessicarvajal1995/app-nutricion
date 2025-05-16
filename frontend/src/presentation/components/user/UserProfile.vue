<template>
    <div class="user-profile">
      <h2>Perfil de Usuario</h2>
     
      <div v-if="loading" class="loading">
        Cargando...
      </div>
     
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
     
      <form v-else @submit.prevent="saveProfile" class="profile-form">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
          />
        </div>
       
        <div class="form-group">
          <label for="age">Edad</label>
          <input
            id="age"
            v-model.number="form.age"
            type="number"
            min="1"
            required
          />
        </div>
       
        <div class="form-group">
          <label for="height">Altura (cm)</label>
          <input
            id="height"
            v-model.number="form.height"
            type="number"
            min="1"
            step="0.1"
            required
          />
        </div>
       
        <div class="form-group">
          <label for="weight">Peso actual (kg)</label>
          <input
            id="weight"
            v-model.number="form.currentWeight"
            type="number"
            min="1"
            step="0.1"
            required
          />
        </div>
       
        <div class="form-actions">
          <button type="submit" class="btn-primary">Guardar</button>
          <button type="button" @click="resetForm" class="btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>
   </template>
   
   
   <script setup lang="ts">
   import { ref, reactive, onMounted, computed } from 'vue';
   import { useUserStore } from '../../../application/store/user';
   
   
   const userStore = useUserStore();
   const loading = computed(() => userStore.loading);
   const error = computed(() => userStore.error);
   const user = computed(() => userStore.currentUser);
   
   
   const form = reactive({
    name: '',
    age: 0,
    height: 0,
    currentWeight: 0
   });
   
   
   // Inicializar el formulario con los datos del usuario
   const initForm = () => {
    if (user.value) {
      form.name = user.value.name;
      form.age = user.value.age;
      form.height = user.value.height;
      form.currentWeight = user.value.currentWeight;
    }
   };
   
   
   // Restablecer el formulario a los valores originales
   const resetForm = () => {
    initForm();
   };
   
   
   // Guardar los cambios del perfil
   const saveProfile = async () => {
    try {
      await userStore.updateUser({
        name: form.name,
        age: form.age,
        height: form.height,
        currentWeight: form.currentWeight
      });
     
      alert('Perfil actualizado correctamente');
    } catch (err) {
      console.error('Error al guardar el perfil:', err);
    }
   };
   
   
   // Cargar los datos del usuario al montar el componente
   onMounted(async () => {
    // En una aplicación real, obtendrías el ID del usuario de alguna manera
    // Por ejemplo, desde un token JWT o del almacenamiento local
    const userId = 'user-id-here'; // Esto es un placeholder
     if (!user.value) {
      await userStore.fetchUser(userId);
    }
     initForm();
   });
   </script>
   
   
   <style scoped>
   .user-profile {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
   }
   
   
   .profile-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
   }
   
   
   .form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
   }
   
   
   label {
    font-weight: bold;
   }
   
   
   input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
   }
   
   
   .form-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
   }
   
   
   button {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
   }
   
   
   .btn-primary {
    background-color: #4CAF50;
    color: white;
   }
   
   
   .btn-secondary {
    background-color: #f1f1f1;
    color: #333;
   }
   
   
   .loading, .error {
    padding: 20px;
    text-align: center;
   }
   
   
   .error {
    color: red;
   }
   </style>
   