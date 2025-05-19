<template>
  <div class="app">
    <header class="app-header">
      <nav class="app-nav">
        <router-link to="/" class="nav-link">Dashboard</router-link>
        <router-link to="/profile" class="nav-link">Perfil</router-link>
        <router-link to="/dishes" class="nav-link">Platos</router-link>
        <router-link to="/daily-tracking" class="nav-link">Registro Diario</router-link>
        <router-link to="/goals" class="nav-link">Metas</router-link>
      </nav>
    </header>
   
    <main class="app-content">
      <router-view />
    </main>
   
    <footer class="app-footer">
      <p>&copy; {{ new Date().getFullYear() }} App de Nutrición</p>
    </footer>
  </div>
 </template>
 
 
 <script setup lang="ts">
 // No se necesita lógica adicional aquí
 </script>
 
 
 <style>
/* Estilos globales */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Poppins', 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #fdf4f5;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: #f8a4c0;
  color: white;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(248, 164, 192, 0.15);
}

.app-nav {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 30px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover,
.router-link-active {
  background-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.app-content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  background-color: #564256;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}

/* Estilos de formularios comunes */
input, select, textarea, button {
  font-family: inherit;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 8px 12px;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #f8a4c0;
  box-shadow: 0 0 0 2px rgba(248, 164, 192, 0.2);
}

h1, h2, h3 {
  margin-bottom: 1rem;
  color: #564256;
}

.btn {
  padding: 10px 18px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary {
  background-color: #f8a4c0;
  color: white;
  box-shadow: 0 4px 6px rgba(248, 164, 192, 0.25);
}

.btn-primary:hover {
  background-color: #f591b2;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(248, 164, 192, 0.3);
}

.btn-secondary {
  background-color: #f1f1f1;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e7e7e7;
  transform: translateY(-2px);
}

.card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.07);
}

/* Clases de utilidad */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #888;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #888;
}

.empty-state p {
  margin-bottom: 1rem;
}

.progress-bar-container {
  width: 100%;
  height: 12px;
  background-color: #f1f1f1;
  border-radius: 6px;
  overflow: hidden;
  margin: 8px 0;
}

.progress-bar {
  height: 100%;
  background-color: #f8a4c0;
  border-radius: 6px;
  transition: width 0.5s ease;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 1.5rem;
}

/* Añadido para más consistencia en todos los formularios */
label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #564256;
}

.icon {
  font-size: 1.2em;
}

/* Estilos para errores */
.error {
  color: #e74c3c;
  margin: 8px 0;
  font-size: 0.9rem;
}

/* Animaciones y transiciones */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
</style>
