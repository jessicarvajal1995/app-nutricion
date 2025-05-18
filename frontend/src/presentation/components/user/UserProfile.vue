<template>
    <div class="user-profile">
      <h2>{{ editingUser ? 'Actualizar Perfil de Usuario' : 'Crear Perfil de Usuario' }}</h2>
     
      <div v-if="storeLoading && !createdUser && !editingUser" class="loading">
        Procesando...
      </div>
     
      <div v-if="storeError" class="error">
        Error: {{ storeError }}
      </div>
     
      <form @submit.prevent="handleSubmit" class="profile-form">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input id="name" v-model="form.name" type="text" required />
        </div>
       
        <div class="form-group">
          <label for="age">Edad</label>
          <input id="age" v-model.number="form.age" type="number" min="1" required />
        </div>
       
        <div class="form-group">
          <label for="height">Altura (cm)</label>
          <input id="height" v-model.number="form.height" type="number" min="1" step="0.1" required />
        </div>
       
        <div class="form-group">
          <label for="weight">Peso actual (kg)</label>
          <input id="weight" v-model.number="form.currentWeight" type="number" min="1" step="0.1" required />
        </div>
       
        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="storeLoading">
            {{ storeLoading ? (editingUser ? 'Actualizando...' : 'Creando...') : (editingUser ? 'Actualizar Perfil' : 'Crear Perfil') }}
          </button>
          <button type="button" @click="resetFormAndCancelEdit" class="btn-secondary" :disabled="storeLoading">
            {{ editingUser ? 'Cancelar Edición' : 'Limpiar' }}
            </button>
        </div>
      </form>

      <div v-if="createdUser && !editingUser" class="created-user-details">
        <h3>Perfil Creado Exitosamente:</h3>
        <p><strong>ID:</strong> {{ createdUser.id }}</p>
        <p><strong>Nombre:</strong> {{ createdUser.name }}</p>
        <p><strong>Edad:</strong> {{ createdUser.age }}</p>
        <p><strong>Altura:</strong> {{ createdUser.height }} cm</p>
        <p><strong>Peso:</strong> {{ createdUser.currentWeight }} kg</p>
        <p><strong>Creado en:</strong> {{ new Date(createdUser.createdAt).toLocaleString() }}</p>
        <p><strong>Actualizado en:</strong> {{ new Date(createdUser.updatedAt).toLocaleString() }}</p>
      </div>

      <div v-if="allUsers.length > 0" class="existing-users-section">
        <h2>Perfiles Existentes</h2>
        <table class="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Edad</th>
              <th>Altura (cm)</th>
              <th>Peso (kg)</th>
              <th>Creado en</th>
              <th>Actualizado en</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in allUsers" :key="user.id">
              <td>{{ user.id.substring(0, 8) }}...</td>
              <td>{{ user.name }}</td>
              <td>{{ user.age }}</td>
              <td>{{ user.height }}</td>
              <td>{{ user.currentWeight }}</td>
              <td>{{ new Date(user.createdAt).toLocaleString() }}</td>
              <td>{{ new Date(user.updatedAt).toLocaleString() }}</td>
              <td>
                <button @click="startEditUser(user)" class="btn-edit" :disabled="storeLoading">Editar</button>
                <button @click="confirmDeleteUser(user.id)" class="btn-delete" :disabled="storeLoading">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else-if="!storeLoading && !storeError && allUsers.length === 0" class="no-users-message">
        <p>No hay perfiles creados aún.</p>
      </div>
    </div>
</template>
   
   
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useUserStore, type UserCreationData, type UserUpdatePayload } from '../../../application/store/user';
import type { User as DomainUser } from '../../../domain/entities/User';

const userStore = useUserStore();
const storeLoading = computed(() => userStore.loading);
const storeError = computed(() => userStore.error);
const allUsers = computed(() => userStore.getAllUsersInStore);

const createdUser = ref<DomainUser | null>(null);
const editingUser = ref<DomainUser | null>(null);

const initialFormState: UserCreationData = {
  name: '',
  age: 0,
  height: 0,
  currentWeight: 0
};

const form = reactive<UserCreationData>({ ...initialFormState });
   
const resetFormAndCancelEdit = () => {
  Object.assign(form, initialFormState);
  createdUser.value = null;
  editingUser.value = null;
  userStore.clearError();
};

const handleSubmit = async () => {
  if (editingUser.value) {
    await updateProfile();
  } else {
    await createProfile();
  }
};
   
const createProfile = async () => {
  createdUser.value = null;
  editingUser.value = null;
  userStore.clearError();
  try {
    const newProfileData: UserCreationData = {
      name: form.name,
      age: form.age,
      height: form.height,
      currentWeight: form.currentWeight
    };
    const newlyCreatedUser = await userStore.createUser(newProfileData);
    
    if (newlyCreatedUser) {
      createdUser.value = newlyCreatedUser;
      alert('Perfil creado correctamente');
      resetFormAndCancelEdit();
      await userStore.fetchAllUsers();
    }
  } catch (err: any) {
    console.error('Error al crear el perfil (desde componente):', err);
  }
};

const startEditUser = (userToEdit: DomainUser) => {
  editingUser.value = { ...userToEdit };
  createdUser.value = null;
  userStore.clearError();
  form.name = userToEdit.name;
  form.age = userToEdit.age;
  form.height = userToEdit.height;
  form.currentWeight = userToEdit.currentWeight;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const updateProfile = async () => {
  if (!editingUser.value) return;
  userStore.clearError();

  const payload: UserUpdatePayload = {
    id: editingUser.value.id,
    name: form.name,
    age: form.age,
    height: form.height,
    currentWeight: form.currentWeight,
  };

  try {
    const updatedUser = await userStore.updateUser(payload);
    if (updatedUser) {
      alert('Perfil actualizado correctamente');
      resetFormAndCancelEdit();
      await userStore.fetchAllUsers();
    }
  } catch (err: any) {
    console.error('Error al actualizar el perfil (desde componente):', err);
  }
};

const confirmDeleteUser = async (userId: string) => {
  if (window.confirm('¿Estás seguro de que quieres eliminar este perfil?')) {
    userStore.clearError();
    const success = await userStore.deleteUser(userId);
    if (success) {
      alert('Perfil eliminado correctamente.');
      if (editingUser.value && editingUser.value.id === userId) {
         resetFormAndCancelEdit();
      }
      await userStore.fetchAllUsers();
    }
  }
};

onMounted(async () => {
  await userStore.fetchAllUsers();
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

.users-table {
  margin-top: 30px;
  width: 100%;
  border-collapse: collapse;
}

.users-table th, .users-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.users-table th {
  background-color: #f2f2f2;
}

.users-table td button {
  margin-right: 5px;
}

.btn-edit {
  background-color: #2196F3;
  color: white;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.no-users-message {
  text-align: center;
  padding: 20px;
}
</style>
   