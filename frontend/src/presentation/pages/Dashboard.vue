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
            <div class="profile-item" v-if="goalStore.activeGoal">
              <span class="label">Peso objetivo:</span>
              <span class="value">{{ goalStore.activeGoal.targetWeight }} kg</span>
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
          <div v-if="goalStore.activeGoal" class="goals-info">
            <div class="goal-progress">
              <h3>Proteínas</h3>
              <div class="progress-bar-container">
                <div
                  class="progress-bar"
                  :style="{ width: `${calculateProgress(dailyNutrients.protein, goalStore.activeGoal.proteinGoal)}%` }"
                ></div>
              </div>
              <div class="progress-text">
                {{ dailyNutrients.protein.toFixed(1) }}g / {{ goalStore.activeGoal.proteinGoal }}g
              </div>
            </div>
           
            <div class="goal-progress">
              <h3>Carbohidratos</h3>
              <div class="progress-bar-container">
                <div
                  class="progress-bar"
                  :style="{ width: `${calculateProgress(dailyNutrients.carbs, goalStore.activeGoal.carbsGoal)}%` }"
                ></div>
              </div>
              <div class="progress-text">
                {{ dailyNutrients.carbs.toFixed(1) }}g / {{ goalStore.activeGoal.carbsGoal }}g
              </div>
            </div>
           
            <div class="goal-progress">
              <h3>Grasas</h3>
              <div class="progress-bar-container">
                <div
                  class="progress-bar"
                  :style="{ width: `${calculateProgress(dailyNutrients.fats, goalStore.activeGoal.fatGoal)}%` }"
                ></div>
              </div>
              <div class="progress-text">
                {{ dailyNutrients.fats.toFixed(1) }}g / {{ goalStore.activeGoal.fatGoal }}g
              </div>
            </div>
          </div>
          <div v-else-if="goalStore.loading" class="loading">
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
          <div v-else-if="dailyRecordStore.loading" class="loading">
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
           
            <div v-if="goalStore.activeGoal" class="weight-goal">
              <div class="goal-label">Meta:</div>
              <div class="goal-value">{{ goalStore.activeGoal.targetWeight }} kg</div>
              <div class="goal-difference" :class="{ 'positive': weightDifference > 0, 'negative': weightDifference < 0 }">
                {{ Math.abs(weightDifference).toFixed(1) }} kg {{ weightDifference > 0 ? 'por perder' : 'por ganar' }}
              </div>
            </div>
          </div>
          <div v-else-if="loadingWeightHistory" class="loading">
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
   import { useGoalStore } from '../../application/store/goal';
   import { useDailyRecordStore } from '../../application/store/dailyRecord';
   
   
   // Stores
   const userStore = useUserStore();
   const goalStore = useGoalStore();
   const dailyRecordStore = useDailyRecordStore();
   
   
   // Estado local
   const dailyRecords = ref([]);
   const weightHistory = ref([]);
   const dailyNutrients = ref({
    protein: 0,
    carbs: 0,
    fats: 0
   });
   const loadingWeightHistory = ref(false);
   
   
   // Diferencia de peso respecto a la meta
   const weightDifference = computed(() => {
    if (!userStore.currentUser || !goalStore.activeGoal) return 0;
    return userStore.currentUser.currentWeight - goalStore.activeGoal.targetWeight;
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
   
   
   // Calcular nutrientes totales del día actual
   const calculateDailyNutrients = () => {
    if (!dailyRecordStore.currentDailyRecord || !dailyRecordStore.currentDailyRecord.dailyDishes) {
      dailyNutrients.value = { protein: 0, carbs: 0, fats: 0 };
      return;
    }
     let protein = 0;
    let carbs = 0;
    let fats = 0;
     dailyRecordStore.currentDailyRecord.dailyDishes.forEach(meal => {
      if (meal.dish) {
        protein += (meal.dish.proteinPer100g * meal.grams) / 100;
        carbs += (meal.dish.carbsPer100g * meal.grams) / 100;
        fats += (meal.dish.fatsPer100g * meal.grams) / 100;
      }
    });
     dailyNutrients.value = {
      protein,
      carbs,
      fats
    };
   };
   
   
   // Cargar datos al montar el componente
   onMounted(async () => {
    if (!userStore.currentUser) {
      // En una aplicación real, redirigir al login o cargar el usuario
      // Por ahora, usaremos un ID de usuario de ejemplo
      await userStore.fetchUser('user-id-here');
    }
     try {
      // Cargar meta activa si no está cargada
      if (!goalStore.activeGoal) {
        await goalStore.fetchActiveGoal(userStore.currentUser.id);
      }
     
      // Cargar registros diarios recientes
      await loadDailyRecords();
     
      // Cargar registro del día actual para los nutrientes
      const today = new Date().toISOString().split('T')[0];
      await dailyRecordStore.fetchDailyRecordByDate(userStore.currentUser.id, today);
      calculateDailyNutrients();
     
      // Cargar historial de peso
      await loadWeightHistory();
    } catch (error) {
      console.error('Error al cargar los datos del dashboard:', error);
    }
   });
   
   
   // Cargar registros diarios recientes
   const loadDailyRecords = async () => {
    if (!userStore.currentUser) return;
     try {
      const records = await dailyRecordStore.fetchDailyRecordsByUserId(userStore.currentUser.id);
      // Ordenar por fecha (más reciente primero) y limitar a los últimos 5
      dailyRecords.value = records
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
    } catch (error) {
      console.error('Error al cargar los registros diarios:', error);
    }
   };
   
   
   // Cargar historial de peso
   const loadWeightHistory = async () => {
    if (!userStore.currentUser) return;
     loadingWeightHistory.value = true;
     try {
      // En una aplicación real, esto vendría de un servicio específico
      // Por ahora, simularemos el historial de peso
     
      // Peso actual
      const currentWeight = userStore.currentUser.currentWeight;
     
      // Generar historial de peso simulado (últimos 4 registros)
      weightHistory.value = [
        { date: new Date().toISOString(), weight: currentWeight },
        { date: new Date(Date.now() - 7 * 86400000).toISOString(), weight: currentWeight + 0.5 }, // Hace una semana
        { date: new Date(Date.now() - 14 * 86400000).toISOString(), weight: currentWeight + 1 }, // Hace dos semanas
        { date: new Date(Date.now() - 21 * 86400000).toISOString(), weight: currentWeight + 1.5 } // Hace tres semanas
      ];
    } catch (error) {
      console.error('Error al cargar el historial de peso:', error);
    } finally {
      loadingWeightHistory.value = false;
    }
   };
   </script>
   
   
   <style scoped>
   /* Los estilos se mantienen igual que en el componente original */
   </style>
   