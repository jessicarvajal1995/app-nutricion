<template>
    <div class="goals-page">
      <h1>Metas Nutricionales</h1>
     
      <!-- User Selection Dropdown -->
      <div class="user-selection-container card">
        <label for="userSelect">Selecciona un Usuario para ver/establecer sus metas:</label>
        <select id="userSelect" v-model="selectedUserId" @change="onUserSelectionChange" class="user-select">
          <option :value="null">-- Selecciona un Usuario --</option>
          <option v-for="user in allAvailableUsers" :key="user.id" :value="user.id">
            {{ user.name }} (ID: {{ user.id.substring(0,8) }}...)
          </option>
        </select>
      </div>
      <div v-if="userStore.loading && !allAvailableUsers.length" class="loading">
        Cargando usuarios...
      </div>
      <div v-else-if="!userStore.loading && allAvailableUsers.length === 0 && !userStore.error" class="empty-state card">
        <p>No hay usuarios disponibles. Por favor, crea un perfil de usuario primero.</p>
        <router-link to="/profile" class="btn btn-primary">Crear Perfil</router-link>
      </div>
      <div v-if="userStore.error" class="error card">
        <p>Error al cargar usuarios: {{ userStore.error }}. Intenta recargar la página.</p>
      </div>
     
      <div class="actions">
        <button @click="showAddGoalForm = true" class="btn btn-primary" :disabled="goalStore.loading || !selectedUserId">
          <span class="icon">+</span> Establecer Nueva Meta
        </button>
      </div>
     
      <!-- Formulario para añadir/editar meta -->
      <div v-if="showAddGoalForm" class="goal-form-container card">
        <h2>Establecer Nueva Meta Nutricional</h2>
        <form @submit.prevent="saveGoal" class="goal-form">
          <div class="form-group">
            <label for="targetWeight">Peso Objetivo (kg)</label>
            <input
              id="targetWeight"
              v-model.number="goalForm.targetWeight"
              type="number"
              min="1"
              step="0.1"
              required
              placeholder="Ej: 70.5"
            />
          </div>
         
          <div class="form-group">
            <label for="proteinGoal">Objetivo de Proteínas (g/día)</label>
            <input
              id="proteinGoal"
              v-model.number="goalForm.proteinGoal"
              type="number"
              min="0"
              step="1"
              required
              placeholder="Ej: 120"
            />
          </div>
         
          <div class="form-group">
            <label for="carbsGoal">Objetivo de Carbohidratos (g/día)</label>
            <input
              id="carbsGoal"
              v-model.number="goalForm.carbsGoal"
              type="number"
              min="0"
              step="1"
              required
              placeholder="Ej: 200"
            />
          </div>
         
          <div class="form-group">
            <label for="fatGoal">Objetivo de Grasas (g/día)</label>
            <input
              id="fatGoal"
              v-model.number="goalForm.fatGoal"
              type="number"
              min="0"
              step="1"
              required
              placeholder="Ej: 60"
            />
          </div>
         
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="goalForm.isActive"
              />
              Establecer como meta activa
            </label>
            <span class="help-text">Si activas esta opción, cualquier otra meta activa será desactivada.</span>
          </div>
         
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="goalStore.loading">
              {{ goalStore.loading ? 'Guardando...' : 'Guardar' }}
            </button>
            <button
              type="button"
              @click="cancelGoalForm"
              class="btn btn-secondary"
              :disabled="goalStore.loading"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
     
      <!-- Lista de metas -->
      <div class="goals-container">
        <div v-if="!selectedUserId && !goalStore.loading" class="empty-state card">
            <p>Por favor, selecciona un usuario para ver sus metas.</p>
        </div>
        <div v-else-if="goalStore.loading && selectedUserId" class="loading">
          Cargando metas nutricionales para el usuario seleccionado...
        </div>
       
        <div v-else-if="selectedUserId && goals.length === 0 && !goalStore.loading && !goalStore.error" class="empty-state card">
          <p>El usuario seleccionado no ha establecido ninguna meta nutricional todavía.</p>
          <button @click="showAddGoalForm = true" class="btn btn-primary">
            Establecer Primera Meta para este Usuario
          </button>
        </div>
        <div v-else-if="goalStore.error && selectedUserId" class="error card">
            <p>Error al cargar metas: {{ goalStore.error }}</p>
        </div>
       
        <div v-else-if="selectedUserId && goals.length > 0">
          <h2>Historial de Metas para {{ selectedUserName }}</h2>
         
          <div class="goals-list">
            <div v-for="goal in sortedGoals" :key="goal.id" class="goal-card card" :class="{ 'active-goal': goal.isActive }">
              <div class="goal-header">
                <div class="goal-status">
                  <!-- Radio button for activating the goal -->
                  <label class="radio-label" :title="goal.isActive ? 'Meta actualmente activa' : 'Marcar como meta activa'">
                    <input 
                      type="radio" 
                      name="activeGoalRadio" 
                      :value="goal.id" 
                      :checked="goal.isActive"
                      :disabled="goalStore.loading"
                      @change="handleSetGoalActive(goal.id)"
                      class="activate-radio"
                    />
                    <span v-if="goal.isActive" class="active-badge radio-checked">Activa</span>
                    <span v-else class="inactive-badge radio-unchecked">Inactiva</span>
                  </label>
                  <span class="goal-date">Creada el {{ formatDate(goal.createdAt) }}</span>
                </div>
              </div>
             
              <div class="goal-details">
                <div class="goal-weight">
                  <span class="goal-label">Peso objetivo:</span>
                  <span class="goal-value">{{ goal.targetWeight }} kg</span>
                </div>
               
                <div class="goal-nutrients">
                  <div class="nutrient">
                    <span class="nutrient-label">Proteínas:</span>
                    <span class="nutrient-value">{{ goal.proteinGoal }} g/día</span>
                  </div>
                  <div class="nutrient">
                    <span class="nutrient-label">Carbohidratos:</span>
                    <span class="nutrient-value">{{ goal.carbsGoal }} g/día</span>
                  </div>
                  <div class="nutrient">
                    <span class="nutrient-label">Grasas:</span>
                    <span class="nutrient-value">{{ goal.fatGoal }} g/día</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   </template>
   
   
   <script setup lang="ts">
   import { ref, computed, onMounted, watch } from 'vue';
   import { useUserStore } from '../../application/store/user';
   import { useGoalStore } from '../../application/store/goal';
   // Assuming NutritionalGoal type might be used for `goal` in `activateGoal`
   import type { NutritionalGoal } from '../../domain/entities/NutritionalGoal';
   
   // Stores
   const userStore = useUserStore();
   const goalStore = useGoalStore();
   
   // Estado local
   const showAddGoalForm = ref(false);
   const selectedUserId = ref<string | null>(null);
   
   const allAvailableUsers = computed(() => userStore.getAllUsersInStore);
   const selectedUserName = computed(() => {
     if (selectedUserId.value) {
       const user = allAvailableUsers.value.find(u => u.id === selectedUserId.value);
       return user ? user.name : 'Usuario Desconocido';
     }
     return '';
   });
   
   // Formulario para añadir meta
   const goalForm = ref({
    targetWeight: 0,
    proteinGoal: 0,
    carbsGoal: 0,
    fatGoal: 0,
    isActive: true
   });
   
   // Obtener metas del store
   const goals = computed(() => goalStore.getGoals);
   
   // Metas ordenadas por fecha (más reciente primero)
   const sortedGoals = computed(() => {
    return [...goals.value].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
   });
   
   // Funciones auxiliares
   const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
   };
   
   // Cargar usuarios. Las metas se cargan cuando se selecciona un usuario.
   onMounted(async () => {
    userStore.clearError();
    goalStore.clearError();
    goalStore.clearGoals(); // Clear goals from any previous context
    try {
      await userStore.fetchAllUsers();
    } catch (error) {
      console.error('Error al cargar la lista de usuarios:', error);
      // Error will be reflected by userStore.error in the template
    }
   });

   // Manejador para cuando la selección del usuario cambia
   const onUserSelectionChange = async () => {
    goalStore.clearError();
    goalStore.clearGoals(); 
    if (selectedUserId.value) {
      try {
        await goalStore.fetchGoalsByUserId(selectedUserId.value);
      } catch (error) {
        console.error(`Error al cargar las metas para el usuario ${selectedUserId.value}:`, error);
        // Error will be reflected by goalStore.error in the template
      }
    } 
   };
   
   // Métodos para gestionar metas
   const resetGoalForm = () => {
    goalForm.value = {
      targetWeight: 0,
      proteinGoal: 0,
      carbsGoal: 0,
      fatGoal: 0,
      isActive: true
    };
   };
   
   const cancelGoalForm = () => {
    resetGoalForm();
    showAddGoalForm.value = false;
   };
   
   const saveGoal = async () => {
    if (!selectedUserId.value) {
      alert('Por favor, selecciona un usuario para asignarle la meta.');
      return;
    }
     try {
      await goalStore.createGoal({
        userId: selectedUserId.value, // Use selected user ID
        ...goalForm.value
      });
     
      // Limpiar formulario
      resetGoalForm();
      showAddGoalForm.value = false;
     
      // Mostrar mensaje de éxito
      alert('Meta nutricional guardada correctamente');
    } catch (error) {
      console.error('Error al guardar la meta:', error);
      alert('Error al guardar la meta nutricional');
    }
   };
   
   // Renamed from activateGoal and signature changed
   const handleSetGoalActive = async (goalIdToActivate: string) => {
    if (!selectedUserId.value) {
      alert('Por favor, selecciona un usuario primero.');
      return;
    }
     try {
      await goalStore.setActiveGoal(goalIdToActivate, selectedUserId.value);
      alert('Meta nutricional activada correctamente.');
    } catch (error) {
      console.error('Error al activar la meta:', error);
      alert('Error al activar la meta nutricional. Asegúrate de que el servidor esté funcionando y la meta exista.');
       // Optionally, refetch goals to ensure UI consistency if error handling in store isn't perfect
       // await goalStore.fetchGoalsByUserId(selectedUserId.value);
    }
   };
   </script>
   
   
   <style scoped>
   .user-selection-container {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f9f9f9; 
   }

   .user-selection-container label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
   }

   .user-select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
   }

   .radio-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-weight: normal; /* Override label default bold if any */
   }

   .activate-radio {
    margin-right: 8px;
    cursor: pointer;
   }

   .active-badge.radio-checked,
   .inactive-badge.radio-unchecked {
    padding: 3px 6px;
    border-radius: 4px;
    font-size: 0.9em;
   }

   .active-badge.radio-checked {
    background-color: #4CAF50; /* Green */
    color: white;
   }

   .inactive-badge.radio-unchecked {
    background-color: #757575; /* Grey */
    color: white;
   }

   /* Style for the goal-card when it is active */
   .goal-card.active-goal {
    border-left: 5px solid #4CAF50; /* Green border for active goal */
   }

   .goal-status {
    display: flex;
    align-items: center;
    gap: 10px; /* Space between radio/status and date */
   }
   /* Los estilos se mantienen igual que en el componente original */
   </style>
   