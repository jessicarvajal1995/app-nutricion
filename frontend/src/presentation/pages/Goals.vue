<template>
    <div class="goals-page">
      <h1>Metas Nutricionales</h1>
     
      <div class="actions">
        <button @click="showAddGoalForm = true" class="btn btn-primary" :disabled="loading">
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
            <button type="submit" class="btn btn-primary" :disabled="savingGoal">
              {{ savingGoal ? 'Guardando...' : 'Guardar' }}
            </button>
            <button
              type="button"
              @click="cancelGoalForm"
              class="btn btn-secondary"
              :disabled="savingGoal"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
     
      <!-- Lista de metas -->
      <div class="goals-container">
        <div v-if="loading" class="loading">
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
   
   
   // Stores
   const userStore = useUserStore();
   
   
   // Estado
   const goals = ref([]);
   const loading = ref(true);
   const showAddGoalForm = ref(false);
   const savingGoal = ref(false);
   
   
   // Formulario para añadir meta
   const goalForm = ref({
    targetWeight: 0,
    proteinGoal: 0,
    carbsGoal: 0,
    fatGoal: 0,
    isActive: true
   });
   
   
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
    // En una aplicación real, estos datos vendrían de un servicio
    // Por ahora, usaremos datos de ejemplo
    setTimeout(() => {
      goals.value = [
        {
          id: 'goal-1',
          userId: 'user-id-here',
          targetWeight: 70,
          proteinGoal: 120,
          carbsGoal: 200,
          fatGoal: 60,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'goal-2',
          userId: 'user-id-here',
          targetWeight: 75,
          proteinGoal: 100,
          carbsGoal: 250,
          fatGoal: 70,
          isActive: false,
          createdAt: new Date(Date.now() - 30 * 86400000).toISOString(), // Hace un mes
          updatedAt: new Date(Date.now() - 30 * 86400000).toISOString()
        }
      ];
      loading.value = false;
    }, 800);
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
    savingGoal.value = true;
     try {
      // En una aplicación real, esto se haría a través de un servicio
      // Por ahora, simularemos la operación
     
      // Si la nueva meta está activa, desactivamos las demás
      if (goalForm.value.isActive) {
        goals.value = goals.value.map(goal => ({
          ...goal,
          isActive: false
        }));
      }
     
      // Crear nueva meta
      const newGoal = {
        id: `goal-${Date.now()}`, // Generar ID único (en una app real, esto lo haría el backend)
        userId: 'user-id-here', // En una app real, esto sería el ID del usuario autenticado
        ...goalForm.value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
     
      // Añadir a la lista
      goals.value.push(newGoal);
     
      // Limpiar formulario
      resetGoalForm();
      showAddGoalForm.value = false;
     
      // Mostrar mensaje de éxito
      alert('Meta nutricional guardada correctamente');
    } catch (error) {
      console.error('Error al guardar la meta:', error);
      alert('Error al guardar la meta nutricional');
    } finally {
      savingGoal.value = false;
    }
   };
   
   
   const activateGoal = async (goal) => {
    try {
      // En una aplicación real, esto se haría a través de un servicio
      // Por ahora, simularemos la operación
     
      // Desactivar todas las metas
      goals.value = goals.value.map(g => ({
        ...g,
        isActive: g.id === goal.id // Activar solo la meta seleccionada
      }));
     
      // Mostrar mensaje de éxito
      alert('Meta nutricional activada correctamente');
    } catch (error) {
      console.error('Error al activar la meta:', error);
      alert('Error al activar la meta nutricional');
    }
   };
   </script>
   
   
   <style scoped>
   .goals-page {
    padding: 20px;
   }
   
   
   h1, h2 {
    margin-bottom: 20px;
    color: #333;
   }
   
   
   .actions {
    margin-bottom: 20px;
   }
   
   
   .goal-form-container {
    margin-bottom: 30px;
   }
   
   
   .goal-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
   }
   
   
   .form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
   }
   
   
   .checkbox-group {
    margin-top: 10px;
   }
   
   
   .checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
   }
   
   
   .help-text {
    font-size: 0.8rem;
    color: #666;
    margin-top: 5px;
    margin-left: 24px;
   }
   
   
   .form-actions {
    display: flex;
    gap: 10px;
    margin-top: 10px;
   }
   
   
   .goals-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
   }
   
   
   .goal-card {
    border-left: 4px solid #ccc;
    transition: all 0.3s ease;
   }
   
   
   .active-goal {
    border-left-color: #4CAF50;
   }
   
   
   .goal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
   }
   
   
   .goal-status {
    display: flex;
    flex-direction: column;
    gap: 5px;
   }
   
   
   .active-badge {
    display: inline-block;
    background-color: #4CAF50;
    color: white;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
   }
   
   
   .inactive-badge {
    display: inline-block;
    background-color: #999;
    color: white;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
   }
   
   
   .goal-date {
    font-size: 0.8rem;
    color: #666;
   }
   
   
   .goal-details {
    display: flex;
    flex-direction: column;
    gap: 15px;
   }
   
   
   .goal-weight {
    font-size: 1.2rem;
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
   }
   
   
   .goal-nutrients {
    display: flex;
    flex-direction: column;
    gap: 8px;
   }
   
   
   .nutrient {
    display: flex;
    justify-content: space-between;
   }
   
   
   .nutrient-label {
    font-weight: bold;
    color: #555;
   }
   
   
   .btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 5px;
    border-radius: 4px;
    transition: background-color 0.2s;
   }
   
   
   .btn-icon:hover {
    background-color: #f1f1f1;
   }
   
   
   .activate {
    color: #4CAF50;
   }
   
   
   .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    text-align: center;
   }
   
   
   .empty-state p {
    margin-bottom: 15px;
    color: #666;
   }
   
   
   .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    color: #666;
   }
   </style>