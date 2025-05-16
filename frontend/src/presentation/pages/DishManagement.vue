<template>
    <div class="dish-management">
      <h1>Gestión de Platos</h1>
     
      <div class="actions">
        <button @click="showAddDishForm = true" class="btn btn-primary">
          <span class="icon">+</span> Añadir Nuevo Plato
        </button>
        <div class="search-container">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Buscar platos..."
            class="search-input"
          />
        </div>
      </div>
     
      <!-- Formulario para añadir/editar plato -->
      <div v-if="showAddDishForm || editingDish" class="dish-form-container card">
        <h2>{{ editingDish ? 'Editar Plato' : 'Añadir Nuevo Plato' }}</h2>
        <form @submit.prevent="saveDish" class="dish-form">
          <div class="form-group">
            <label for="dishName">Nombre del Plato</label>
            <input
              id="dishName"
              v-model="dishForm.name"
              type="text"
              required
              placeholder="Ej: Ensalada César"
            />
          </div>
         
          <div class="form-group">
            <label for="proteinPer100g">Proteínas (g por 100g)</label>
            <input
              id="proteinPer100g"
              v-model.number="dishForm.proteinPer100g"
              type="number"
              min="0"
              step="0.1"
              required
              placeholder="Ej: 25.5"
            />
          </div>
         
          <div class="form-group">
            <label for="carbsPer100g">Carbohidratos (g por 100g)</label>
            <input
              id="carbsPer100g"
              v-model.number="dishForm.carbsPer100g"
              type="number"
              min="0"
              step="0.1"
              required
              placeholder="Ej: 5.2"
            />
          </div>
         
          <div class="form-group">
            <label for="fatsPer100g">Grasas (g por 100g)</label>
            <input
              id="fatsPer100g"
              v-model.number="dishForm.fatsPer100g"
              type="number"
              min="0"
              step="0.1"
              required
              placeholder="Ej: 10.3"
            />
          </div>
         
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="dishStore.loading">
              {{ dishStore.loading ? 'Guardando...' : (editingDish ? 'Actualizar' : 'Guardar') }}
            </button>
            <button
              type="button"
              @click="cancelDishForm"
              class="btn btn-secondary"
              :disabled="dishStore.loading"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
     
      <!-- Lista de platos -->
      <div class="dishes-container">
        <div v-if="dishStore.loading && !dishes.length" class="loading">
          Cargando platos...
        </div>
       
        <div v-else-if="filteredDishes.length === 0 && !searchQuery" class="empty-state">
          <p>No hay platos registrados todavía.</p>
          <button @click="showAddDishForm = true" class="btn btn-primary">
            Añadir Primer Plato
          </button>
        </div>
       
        <div v-else-if="filteredDishes.length === 0 && searchQuery" class="empty-state">
          <p>No se encontraron platos que coincidan con "{{ searchQuery }}".</p>
          <button @click="searchQuery = ''" class="btn btn-secondary">
            Limpiar Búsqueda
          </button>
        </div>
       
        <div v-else class="dishes-list">
          <div v-for="dish in filteredDishes" :key="dish.id" class="dish-card card">
            <div class="dish-header">
              <h3>{{ dish.name }}</h3>
              <div class="dish-actions">
                <button @click="editDish(dish)" class="btn-icon edit">
                  ✏️
                </button>
                <button @click="confirmDeleteDish(dish)" class="btn-icon delete">
                  🗑️
                </button>
              </div>
            </div>
           
            <div class="dish-nutrients">
              <div class="nutrient">
                <span class="nutrient-label">Proteínas:</span>
                <span class="nutrient-value">{{ dish.proteinPer100g }}g</span>
              </div>
              <div class="nutrient">
                <span class="nutrient-label">Carbohidratos:</span>
                <span class="nutrient-value">{{ dish.carbsPer100g }}g</span>
              </div>
              <div class="nutrient">
                <span class="nutrient-label">Grasas:</span>
                <span class="nutrient-value">{{ dish.fatsPer100g }}g</span>
              </div>
            </div>
           
            <div class="dish-footer">
              <span class="dish-info">Por cada 100g</span>
            </div>
          </div>
        </div>
      </div>
     
      <!-- Modal de confirmación para eliminar -->
      <div v-if="showDeleteConfirm" class="modal-overlay">
        <div class="modal-content card">
          <h3>Confirmar Eliminación</h3>
          <p>¿Estás seguro de que deseas eliminar el plato "{{ dishToDelete?.name }}"?</p>
          <p class="warning">Esta acción no se puede deshacer.</p>
          <div class="modal-actions">
            <button @click="deleteDish" class="btn btn-danger" :disabled="dishStore.loading">
              {{ dishStore.loading ? 'Eliminando...' : 'Eliminar' }}
            </button>
            <button @click="showDeleteConfirm = false" class="btn btn-secondary" :disabled="dishStore.loading">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
   </template>
   
   
   <script setup lang="ts">
   import { ref, computed, onMounted } from 'vue';
   import { useDishStore } from '../../application/store/dish';
   import { Dish } from '../../domain/entities/Dish';
   
   
   // Stores
   const dishStore = useDishStore();
   
   
   // Estado local
   const searchQuery = ref('');
   const showAddDishForm = ref(false);
   const editingDish = ref(null);
   const showDeleteConfirm = ref(false);
   const dishToDelete = ref(null);
   
   
   // Formulario para añadir/editar plato
   const dishForm = ref({
    name: '',
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatsPer100g: 0
   });
   
   
   // Obtener platos del store
   const dishes = computed(() => dishStore.getAllDishes);
   
   
   // Platos filtrados según la búsqueda
   const filteredDishes = computed(() => {
    if (!searchQuery.value) return dishes.value;
     const query = searchQuery.value.toLowerCase();
    return dishes.value.filter(dish =>
      dish.name.toLowerCase().includes(query)
    );
   });
   
   
   // Cargar platos
   onMounted(async () => {
    try {
      await dishStore.fetchAllDishes();
    } catch (error) {
      console.error('Error al cargar los platos:', error);
    }
   });
   
   
   // Métodos para gestionar platos
   const resetDishForm = () => {
    dishForm.value = {
      name: '',
      proteinPer100g: 0,
      carbsPer100g: 0,
      fatsPer100g: 0
    };
   };
   
   
   const cancelDishForm = () => {
    resetDishForm();
    showAddDishForm.value = false;
    editingDish.value = null;
   };
   
   
   const editDish = (dish) => {
    editingDish.value = dish;
    dishForm.value = {
      name: dish.name,
      proteinPer100g: dish.proteinPer100g,
      carbsPer100g: dish.carbsPer100g,
      fatsPer100g: dish.fatsPer100g
    };
   };
   
   
   const saveDish = async () => {
    try {
      if (editingDish.value) {
        // Actualizar plato existente
        await dishStore.updateDish(editingDish.value.id, dishForm.value);
      } else {
        // Crear nuevo plato
        await dishStore.createDish(dishForm.value);
      }
     
      // Limpiar formulario
      cancelDishForm();
    } catch (error) {
      console.error('Error al guardar el plato:', error);
      alert('Error al guardar el plato. Por favor, inténtalo de nuevo.');
    }
   };
   
   
   const confirmDeleteDish = (dish) => {
    dishToDelete.value = dish;
    showDeleteConfirm.value = true;
   };
   
   
   const deleteDish = async () => {
    if (!dishToDelete.value) return;
     try {
      // Eliminar plato
      await dishStore.deleteDish(dishToDelete.value.id);
     
      // Cerrar modal
      showDeleteConfirm.value = false;
      dishToDelete.value = null;
    } catch (error) {
      console.error('Error al eliminar el plato:', error);
      alert('Error al eliminar el plato. Por favor, inténtalo de nuevo.');
    }
   };
   </script>
   
   
   <style scoped>
   /* Los estilos se mantienen igual que en el componente original */
   </style>
   