<template>
    <div class="goals-page">
      <h1>Metas Nutricionales</h1>
     
      <div class="actions">
        <button @click="showAddGoalForm = true" class="btn btn-primary" :disabled="goalStore.loading">
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
        <div v-if="goalStore.loading && !goals.length" class="loading">
          Cargando metas nutricionales...
        </div>
       
        <div v-else-if="goals.length === 0" class="empty-state">
          <p>No has establecido ninguna meta nutricional todavía.</p>
          <button @click="showAddGoalForm = true" class="btn btn-primary">
            Establecer Primera Meta
          </button>
        </div>
       
        <div v-else>
          <h2>Historial de Metas</h2>
         
          <div class="goals-list">
            <div v-for="goal in sortedGoals" :key="goal.id" class="goal-card card" :class="{ 'active-goal': goal.isActive }">
              <div class="goal-header">
                <div class="goal-status">
                  <span v-if="goal.isActive" class="active-badge">Activa</span>
                  <span v-else class="inactive-badge">Inactiva</span>
                  <span class="goal-date">Creada el {{ formatDate(goal.createdAt) }}</span>
                </div>
                <div class="goal-actions">
                  <button
                    v-if="!goal.isActive"
                    @click="activateGoal(goal)"
                    class="btn-icon activate"
                    title="Activar meta"
                    :disabled="goalStore.loading"
                  >
                    ✓
                  </button>
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
   import { ref, computed, onMounted } from 'vue';
   import { useUserStore } from '../../application/store/user';
   import { useGoalStore } from '../../application/store/goal';
   
   
   // Stores
   const userStore = useUserStore();
   const goalStore = useGoalStore();
   
   
   // Estado local
   const showAddGoalForm = ref(false);
   
   
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
   const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
   };
   
   
   // Cargar metas
   onMounted(async () => {
    if (!userStore.currentUser) {
      // En una aplicación real, redirigir al login o cargar el usuario
      // Por ahora, usaremos un ID de usuario de ejemplo
      await userStore.fetchUser('user-id-here');
    }
     try {
      await goalStore.fetchGoalsByUserId(userStore.currentUser.id);
    } catch (error) {
      console.error('Error al cargar las metas:', error);
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
    if (!userStore.currentUser) return;
     try {
      await goalStore.createGoal({
        userId: userStore.currentUser.id,
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
   
   
   const activateGoal = async (goal) => {
    if (!userStore.currentUser) return;
     try {
      await goalStore.setActiveGoal(goal.id, userStore.currentUser.id);
     
      // Mostrar mensaje de éxito
      alert('Meta nutricional activada correctamente');
    } catch (error) {
      console.error('Error al activar la meta:', error);
      alert('Error al activar la meta nutricional');
    }
   };
   </script>
   
   
   <style scoped>
   /* Los estilos se mantienen igual que en el componente original */
   </style>
   