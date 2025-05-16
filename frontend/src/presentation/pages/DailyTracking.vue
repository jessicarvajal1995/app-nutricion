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
     
      <div class="daily-summary card" v-if="!loading">
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
            <button type="submit" class="btn btn-primary" :disabled="!mealForm.dishId || !mealForm.grams">
              Añadir
            </button>
            <button
              type="button"
              @click="cancelMealForm"
              class="btn btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
     
      <!-- Lista de comidas del día -->
      <div class="daily-meals">
        <div v-if="loading" class="loading">
          Cargando comidas...
        </div>
       
        <div v-else-if="dailyMeals.length === 0" class="empty-state">
          <p>No hay comidas registradas para este día.</p>
          <button @click="showAddMealForm = true" class="btn btn-primary">
            Registrar Primera Comida
          </button>
        </div>
       
        <div v-else class="meals-list">
          <div v-for="meal in dailyMeals" :key="meal.id" class="meal-card card">
            <div class="meal-header">
              <h3>{{ meal.dish.name }}</h3>
              <div class="meal-actions">
                <button @click="editMeal(meal)" class="btn-icon edit">
                  ✏️
                </button>
                <button @click="deleteMeal(meal)" class="btn-icon delete">
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
   
   
   // Estado
   const selectedDate = ref(new Date().toISOString().split('T')[0]); // Formato YYYY-MM-DD
   const loading = ref(true);
   const dishes = ref([]);
   const dailyMeals = ref([]);
   const activeGoal = ref(null);
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
     dailyMeals.value.forEach(meal => {
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
   
   
   const addMeal = () => {
    if (!selectedDish.value) return;
     // Crear nueva comida
    const newMeal = {
      id: `meal-${Date.now()}`, // Generar ID único (en una app real, esto lo haría el backend)
      dishId: mealForm.value.dishId,
      grams: mealForm.value.grams,
      dish: selectedDish.value
    };
     // Añadir a la lista
    dailyMeals.value.push(newMeal);
     // Recalcular nutrientes
    calculateDailyNutrients();
     // Limpiar formulario
    cancelMealForm();
   };
   
   
   const editMeal = (meal) => {
    // En una implementación real, aquí se abriría un formulario de edición
    // Por simplicidad, solo permitiremos cambiar la cantidad
    const newAmount = prompt('Ingresa la nueva cantidad en gramos:', meal.grams);
     if (newAmount !== null) {
      const amount = parseInt(newAmount);
     
      if (!  meal.grams);
     if (newAmount !== null) {
      const amount = parseInt(newAmount);
     
      if (!isNaN(amount) && amount > 0) {
        // Actualizar la cantidad
        meal.grams = amount;
       
        // Recalcular nutrientes
        calculateDailyNutrients();
      } else {
        alert('Por favor, ingresa una cantidad válida mayor que cero.');
      }
    }
   };
   
   
   const deleteMeal = (meal) => {
    if (confirm(`¿Estás seguro de que deseas eliminar ${meal.dish.name}?`)) {
      // Eliminar comida
      dailyMeals.value = dailyMeals.value.filter(m => m.id !== meal.id);
     
      // Recalcular nutrientes
      calculateDailyNutrients();
    }
   };
   
   
   // Cargar datos al montar el componente
   onMounted(async () => {
    // En una aplicación real, estos datos vendrían de servicios
    // Por ahora, usaremos datos de ejemplo
     // Cargar platos
    dishes.value = [
      {
        id: 'dish-1',
        name: 'Pollo a la plancha',
        proteinPer100g: 25.3,
        carbsPer100g: 0,
        fatsPer100g: 7.5
      },
      {
        id: 'dish-2',
        name: 'Ensalada mixta',
        proteinPer100g: 1.5,
        carbsPer100g: 3.2,
        fatsPer100g: 0.3
      },
      {
        id: 'dish-3',
        name: 'Pasta integral',
        proteinPer100g: 5.3,
        carbsPer100g: 30.6,
        fatsPer100g: 1.1
      },
      {
        id: 'dish-4',
        name: 'Salmón al horno',
        proteinPer100g: 22.1,
        carbsPer100g: 0,
        fatsPer100g: 13.4
      }
    ];
     // Cargar meta activa
    activeGoal.value = {
      id: 'goal-1',
      userId: 'user-id-here',
      targetWeight: 70,
      proteinGoal: 120,
      carbsGoal: 200,
      fatGoal: 60,
      isActive: true
    };
     // Cargar comidas del día
    loadDailyMeals();
   });
   
   
   // Cargar comidas cuando cambia la fecha
   watch(selectedDate, () => {
    loadDailyMeals();
   });
   
   
   // Función para cargar las comidas del día seleccionado
   const loadDailyMeals = () => {
    loading.value = true;
     // En una aplicación real, esto se haría a través de un servicio
    // Por ahora, simularemos la operación
    setTimeout(() => {
      // Generar datos de ejemplo diferentes según la fecha
      const dateHash = selectedDate.value.split('-').reduce((a, b) => a + parseInt(b), 0);
     
      if (dateHash % 3 === 0) {
        // Día sin comidas
        dailyMeals.value = [];
      } else {
        // Día con comidas
        dailyMeals.value = [
          {
            id: `meal-1-${selectedDate.value}`,
            dishId: 'dish-1',
            grams: 200,
            dish: dishes.value.find(d => d.id === 'dish-1')
          }
        ];
       
        // Añadir más comidas según la fecha
        if (dateHash % 2 === 0) {
          dailyMeals.value.push({
            id: `meal-2-${selectedDate.value}`,
            dishId: 'dish-2',
            grams: 150,
            dish: dishes.value.find(d => d.id === 'dish-2')
          });
        }
       
        if (dateHash % 5 === 0) {
          dailyMeals.value.push({
            id: `meal-3-${selectedDate.value}`,
            dishId: 'dish-3',
            grams: 300,
            dish: dishes.value.find(d => d.id === 'dish-3')
          });
        }
      }
     
      // Calcular nutrientes
      calculateDailyNutrients();
     
      loading.value = false;
    }, 500);
   };
   </script>
   
   
   <style scoped>
   .daily-tracking {
    padding: 20px;
   }
   
   
   h1, h2, h3 {
    margin-bottom: 20px;
    color: #333;
   }
   
   
   .date-selector {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    gap: 10px;
   }
   
   
   .current-date {
    font-size: 1.2rem;
    font-weight: bold;
   }
   
   
   .date-input {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
   }
   
   
   .btn-icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    border-radius: 50%;
    background-color: #f1f1f1;
    border: none;
    cursor: pointer;
   }
   
   
   .btn-icon:hover:not(:disabled) {
    background-color: #e0e0e0;
   }
   
   
   .btn-icon:disabled {
    opacity: 0.5;
    cursor: not-allowed;
   }
   
   
   .daily-summary {
    margin-bottom: 30px;
   }
   
   
   .nutrients-summary {
    display: flex;
    flex-direction: column;
    gap: 20px;
   }
   
   
   .nutrient-summary {
    display: flex;
    flex-direction: column;
    gap: 5px;
   }
   
   
   .nutrient-header {
    display: flex;
    justify-content: space-between;
   }
   
   
   .nutrient-name {
    font-weight: bold;
   }
   
   
   .progress-bar-container {
    height: 10px;
    background-color: #f1f1f1;
    border-radius: 5px;
    overflow: hidden;
   }
   
   
   .progress-bar {
    height: 100%;
    background-color: #4CAF50;
    transition: width 0.3s ease;
   }
   
   
   .nutrient-goal {
    text-align: right;
    font-size: 0.9rem;
    color: #666;
   }
   
   
   .total-calories {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    font-weight: bold;
   }
   
   
   .calories-value {
    color: #4CAF50;
   }
   
   
   .add-meal-section {
    margin-bottom: 20px;
   }
   
   
   .meal-form-container {
    margin-bottom: 30px;
   }
   
   
   .meal-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
   }
   
   
   .form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
   }
   
   
   .dish-select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
   }
   
   
   .dish-link {
    margin-top: 5px;
    font-size: 0.9rem;
   }
   
   
   .dish-nutrients {
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 4px;
    margin-top: 10px;
   }
   
   
   .dish-nutrients h3 {
    margin-bottom: 10px;
    font-size: 1rem;
   }
   
   
   .nutrient-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
   }
   
   
   .form-actions {
    display: flex;
    gap: 10px;
    margin-top: 10px;
   }
   
   
   .meals-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
   }
   
   
   .meal-card {
    display: flex;
    flex-direction: column;
   }
   
   
   .meal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
   }
   
   
   .meal-header h3 {
    margin: 0;
    flex: 1;
   }
   
   
   .meal-actions {
    display: flex;
    gap: 5px;
   }
   
   
   .btn-icon.edit, .btn-icon.delete {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 2px;
   }
   
   
   .meal-amount {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 10px;
   }
   
   
   .meal-nutrients {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 10px;
   }
   
   
   .nutrient {
    display: flex;
    justify-content: space-between;
   }
   
   
   .nutrient-label {
    color: #555;
   }
   
   
   .meal-calories {
    margin-top: auto;
    padding-top: 10px;
    border-top: 1px solid #eee;
    text-align: right;
    font-weight: bold;
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
   
   
   @media (max-width: 768px) {
    .meals-list {
      grid-template-columns: 1fr;
    }
   }
   </style>
   