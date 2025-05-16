<template>
    <div class="daily-tracking">
      <h1>Registro Diario de Comidas</h1>
     
      <div class="date-selector">
        <button @click="previousDay" class="btn btn-icon">
          &lt;
        </button>
        <div class="current-date">
          <input
            type="date"
            v-model="selectedDate"
            class="date-input"
          />
        </div>
        <button @click="nextDay" class="btn btn-icon" :disabled="isToday">
          &gt;
        </button>
      </div>
     
      <div class="daily-summary card" v-if="!dailyRecordStore.loading">
        <h2>Resumen Nutricional</h2>
       
        <div class="nutrients-summary">
          <div class="nutrient-summary">
            <div class="nutrient-header">
              <span class="nutrient-name">Proteínas</span>
              <span class="nutrient-total">{{ dailyNutrients.protein.toFixed(1) }}g</span>
            </div>
            <div class="progress-bar-container">
              <div
                class="progress-bar"
                :style="{ width: `${calculateProgress(dailyNutrients.protein, activeGoal?.proteinGoal || 100)}%` }"
              ></div>
            </div>
            <div class="nutrient-goal" v-if="activeGoal">
              Meta: {{ activeGoal.proteinGoal }}g
            </div>
          </div>
         
          <div class="nutrient-summary">
            <div class="nutrient-header">
              <span class="nutrient-name">Carbohidratos</span>
              <span class="nutrient-total">{{ dailyNutrients.carbs.toFixed(1) }}g</span>
            </div>
            <div class="progress-bar-container">
              <div
                class="progress-bar"
                :style="{ width: `${calculateProgress(dailyNutrients.carbs, activeGoal?.carbsGoal || 100)}%` }"
              ></div>
            </div>
            <div class="nutrient-goal" v-if="activeGoal">
              Meta: {{ activeGoal.carbsGoal }}g
            </div>
          </div>
         
          <div class="nutrient-summary">
            <div class="nutrient-header">
              <span class="nutrient-name">Grasas</span>
              <span class="nutrient-total">{{ dailyNutrients.fats.toFixed(1) }}g</span>
            </div>
            <div class="progress-bar-container">
              <div
                class="progress-bar"
                :style="{ width: `${calculateProgress(dailyNutrients.fats, activeGoal?.fatGoal || 100)}%` }"
              ></div>
            </div>
            <div class="nutrient-goal" v-if="activeGoal">
              Meta: {{ activeGoal.fatGoal }}g
            </div>
          </div>
         
          <div class="total-calories">
            <span class="calories-label">Calorías totales:</span>
            <span class="calories-value">{{ calculateTotalCalories().toFixed(0) }} kcal</span>
          </div>
        </div>
      </div>
     
      <div class="add-meal-section">
        <button @click="showAddMealForm = true" class="btn btn-primary">
          <span class="icon">+</span> Añadir Comida
        </button>
      </div>
     
      <!-- Formulario para añadir comida -->
      <div v-if="showAddMealForm" class="meal-form-container card">
        <h2>Añadir Comida</h2>
        <form @submit.prevent="addMeal" class="meal-form">
          <div class="form-group">
            <label for="dishSelect">Seleccionar Plato</label>
            <select
              id="dishSelect"
              v-model="mealForm.dishId"
              required
              class="dish-select"
            >
              <option value="" disabled>Selecciona un plato</option>
              <option v-for="dish in dishes" :key="dish.id" :value="dish.id">
                {{ dish.name }}
              </option>
            </select>
            <div class="dish-link">
              <router-link to="/dishes">Gestionar platos</router-link>
            </div>
          </div>
         
          <div class="form-group">
            <label for="dishAmount">Cantidad (gramos)</label>
            <input
              id="dishAmount"
              v-model.number="mealForm.grams"
              type="number"
              min="1"
              step="1"
              required
              placeholder="Ej: 200"
            />
          </div>
         
          <div v-if="selectedDish" class="dish-nutrients">
            <h3>Información Nutricional (para {{ mealForm.grams || 0 }}g)</h3>
            <div class="nutrient-info">
              <div class="nutrient">
                <span class="nutrient-label">Proteínas:</span>
                <span class="nutrient-value">{{ calculateNutrient(selectedDish.proteinPer100g, mealForm.grams).toFixed(1) }}g</span>
              </div>
              <div class="nutrient">
                <span class="nutrient-label">Carbohidratos:</span>
                <span class="nutrient-value">{{ calculateNutrient(selectedDish.carbsPer100g, mealForm.grams).toFixed(1) }}g</span>
              </div>
              <div class="nutrient">
                <span class="nutrient-label">Grasas:</span>
                <span class="nutrient-value">{{ calculateNutrient(selectedDish.fatsPer100g, mealForm.grams).toFixed(1) }}g</span>
              </div>
              <div class="nutrient">
                <span class="nutrient-label">Calorías:</span>
                <span class="nutrient-value">{{ calculateDishCalories(selectedDish, mealForm.grams).toFixed(0) }} kcal</span>
              </div>
            </div>
          </div>
         
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="dailyRecordStore.loading || !mealForm.dishId || !mealForm.grams">
              {{ dailyRecordStore.loading ? 'Añadiendo...' : 'Añadir' }}
            </button>
            <button
              type="button"
              @click="cancelMealForm"
              class="btn btn-secondary"
              :disabled="dailyRecordStore.loading"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
     
      <!-- Lista de comidas del día -->
      <div class="daily-meals">
        <div v-if="dailyRecordStore.loading && !dailyDishes.length" class="loading">
          Cargando comidas...
        </div>
       
        <div v-else-if="dailyDishes.length === 0" class="empty-state">
          <p>No hay comidas registradas para este día.</p>
          <button @click="showAddMealForm = true" class="btn btn-primary">
            Registrar Primera Comida
          </button>
        </div>
       
        <div v-else class="meals-list">
          <div v-for="meal in dailyDishes" :key="meal.id" class="meal-card card">
            <div class="meal-header">
              <h3>{{ meal.dish.name }}</h3>
              <div class="meal-actions">
                <button @click="editMeal(meal)" class="btn-icon edit" :disabled="dailyRecordStore.loading">
                  ✏️
                </button>
                <button @click="deleteMeal(meal)" class="btn-icon delete" :disabled="dailyRecordStore.loading">
                  🗑️
                </button>
              </div>
            </div>
           
            <div class="meal-amount">
              {{ meal.grams }}g
            </div>
           
            <div class="meal-nutrients">
              <div class="nutrient">
                <span class="nutrient-label">Proteínas:</span>
                <span class="nutrient-value">{{ calculateNutrient(meal.dish.proteinPer100g, meal.grams).toFixed(1) }}g</span>
              </div>
              <div class="nutrient">
                <span class="nutrient-label">Carbohidratos:</span>
                <span class="nutrient-value">{{ calculateNutrient(meal.dish.carbsPer100g, meal.grams).toFixed(1) }}g</span>
              </div>
              <div class="nutrient">
                <span class="nutrient-label">Grasas:</span>
                <span class="nutrient-value">{{ calculateNutrient(meal.dish.fatsPer100g, meal.grams).toFixed(1) }}g</span>
              </div>
            </div>
           
            <div class="meal-calories">
              {{ calculateDishCalories(meal.dish, meal.grams).toFixed(0) }} kcal
            </div>
          </div>
        </div>
      </div>
    </div>
   </template>
   
   
   <script setup lang="ts">
   import { ref, computed, watch, onMounted } from 'vue';
   import { useUserStore } from '../../application/store/user';
   import { useGoalStore } from '../../application/store/goal';
   import { useDishStore } from '../../application/store/dish';
   import { useDailyRecordStore } from '../../application/store/dailyRecord';
   
   
   // Stores
   const userStore = useUserStore();
   const goalStore = useGoalStore();
   const dishStore = useDishStore();
   const dailyRecordStore = useDailyRecordStore();
   
   
   // Estado local
   const selectedDate = ref(new Date().toISOString().split('T')[0]); // Formato YYYY-MM-DD
   const showAddMealForm = ref(false);
   
   
   // Formulario para añadir comida
   const mealForm = ref({
    dishId: '',
    grams: 100
   });
   
   
   // Nutrientes diarios
   const dailyNutrients = ref({
    protein: 0,
    carbs: 0,
    fats: 0
   });
   
   
   // Obtener datos de los stores
   const activeGoal = computed(() => goalStore.getActiveGoal);
   const dishes = computed(() => dishStore.getAllDishes);
   const dailyDishes = computed(() => dailyRecordStore.getDailyDishes);
   
   
   // Plato seleccionado en el formulario
   const selectedDish = computed(() => {
    if (!mealForm.value.dishId) return null;
    return dishes.value.find(dish => dish.id === mealForm.value.dishId);
   });
   
   
   // Verificar si la fecha seleccionada es hoy
   const isToday = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return selectedDate.value === today;
   });
   
   
   // Funciones auxiliares
   const calculateProgress = (current, goal) => {
    if (!goal) return 0;
    const percentage = (current / goal) * 100;
    return Math.min(percentage, 100); // Limitar al 100%
   };
   
   
   const calculateNutrient = (per100g, grams) => {
    return (per100g * grams) / 100;
   };
   
   
   const calculateDishCalories = (dish, grams) => {
    if (!dish) return 0;
    // Calorías = (proteínas * 4) + (carbohidratos * 4) + (grasas * 9)
    const proteinCalories = calculateNutrient(dish.proteinPer100g, grams) * 4;
    const carbsCalories = calculateNutrient(dish.carbsPer100g, grams) * 4;
    const fatsCalories = calculateNutrient(dish.fatsPer100g, grams) * 9;
    return proteinCalories + carbsCalories + fatsCalories;
   };
   
   
   const calculateTotalCalories = () => {
    // Calorías = (proteínas * 4) + (carbohidratos * 4) + (grasas * 9)
    return (dailyNutrients.value.protein * 4) +
           (dailyNutrients.value.carbs * 4) +
           (dailyNutrients.value.fats * 9);
   };
   
   
   const previousDay = () => {
    const date = new Date(selectedDate.value);
    date.setDate(date.getDate() - 1);
    selectedDate.value = date.toISOString().split('T')[0];
   };
   
   
   const nextDay = () => {
    if (isToday.  - 1);
    selectedDate.value = date.toISOString().split('T')[0];
   };
   
   
   const nextDay = () => {
    if (isToday.value) return;
     const date = new Date(selectedDate.value);
    date.setDate(date.getDate() + 1);
    selectedDate.value = date.toISOString().split('T')[0];
   };
   
   
   // Calcular nutrientes totales del día
   const calculateDailyNutrients = () => {
    let protein = 0;
    let carbs = 0;
    let fats = 0;
     dailyDishes.value.forEach(meal => {
      protein += calculateNutrient(meal.dish.proteinPer100g, meal.grams);
      carbs += calculateNutrient(meal.dish.carbsPer100g, meal.grams);
      fats += calculateNutrient(meal.dish.fatsPer100g, meal.grams);
    });
     dailyNutrients.value = {
      protein,
      carbs,
      fats
    };
   };
   
   
   // Métodos para gestionar comidas
   const resetMealForm = () => {
    mealForm.value = {
      dishId: '',
      grams: 100
    };
   };
   
   
   const cancelMealForm = () => {
    resetMealForm();
    showAddMealForm.value = false;
   };
   
   
   const addMeal = async () => {
    if (!selectedDish.value || !userStore.currentUser || !dailyRecordStore.currentDailyRecord) return;
     try {
      await dailyRecordStore.addDishToDailyRecord({
        dailyRecordId: dailyRecordStore.currentDailyRecord.id,
        dishId: mealForm.value.dishId,
        grams: mealForm.value.grams
      });
     
      // Recalcular nutrientes
      calculateDailyNutrients();
     
      // Limpiar formulario
      cancelMealForm();
    } catch (error) {
      console.error('Error al añadir la comida:', error);
      alert('Error al añadir la comida. Por favor, inténtalo de nuevo.');
    }
   };
   
   
   const editMeal = async (meal) => {
    // En una implementación real, aquí se abriría un formulario de edición
    // Por simplicidad, solo permitiremos cambiar la cantidad
    const newAmount = prompt('Ingresa la nueva cantidad en gramos:', meal.grams);
     if (newAmount !== null) {
      const amount = parseInt(newAmount);
     
      if (!isNaN(amount) && amount > 0) {
        try {
          // Actualizar la cantidad
          await dailyRecordStore.updateDailyDish(meal.id, amount);
         
          // Recalcular nutrientes
          calculateDailyNutrients();
        } catch (error) {
          console.error('Error al actualizar la comida:', error);
          alert('Error al actualizar la comida. Por favor, inténtalo de nuevo.');
        }
      } else {
        alert('Por favor, ingresa una cantidad válida mayor que cero.');
      }
    }
   };
   
   
   const deleteMeal = async (meal) => {
    if (confirm(`¿Estás seguro de que deseas eliminar ${meal.dish.name}?`)) {
      try {
        // Eliminar comida
        await dailyRecordStore.removeDishFromDailyRecord(meal.id);
       
        // Recalcular nutrientes
        calculateDailyNutrients();
      } catch (error) {
        console.error('Error al eliminar la comida:', error);
        alert('Error al eliminar la comida. Por favor, inténtalo de nuevo.');
      }
    }
   };
   
   
   // Cargar datos al montar el componente
   onMounted(async () => {
    if (!userStore.currentUser) {
      // En una aplicación real, redirigir al login o cargar el usuario
      // Por ahora, usaremos un ID de usuario de ejemplo
      await userStore.fetchUser('user-id-here');
    }
     try {
      // Cargar platos si no están cargados
      if (dishes.value.length === 0) {
        await dishStore.fetchAllDishes();
      }
     
      // Cargar meta activa si no está cargada
      if (!activeGoal.value) {
        await goalStore.fetchActiveGoal(userStore.currentUser.id);
      }
     
      // Cargar comidas del día
      await loadDailyMeals();
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
   });
   
   
   // Cargar comidas cuando cambia la fecha
   watch(selectedDate, () => {
    loadDailyMeals();
   });
   
   
   // Recalcular nutrientes cuando cambian las comidas
   watch(dailyDishes, () => {
    calculateDailyNutrients();
   }, { deep: true });
   
   
   // Función para cargar las comidas del día seleccionado
   const loadDailyMeals = async () => {
    if (!userStore.currentUser) return;
     try {
      await dailyRecordStore.fetchDailyRecordByDate(userStore.currentUser.id, selectedDate.value);
      calculateDailyNutrients();
    } catch (error) {
      console.error('Error al cargar las comidas del día:', error);
    }
   };
   </script>
   
   
   <style scoped>
   /* Los estilos se mantienen igual que en el componente original */
   </style>
   