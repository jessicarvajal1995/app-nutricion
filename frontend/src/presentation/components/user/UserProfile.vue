<template>
    <div class="user-profile">
      <h2>Crear Perfil de Usuario</h2>
     
      <div v-if="loading" class="loading">
        Creando perfil...
      </div>
     
      <div v-if="error" class="error">
        Error al crear perfil: {{ error }}
      </div>
     
      <form @submit.prevent="createProfile" class="profile-form">
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
          <button type="submit" class="btn-primary">Crear Perfil</button>
          <button type="button" @click="resetForm" class="btn-secondary">Limpiar</button>
        </div>
      </form>

      <div v-if="createdUser" class="created-user-details">
        <h3>Perfil Creado Exitosamente:</h3>
        <p><strong>ID:</strong> {{ createdUser.id }}</p>
        <p><strong>Nombre:</strong> {{ createdUser.name }}</p>
        <p><strong>Edad:</strong> {{ createdUser.age }}</p>
        <p><strong>Altura:</strong> {{ createdUser.height }} cm</p>
        <p><strong>Peso:</strong> {{ createdUser.currentWeight }} kg</p>
        <p><strong>Creado en:</strong> {{ new Date(createdUser.createdAt).toLocaleString() }}</p>
        <p><strong>Actualizado en:</strong> {{ new Date(createdUser.updatedAt).toLocaleString() }}</p>
      </div>
    </div>
</template>
   
   
<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useUserStore, type User } from '../../../application/store/user';
   
const userStore = useUserStore();
const loading = computed(() => userStore.loading);
const error = computed(() => userStore.error);

const createdUser = ref<User | null>(null);
   
const form = reactive({
  name: '',
  age: 0,
  height: 0,
  currentWeight: 0
});
   
const resetForm = () => {
  form.name = '';
  form.age = 0;
  form.height = 0;
  form.currentWeight = 0;
  createdUser.value = null;
  userStore.clearError();
};
   
const createProfile = async () => {
  createdUser.value = null;
  try {
    const newProfileData = {
      name: form.name,
      age: form.age,
      height: form.height,
      currentWeight: form.currentWeight
    };
    const newlyCreatedUser = await userStore.createUser(newProfileData);
    
    if (newlyCreatedUser) {
      createdUser.value = newlyCreatedUser;
      alert('Perfil creado correctamente');
    }
  } catch (err: any) {
    console.error('Error al crear el perfil (desde componente):', err);
  }
};
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

.created-user-details {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.created-user-details h3 {
  margin-top: 0;
}
</style>
   