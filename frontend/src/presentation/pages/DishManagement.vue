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
.dish-management {
padding: 20px;
animation: fadeIn 0.5s ease-in-out;
}

h1 {
font-size: 1.8rem;
margin-bottom: 1.5rem;
color: #564256;
text-align: center;
}

.actions {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 30px;
flex-wrap: wrap;
gap: 15px;
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

.search-container {
flex: 1;
max-width: 400px;
position: relative;
}

.search-input {
width: 100%;
padding: 12px 20px;
padding-left: 40px;
border: 1px solid #e1e1e1;
border-radius: 30px;
background-color: white;
transition: all 0.3s ease;
}

.search-input:focus {
border-color: #f8a4c0;
box-shadow: 0 0 0 3px rgba(248, 164, 192, 0.15);
outline: none;
}

.search-container::before {
content: "🔍";
position: absolute;
left: 15px;
top: 50%;
transform: translateY(-50%);
color: #888;
}

.dish-form-container {
margin-bottom: 30px;
animation: slideDown 0.4s ease-in-out;
}

.dish-form-container h2 {
color: #564256;
font-size: 1.4rem;
margin-bottom: 20px;
padding-bottom: 10px;
border-bottom: 2px solid #fde9f0;
text-align: center;
}

.dish-form {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 20px;
}

.form-group {
display: flex;
flex-direction: column;
gap: 8px;
}

label {
font-weight: 500;
color: #564256;
}

input {
padding: 12px;
border: 1px solid #e1e1e1;
border-radius: 8px;
transition: all 0.3s ease;
}

input:focus {
border-color: #f8a4c0;
box-shadow: 0 0 0 3px rgba(248, 164, 192, 0.15);
}

.form-actions {
grid-column: 1 / -1;
display: flex;
gap: 15px;
margin-top: 20px;
}

.dishes-container {
margin-top: 30px;
}

.dishes-list {
display: grid;
grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
gap: 20px;
}

.dish-card {
border-radius: 12px;
overflow: hidden;
transition: all 0.3s ease;
}

.dish-card:hover {
transform: translateY(-5px);
box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.dish-header {
padding: 15px;
background-color: #fde9f0;
display: flex;
justify-content: space-between;
align-items: center;
}

.dish-header h3 {
margin: 0;
color: #564256;
font-size: 1.1rem;
}

.dish-actions {
display: flex;
gap: 8px;
}

.btn-icon.edit, .btn-icon.delete {
width: 30px;
height: 30px;
display: flex;
align-items: center;
justify-content: center;
border: none;
border-radius: 50%;
cursor: pointer;
font-size: 1rem;
transition: all 0.3s ease;
background-color: white;
}

.btn-icon.edit:hover {
background-color: #f8a4c0;
color: white;
}

.btn-icon.delete:hover {
background-color: #e74c3c;
color: white;
}

.dish-nutrients {
padding: 15px;
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 10px;
}

.nutrient {
display: flex;
flex-direction: column;
gap: 5px;
}

.nutrient-label {
font-size: 0.9rem;
color: #666;
}

.nutrient-value {
font-weight: 600;
color: #564256;
}

.dish-footer {
padding: 10px 15px;
background-color: #f9f9f9;
text-align: center;
font-size: 0.85rem;
color: #888;
}

.modal-overlay {
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
align-items: center;
justify-content: center;
z-index: 1000;
animation: fadeIn 0.3s ease-in-out;
}

.modal-content {
width: 90%;
max-width: 400px;
padding: 25px;
background-color: white;
border-radius: 12px;
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
animation: zoomIn 0.3s ease-in-out;
}

.modal-content h3 {
color: #564256;
margin-bottom: 15px;
}

.modal-content p {
margin-bottom: 20px;
color: #666;
}

.warning {
color: #e74c3c;
font-weight: 500;
font-size: 0.9rem;
}

.modal-actions {
display: flex;
gap: 15px;
}

.btn-danger {
background-color: #e74c3c;
color: white;
flex: 1;
}

.btn-danger:hover {
background-color: #c0392b;
}

.btn-secondary {
background-color: #f1f1f1;
color: #666;
flex: 1;
}

.empty-state {
padding: 40px;
text-align: center;
background-color: white;
border-radius: 12px;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.empty-state p {
margin-bottom: 20px;
color: #666;
}

.loading {
display: flex;
justify-content: center;
align-items: center;
padding: 40px;
background-color: white;
border-radius: 12px;
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

@keyframes fadeIn {
from { opacity: 0; }
to { opacity: 1; }
}

@keyframes zoomIn {
from { opacity: 0; transform: scale(0.95); }
to { opacity: 1; transform: scale(1); }
}

@keyframes slideDown {
from { opacity: 0; transform: translateY(-20px); }
to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
.actions {
  flex-direction: column;
  align-items: stretch;
}

.search-container {
  max-width: none;
}

.dish-form {
  grid-template-columns: 1fr;
}

.modal-actions {
  flex-direction: column;
}
}
</style>
