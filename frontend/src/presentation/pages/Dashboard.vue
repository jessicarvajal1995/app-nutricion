<template>
    <div class="dashboard">
      <h1>Dashboard de Nutrición</h1>
     
      <div class="dashboard-grid">
        <!-- Tarjeta de perfil -->
        <div class="card profile-summary">
          <h2>Mi Perfil</h2>
          <div v-if="userStore.currentUser" class="profile-info">
            <div class="profile-item">
              <span class="label">Nombre:</span>
              <span class="value">{{ userStore.currentUser.name }}</span>
            </div>
            <div class="profile-item">
              <span class="label">Edad:</span>
              <span class="value">{{ userStore.currentUser.age }} años</span>
            </div>
            <div class="profile-item">
              <span class="label">Altura:</span>
              <span class="value">{{ userStore.currentUser.height }} cm</span>
            </div>
            <div class="profile-item">
              <span class="label">Peso actual:</span>
              <span class="value">{{ userStore.currentUser.currentWeight }} kg</span>
            </div>
            <div class="profile-item" v-if="activeGoal">
              <span class="label">Peso objetivo:</span>
              <span class="value">{{ activeGoal.targetWeight }} kg</span>
            </div>
          </div>
          <div v-else-if="userStore.loading" class="loading">
            Cargando perfil...
          </div>
          <div v-else class="empty-state">
            <p>No hay información de perfil disponible.</p>
            <router-link to="/profile" class="btn btn-primary">Crear Perfil</router-link>
          </div>
        </div>
       
        <!-- Tarjeta de metas nutricionales -->
        <div class="card nutritional-goals">
          <h2>Metas Nutricionales</h2>
          <div v-if="activeGoal" class="goals-info">
            <div class="goal-progress">
              <h3>Proteínas</h3>
              <div class="progress-bar-container">
                <div
                  class="progress-bar"
                  :style="{ width: `${calculateProgress(dailyNutrients.protein, activeGoal.proteinGoal)}%` }"
                ></div>
              </div>
              <div class="progress-text">
                {{ dailyNutrients.protein.toFixed(1) }}g / {{ activeGoal.proteinGoal }}g
              </div>
            </div>
           
            <div class="goal-progress">
              <h3>Carbohidratos</h3>
              <div class="progress-bar-container">
                <div
                  class="progress-bar"
                  :style="{ width: `${calculateProgress(dailyNutrients.carbs, activeGoal.carbsGoal)}%` }"
                ></div>
              </div>
              <div class="progress-text">
                {{ dailyNutrients.carbs.toFixed(1) }}g / {{ activeGoal.carbsGoal }}g
              </div>
            </div>
           
            <div class="goal-progress">
              <h3>Grasas</h3>
              <div class="progress-bar-container">
                <div
                  class="progress-bar"
                  :style="{ width: `${calculateProgress(dailyNutrients.fats, activeGoal.fatGoal)}%` }"
                ></div>
              </div>
              <div class="progress-text">
                {{ dailyNutrients.fats.toFixed(1) }}g / {{ activeGoal.fatGoal }}g
              </div>
            </div>
          </div>
          <div v-else-if="goalsLoading" class="loading">
            Cargando metas...
          </div>
          <div v-else class="empty-state">
            <p>No hay metas nutricionales definidas.</p>
            <router-link to="/goals" class="btn btn-primary">Definir Metas</router-link>
          </div>
        </div>
       
        <!-- Tarjeta de comidas recientes -->
        <div class="card recent-meals">
          <h2>Comidas Recientes</h2>
          <div v-if="dailyRecords.length > 0" class="meals-list">
            <div v-for="record in dailyRecords" :key="record.id" class="meal-record">
              <div class="meal-date">{{ formatDate(record.date) }}</div>
              <div v-if="record.dailyDishes && record.dailyDishes.length > 0" class="meal-dishes">
                <div v-for="dailyDish in record.dailyDishes" :key="dailyDish.id" class="meal-dish">
                  <span class="dish-name">{{ dailyDish.dish.name }}</span>
                  <span class="dish-amount">{{ dailyDish.grams }}g</span>
                </div>
              </div>
              <div v-else class="no-dishes">No hay platos registrados</div>
            </div>
          </div>
          <div v-else-if="recordsLoading" class="loading">
            Cargando registros...
          </div>
          <div v-else class="empty-state">
            <p>No hay comidas registradas recientemente.</p>
            <router-link to="/daily-tracking" class="btn btn-primary">Registrar Comida</router-link>
          </div>
        </div>
       
        <!-- Tarjeta de progreso de peso -->
        <div class="card weight-progress">
          <h2>Progreso de Peso</h2>
          <div v-if="weightHistory.length > 0" class="weight-chart">
            <!-- Aquí iría un componente de gráfico, pero por simplicidad usaremos una representación básica -->
            <div class="weight-history">
              <div v-for="(weight, index) in weightHistory" :key="index" class="weight-point">
                <div class="weight-date">{{ formatDate(weight.date) }}</div>
                <div class="weight-value">{{ weight.weight }} kg</div>
              </div>
            </div>
           
            <div v-if="activeGoal" class="weight-goal">
              <div class="goal-label">Meta:</div>
              <div class="goal-value">{{ activeGoal.targetWeight }} kg</div>
              <div class="goal-difference" :class="{ 'positive': weightDifference > 0, 'negative': weightDifference < 0 }">
                {{ Math.abs(weightDifference).toFixed(1) }} kg {{ weightDifference > 0 ? 'por perder' : 'por ganar' }}
              </div>
            </div>
          </div>
          <div v-else-if="weightLoading" class="loading">
            Cargando historial de peso...
          </div>
          <div v-else class="empty-state">
            <p>No hay historial de peso disponible.</p>
            <router-link to="/profile" class="btn btn-primary">Actualizar Peso</router-link>
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
   
   
   // Estado local
   const activeGoal = ref(null);
   const dailyRecords = ref([]);
   const weightHistory = ref([]);
   const dailyNutrients = ref({
    protein: 0,
    carbs: 0,
    fats: 0
   });
   
   
   // Estado de carga
   const goalsLoading = ref(false);
   const recordsLoading = ref(false);
   const weightLoading = ref(false);
   
   
   // Diferencia de peso respecto a la meta
   const weightDifference = computed(() => {
    if (!userStore.currentUser || !activeGoal.value) return 0;
    return userStore.currentUser.currentWeight - activeGoal.value.targetWeight;
   });
   
   
   // Funciones auxiliares
   const calculateProgress = (current, goal) => {
    if (!goal) return 0;
    const percentage = (current / goal) * 100;
    return Math.min(percentage, 100); // Limitar al 100%
   };
   
   
   const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
   };
   
   
   // Cargar datos al montar el componente
   onMounted(async () => {
    // En una aplicación real, estos datos vendrían de los servicios correspondientes
    // Por ahora, usaremos datos de ejemplo
     // Cargar usuario
    if (!userStore.currentUser) {
      // Simulamos la carga del usuario (en una app real, esto vendría del store)
      await userStore.fetchUser('user-id-here');
    }
     // Cargar meta activa
    goalsLoading.value = true;
    setTimeout(() => {
      activeGoal.value = {
        id: 'goal-1',
        userId: 'user-id-here',
        targetWeight: 70,
        proteinGoal: 120,
        carbsGoal: 200,
        fatGoal: 60,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      goalsLoading.value = false;
    }, 500);
     // Cargar registros diarios
    recordsLoading.value = true;
    setTimeout(() => {
      dailyRecords.value = [
        {
          id: 'record-1',
          userId: 'user-id-here',
          date: new Date().toISOString(),
          dailyDishes: [
            {
              id: 'daily-dish-1',
              dishId: 'dish-1',
              grams: 200,
              dish: {
                name: 'Pollo a la plancha'
              }
            },
            {
              id: 'daily-dish-2',
              dishId: 'dish-2',
              grams: 150,
              dish: {
                name: 'Ensalada mixta'
              }
            }
          ]
        },
        {
          id: 'record-2',
          userId: 'user-id-here',
          date: new Date(Date.now() - 86400000).toISOString(), // Ayer
          dailyDishes: [
            {
              id: 'daily-dish-3',
              dishId: 'dish-3',
              grams: 300,
              dish: {
                name: 'Pasta integral'
              }
            }
          ]
        }
      ];
      recordsLoading.value = false;
    }, 700);
     // Cargar historial de peso
    weightLoading.value = true;
    setTimeout(() => {
      weightHistory.value = [
        { date: new Date().toISOString(), weight: 75 },
        { date: new Date(Date.now() - 7 * 86400000).toISOString(), weight: 76 }, // Hace una semana
        { date: new Date(Date.now() - 14 * 86400000).toISOString(), weight: 77 }, // Hace dos semanas
        { date: new Date(Date.now() - 21 * 86400000).toISOString(), weight: 78 } // Hace tres semanas
      ];
      weightLoading.value = false;
    }, 600);
     // Cargar nutrientes diarios
    setTimeout(() => {
      dailyNutrients.value = {
        protein: 85,
        carbs: 150,
        fats: 45
      };
    }, 400);
   });
   </script>
   
   
   <style scoped>
   .dashboard {
    padding: 20px;
   }
   
   
   .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
   }
   
   
   .card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    height: 100%;
   }
   
   
   h1 {
    margin-bottom: 20px;
    color: #333;
   }
   
   
   h2 {
    margin-bottom: 15px;
    color: #4CAF50;
    font-size: 1.2rem;
   }
   
   
   h3 {
    font-size: 1rem;
    margin-bottom: 5px;
   }
   
   
   .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    color: #666;
   }
   
   
   .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 150px;
    text-align: center;
   }
   
   
   .empty-state p {
    margin-bottom: 15px;
    color: #666;
   }
   
   
   /* Estilos para el perfil */
   .profile-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
   }
   
   
   .profile-item {
    display: flex;
    justify-content: space-between;
   }
   
   
   .label {
    font-weight: bold;
    color: #555;
   }
   
   
   /* Estilos para las metas nutricionales */
   .goal-progress {
    margin-bottom: 15px;
   }
   
   
   .progress-bar-container {
    height: 10px;
    background-color: #f1f1f1;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 5px;
   }
   
   
   .progress-bar {
    height: 100%;
    background-color: #4CAF50;
    transition: width 0.3s ease;
   }
   
   
   .progress-text {
    display: flex;
    justify-content: flex-end;
    font-size: 0.9rem;
    color: #666;
   }
   
   
   /* Estilos para las comidas recientes */
   .meals-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-height: 300px;
    overflow-y: auto;
   }
   
   
   .meal-record {
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
   }
   
   
   .meal-date {
    font-weight: bold;
    margin-bottom: 5px;
   }
   
   
   .meal-dishes {
    display: flex;
    flex-direction: column;
    gap: 5px;
   }
   
   
   .meal-dish {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
   }
   
   
   .no-dishes {
    font-style: italic;
    color: #999;
    font-size: 0.9rem;
   }
   
   
   /* Estilos para el progreso de peso */
   .weight-history {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
   }
   
   
   .weight-point {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    border-bottom: 1px dashed #eee;
   }
   
   
   .weight-goal {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
   }
   
   
   .goal-label {
    font-weight: bold;
    margin-bottom: 5px;
   }
   
   
   .goal-difference {
    margin-top: 5px;
    font-size: 0.9rem;
   }
   
   
   .positive {
    color: #f44336;
   }
   
   
   .negative {
    color: #4CAF50;
   }
   
   
   @media (max-width: 768px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
   }
   </style>