<template>
  <div class="goals-page">
    <h1>Metas Nutricionales</h1>
   
    <!-- User Selection Dropdown -->
    <div class="user-selection-container card">
      <h2>Seleccionar Usuario</h2>
      <div v-if="userStore.loading && !allUsers.length" class="loading">Cargando usuarios...</div>
      <div v-else-if="userStore.error && !allUsers.length" class="error">
        Error al cargar usuarios: {{ userStore.error }}
      </div>
      <div v-else-if="!allUsers.length" class="empty-state">
        No hay usuarios disponibles. Por favor, cree un perfil primero.
      </div>
      <div v-else class="form-group">
        <label for="userSelect">Usuario:</label>
        <select id="userSelect" v-model="selectedUserId" class="user-select">
          <option :value="null" disabled>-- Selecciona un usuario --</option>
          <option v-for="user in allUsers" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>
      </div>
    </div>
   
    <div class="actions">
      <button 
        @click="showAddGoalForm = true" 
        class="btn btn-primary" 
        :disabled="!selectedUserId || goalStore.loading"
      >
        <span class="icon">+</span> Establecer Nueva Meta
      </button>
    </div>
   
    <!-- Formulario para añadir/editar meta -->
    <div v-if="showAddGoalForm && selectedUserId" class="goal-form-container card">
      <h2>Establecer Nueva Meta Nutricional para {{ selectedUserName }}</h2>
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
    <div v-if="selectedUserId" class="goals-container">
      <div v-if="goalStore.loading && !goals.length" class="loading">
        Cargando metas nutricionales para {{ selectedUserName }}...
      </div>
     
      <div v-else-if="goals.length === 0" class="empty-state">
        <p>No se han establecido metas nutricionales para {{ selectedUserName }} todavía.</p>
        <button @click="showAddGoalForm = true" class="btn btn-primary" :disabled="!selectedUserId">
          Establecer Primera Meta
        </button>
      </div>
     
      <div v-else>
        <h2>Historial de Metas para {{ selectedUserName }}</h2>
       
        <div class="goals-list">
          <div v-for="goal in sortedGoals" :key="goal.id" class="goal-card card" :class="{ 'active-goal': goal.isActive }">
            <div class="goal-header">
              <div class="goal-status">
                <span v-if="goal.isActive" class="active-badge">Activa</span>
                <span v-else class="inactive-badge">Inactiva</span>
                <span class="goal-date">Creada el {{ formatDate(goal.createdAt) }}</span>
              </div>
              <div class="goal-actions">
                <!-- Radio button to activate goal -->
                <label class="radio-label" :title="goal.isActive ? 'Meta ya activa' : 'Activar esta meta'">
                  <input 
                    type="radio"
                    name="activeGoalRadio"
                    :value="goal.id"
                    :checked="goal.isActive"
                    @change="handleSetGoalActive(goal.id)"
                    :disabled="goal.isActive || goalStore.loading"
                    class="goal-activate-radio"
                  />
                  <span class="radio-custom"></span>
                  {{ goal.isActive ? 'Activada' : 'Activar' }}
                </label>
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
    <div v-else class="empty-state">
      <p>Por favor, selecciona un usuario para ver o establecer sus metas nutricionales.</p>
    </div>
  </div>
 </template>
 
 
 <script setup lang="ts">
 import { ref, computed, onMounted, watch } from 'vue';
 import { useUserStore } from '../../application/store/user';
 import { useGoalStore } from '../../application/store/goal';
 import type { User as DomainUser } from '../../domain/entities/User'; // Assuming User type is available
 
 
 // Stores
 const userStore = useUserStore();
 const goalStore = useGoalStore();
 
 
 // State local
 const showAddGoalForm = ref(false);
 const allUsers = ref<DomainUser[]>([]);
 const selectedUserId = ref<string | null>(null);
 
 
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
 
 const selectedUserName = computed(() => {
   const user = allUsers.value.find(u => u.id === selectedUserId.value);
   return user ? user.name : '';
 });
 
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
 
 
 // Cargar usuarios y manejar selección inicial
 onMounted(async () => {
  try {
    const users = await userStore.fetchAllUsers();
    if (users) {
      allUsers.value = users;
      // Optionally, select the first user by default if users exist
      // if (users.length > 0) {
      //   selectedUserId.value = users[0].id;
      // }
    }
  } catch (error) {
    console.error('Error al cargar los usuarios:', error);
    // userStore.error should already be set by the store action
  }
 });
 
 // Watch for changes in selectedUserId to fetch goals
 watch(selectedUserId, async (newUserId, oldUserId) => {
  if (newUserId) {
    showAddGoalForm.value = false; // Close form when user changes
    resetGoalForm();
    try {
      await goalStore.fetchGoalsByUserId(newUserId);
    } catch (error) {
      console.error(`Error al cargar las metas para el usuario ${newUserId}:`, error);
      // goalStore.error should be set by the store action
    }
  } else {
    goalStore.clearGoals(); // Clear goals if no user is selected
  }
 });
 
 
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
    alert('Por favor, selecciona un usuario antes de guardar una meta.');
    return;
  }
   try {
    await goalStore.createGoal({
      userId: selectedUserId.value,
      ...goalForm.value
    });
   
    resetGoalForm();
    showAddGoalForm.value = false;
    alert('Meta nutricional guardada correctamente para ' + selectedUserName.value);
    // Goals list will update due to store reactivity after createGoal potentially fetches them or updates list
  } catch (error) {
    console.error('Error al guardar la meta:', error);
    alert('Error al guardar la meta nutricional. ' + (goalStore.error || ''));
  }
 };
 
 
 const handleSetGoalActive = async (goalId: string) => {
  if (!selectedUserId.value) {
    alert('Por favor, selecciona un usuario.');
    return;
  }
  try {
    await goalStore.setActiveGoal(goalId, selectedUserId.value);
    alert('Meta nutricional activada correctamente para ' + selectedUserName.value);
  } catch (error) {
    console.error('Error al activar la meta:', error);
    alert('Error al activar la meta nutricional. ' + (goalStore.error || ''));
  }
 };
 
 </script>
 
 
 <style scoped>
.goals-page {
padding: 20px;
animation: fadeIn 0.5s ease-in-out;
}

h1 {
font-size: 1.8rem;
margin-bottom: 1.5rem;
color: #564256;
text-align: center;
}

.user-selection-container {
margin-bottom: 25px;
padding: 20px;
}
.user-selection-container h2 {
color: #564256;
font-size: 1.4rem;
margin-bottom: 15px;
padding-bottom: 10px;
border-bottom: 2px solid #fde9f0;
}
.user-select {
width: 100%;
padding: 10px;
border-radius: 8px;
border: 1px solid #ddd;
}

.actions {
display: flex;
justify-content: flex-end;
margin-bottom: 20px;
}

.btn-primary {
background-color: #f8a4c0;
color: white;
display: flex;
align-items: center;
gap: 8px;
padding: 10px 16px;
border-radius: 30px;
transition: all 0.3s ease;
}

.btn-primary:hover {
background-color: #f591b2;
transform: translateY(-2px);
box-shadow: 0 4px 10px rgba(248, 164, 192, 0.3);
}

.icon {
font-size: 1.2rem;
}

.goal-form-container {
margin-bottom: 30px;
animation: slideDown 0.4s ease-in-out;
}

.goal-form-container h2 {
color: #564256;
font-size: 1.4rem;
margin-bottom: 20px;
padding-bottom: 10px;
border-bottom: 2px solid #fde9f0;
}

.goal-form {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 20px;
}

.form-group {
display: flex;
flex-direction: column;
gap: 8px;
}

.form-group label {
font-weight: 500;
color: #564256;
}

.form-group input[type="number"], .form-group input[type="text"] {
padding: 10px;
border: 1px solid #e1e1e1;
border-radius: 8px;
transition: all 0.3s ease;
}

.form-group input:focus {
border-color: #f8a4c0;
box-shadow: 0 0 0 3px rgba(248, 164, 192, 0.15);
}

.checkbox-group {
margin-top: 10px;
/* Ensure it spans full width if in grid */
grid-column: 1 / -1; 
}

.checkbox-label {
display: flex;
align-items: center;
gap: 8px;
cursor: pointer;
color: #564256;
}
.checkbox-label input[type="checkbox"] {
width: 18px;
height: 18px;
accent-color: #f8a4c0;
}

.help-text {
display: block;
margin-top: 5px;
font-size: 0.85rem;
color: #888;
}

.form-actions {
grid-column: 1 / -1;
display: flex;
gap: 15px;
margin-top: 10px;
}

.form-actions button {
flex: 1;
padding: 12px;
}

.goals-container {
margin-top: 30px;
}

.goals-container h2 {
color: #564256;
font-size: 1.4rem;
margin-bottom: 20px;
}

.goals-list {
display: grid;
grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); /* Slightly wider cards */
gap: 20px;
}

.goal-card {
border-radius: 12px;
padding: 0;
overflow: hidden;
transition: all 0.3s ease;
display: flex;
flex-direction: column;
}

.goal-card:hover {
transform: translateY(-5px);
box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.active-goal {
border: 2px solid #f8a4c0;
box-shadow: 0 0 15px rgba(248, 164, 192, 0.3);
}

.goal-header {
background-color: #fde9f0;
padding: 12px 15px;
display: flex;
justify-content: space-between;
align-items: center;
}

.goal-status {
display: flex;
flex-direction: column;
gap: 4px;
}

.active-badge, .inactive-badge {
display: inline-block;
padding: 5px 12px;
border-radius: 30px;
font-size: 0.75rem; /* Smaller badge text */
font-weight: 600;
text-transform: uppercase;
}

.active-badge {
background-color: #f8a4c0;
color: white;
}

.inactive-badge {
background-color: #e1e1e1;
color: #666;
}

.goal-date {
font-size: 0.8rem;
color: #777;
}

.goal-actions {
display: flex;
align-items: center;
}

.radio-label {
display: flex;
align-items: center;
cursor: pointer;
padding: 6px 10px;
border-radius: 20px;
transition: background-color 0.3s ease;
font-size: 0.9rem;
color: #564256;
}

.radio-label:hover {
background-color: rgba(248, 164, 192, 0.1);
}

.goal-activate-radio {
display: none; /* Hide original radio */
}

.radio-custom {
width: 18px;
height: 18px;
border: 2px solid #f8a4c0;
border-radius: 50%;
margin-right: 8px;
display: inline-block;
position: relative;
transition: border-color 0.3s ease;
}

.goal-activate-radio:checked + .radio-custom {
background-color: #f8a4c0;
border-color: #f8a4c0;
}

.goal-activate-radio:checked + .radio-custom::after {
content: "";
position: absolute;
top: 50%;
left: 50%;
width: 8px;
height: 8px;
background-color: white;
border-radius: 50%;
transform: translate(-50%, -50%);
}

.goal-activate-radio:disabled + .radio-custom {
border-color: #ccc;
background-color: #f1f1f1;
}
.goal-activate-radio:disabled:checked + .radio-custom {
background-color: #f8a4c0; /* Keep color if checked but disabled */
}
.radio-label input:disabled ~ span, 
.radio-label input:disabled {
cursor: not-allowed;
color: #aaa;
}

.goal-details {
padding: 15px; /* Slightly reduced padding */
flex-grow: 1; /* Allow details to take available space */
display: flex;
flex-direction: column;
gap: 12px; /* Reduced gap */
}

.goal-weight {
padding-bottom: 12px; /* Reduced padding */
border-bottom: 1px solid #f1f1f1;
display: flex;
justify-content: space-between;
align-items: center;
}

.goal-label {
font-weight: 500;
color: #666;
font-size: 0.9rem; /* Adjusted size */
}

.goal-value {
font-weight: 600;
color: #564256;
font-size: 1.1rem; /* Adjusted size */
}

.goal-nutrients {
display: grid;
grid-template-columns: 1fr; /* Single column for better readability */
gap: 10px; /* Reduced gap */
}

.nutrient {
display: flex;
justify-content: space-between; /* Align label and value on one line */
align-items: center;
}

.nutrient-label {
font-size: 0.85rem; /* Adjusted size */
color: #666;
}

.nutrient-value {
font-weight: 600;
color: #333;
font-size: 0.9rem; /* Adjusted size */
}

.empty-state, .loading {
padding: 30px;
text-align: center;
background-color: white;
border-radius: 12px;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
margin-top: 20px;
}

.empty-state p, .loading p {
margin-bottom: 20px;
color: #666;
}

@keyframes fadeIn {
from { opacity: 0; transform: translateY(20px); }
to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
from { opacity: 0; transform: translateY(-20px); }
to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
.goal-form {
  grid-template-columns: 1fr;
}
.form-actions {
  flex-direction: column;
}
.goals-list {
  grid-template-columns: 1fr; /* Single column on small screens */
}
}
</style>
