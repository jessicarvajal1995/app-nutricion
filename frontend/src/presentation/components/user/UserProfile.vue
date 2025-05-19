<template>
  <div class="user-profile-page">
    <!-- Form Section -->
    <div class="profile-form-container card">
      <h2>{{ editingUser ? 'Actualizar Perfil de Usuario' : 'Crear Nuevo Perfil de Usuario' }}</h2>
      <div v-if="storeLoading && !editingUser && !allUsers.length" class="loading">
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
          <button type="submit" class="btn btn-primary" :disabled="storeLoading">
            {{ storeLoading ? (editingUser ? 'Actualizando...' : 'Creando...') : (editingUser ? 'Actualizar Perfil' : 'Crear Perfil') }}
          </button>
          <button type="button" @click="resetFormAndCancelEdit" class="btn btn-secondary" :disabled="storeLoading">
            {{ editingUser ? 'Cancelar Edición' : 'Limpiar Formulario' }}
          </button>
        </div>
      </form>

      <div v-if="createdUser && !editingUser" class="created-user-details success-message">
        <h3>¡Perfil Creado Exitosamente!</h3>
        <p><strong>Nombre:</strong> {{ createdUser.name }}</p>
        <!-- You can add more details of the created user here if needed -->
      </div>
    </div>

    <!-- Users Table Section -->
    <div class="users-table-container card">
      <h2>Perfiles Existentes</h2>
      <div v-if="storeLoading && !allUsers.length" class="loading">
        Cargando perfiles...
      </div>
      <div v-else-if="!storeLoading && allUsers.length === 0 && !storeError" class="empty-state">
        <p>No hay perfiles creados todavía. ¡Crea el primero usando el formulario de arriba!</p>
      </div>
      <div v-else-if="storeError && !allUsers.length" class="error">
        <p>Error al cargar perfiles: {{ storeError }}</p>
      </div>
      <table v-else-if="allUsers.length > 0" class="users-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Altura (cm)</th>
            <th>Peso (kg)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in allUsers" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.age }}</td>
            <td>{{ user.height }}</td>
            <td>{{ user.currentWeight }}</td>
            <td class="actions-cell">
              <button @click="startEditUser(user)" class="btn-icon edit" title="Editar Perfil">
                ✏️
              </button>
              <button @click="confirmDeleteUser(user.id)" class="btn-icon delete" title="Eliminar Perfil">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.user-profile-page {
  /* display: flex; // Flex direction can make direct margin:auto tricky for children */
  /* flex-direction: column; */
  gap: 30px; /* Space between form and table containers */
  max-width: 800px; /* Max width for the overall content area */
  margin: 0 auto; /* Center the overall content area */
}

.profile-form-container,
.users-table-container {
  padding: 25px;
  border-radius: 12px;
  background-color: white; /* Explicitly set background for card effect if not inherited */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* Consistent shadow */
  /* max-width: 600px; /* Max width for the form card itself */
  /* margin: 0 auto; /* Center the form card if its parent is wider */
  /* The above max-width and margin for individual cards can be uncommented if needed,
     but usually, the page-level max-width and margin:auto on .user-profile-page is enough
     if the cards are meant to take up available width within that centered page. */
  overflow-x: auto; /* Allow horizontal scrolling for the table if needed */
}

.profile-form-container h2,
.users-table-container h2 {
  color: #564256;
  font-size: 1.6rem;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #fde9f0; /* Light pink accent */
  text-align: center;
}

.profile-form {
  display: grid;
  grid-template-columns: 1fr; /* Single column for simplicity, can be 2 for wider screens */
  gap: 15px;
}

/* Re-using global styles for .form-group, label, input, .form-actions, .btn */
/* Specific adjustments if needed */

.success-message {
  margin-top: 20px;
  padding: 15px;
  background-color: #e6ffed; /* Light green for success */
  color: #22863a;
  border-radius: 8px;
  text-align: center;
}

.success-message h3 {
  color: #22863a;
  margin-bottom: 10px;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.users-table th,
.users-table td {
  border: 1px solid #e1e1e1; /* Lighter border */
  padding: 12px 15px; /* More padding */
  text-align: left;
  vertical-align: middle;
}

.users-table thead th {
  background-color: #fde9f0; /* Light pink header */
  color: #564256; /* Dark purple text */
  font-weight: 600;
}

.users-table tbody tr:nth-child(even) {
  background-color: #fdf4f5; /* Very light pink for even rows */
}

.users-table tbody tr:hover {
  background-color: #fce4ec; /* Slightly darker pink on hover */
}

.actions-cell {
  display: flex;
  gap: 10px;
  justify-content: center; /* Center buttons in the cell */
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem; /* Larger icons */
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.btn-icon.edit {
  color: #3498db; /* Blue */
}
.btn-icon.edit:hover {
  background-color: #eaf5ff; /* Light blue background */
}

.btn-icon.delete {
  color: #e74c3c; /* Red */
}
.btn-icon.delete:hover {
  background-color: #ffebee; /* Light red background */
}

/* Ensure .loading, .error, .empty-state styles from App.vue are sufficient or add overrides */
.empty-state p {
  font-size: 1.1rem;
}

@media (min-width: 768px) {
  .profile-form {
    grid-template-columns: 1fr 1fr; /* Two columns on wider screens */
    gap: 20px 30px; 
  }
}

</style>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useUserStore, type UserCreationData, type UserUpdatePayload } from '../../../application/store/user';
import type { User as DomainUser } from '../../../domain/entities/User';
 
const userStore = useUserStore();
const storeLoading = computed(() => userStore.loading);
const storeError = computed(() => userStore.error);
const allUsers = computed(() => userStore.getAllUsersInStore); // Get all users for the table

const createdUser = ref<DomainUser | null>(null); // For success message after creation
const editingUser = ref<DomainUser | null>(null); // To hold the user being edited
 
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
  editingUser.value = null; // Clear editing state
  userStore.clearError();
};

// Combined form submission handler
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
    const newProfileData: UserCreationData = { ...form }; // Use reactive form data
    const newlyCreatedUser = await userStore.createUser(newProfileData);
    
    if (newlyCreatedUser) {
      createdUser.value = newlyCreatedUser;
      alert('Perfil creado correctamente');
      resetFormAndCancelEdit(); // Reset form
      // userStore.fetchAllUsers(); // List should update reactively as users array in store is modified by createUser
    } else {
      // Error is usually set in the store, which storeError will pick up
    }
  } catch (err: any) {
    console.error('Error al crear el perfil (desde componente):', err);
    // Error should be reflected by storeError
  }
};

const startEditUser = (userToEdit: DomainUser) => {
  editingUser.value = { ...userToEdit }; // Create a shallow copy for editing
  createdUser.value = null; // Clear any "created" message
  userStore.clearError();
  
  // Populate form with the user's data
  form.name = userToEdit.name;
  form.age = userToEdit.age;
  form.height = userToEdit.height;
  form.currentWeight = userToEdit.currentWeight;
  
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the form for editing
};

const updateProfile = async () => {
  if (!editingUser.value || !editingUser.value.id) return;
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
      // The list should update reactively as the users array in store is modified by updateUser
    } else {
      // Error is usually set in the store
    }
  } catch (err: any) {
    console.error('Error al actualizar el perfil (desde componente):', err);
    // Error should be reflected by storeError
  }
};

const confirmDeleteUser = async (userId: string) => {
  if (window.confirm('¿Estás seguro de que quieres eliminar este perfil?')) {
    userStore.clearError();
    const success = await userStore.deleteUser(userId);
    if (success) {
      alert('Perfil eliminado correctamente.');
      // If the deleted user was being edited, reset the form
      if (editingUser.value && editingUser.value.id === userId) {
         resetFormAndCancelEdit();
      }
      // List will update reactively from the store
    } else {
      // Error is handled by the store and displayed via storeError
      // No need for a specific alert here if storeError is shown in template
    }
  }
};

// Fetch all users when the component is mounted
onMounted(async () => {
  await userStore.fetchAllUsers();
});
</script>
