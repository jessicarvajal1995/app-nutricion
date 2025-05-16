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
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f9f9f9;
 }
 
 
 .app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
 }
 
 
 .app-header {
  background-color: #4CAF50;
  color: white;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
 }
 
 
 .app-nav {
  display: flex;
  gap: 20px;
  justify-content: center;
 }
 
 
 .nav-link {
  color: white;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
 }
 
 
 .nav-link:hover,
 .router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
 }
 
 
 .app-content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
 }
 
 
 .app-footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
 }
 
 
 /* Estilos de formularios comunes */
 input, select, textarea, button {
  font-family: inherit;
  font-size: 1rem;
 }
 
 
 h1, h2, h3 {
  margin-bottom: 1rem;
 }
 
 
 .btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
 }
 
 
 .btn-primary {
  background-color: #4CAF50;
  color: white;
 }
 
 
 .btn-primary:hover {
  background-color: #45a049;
 }
 
 
 .btn-secondary {
  background-color: #f1f1f1;
  color: #333;
 }
 
 
 .btn-secondary:hover {
  background-color: #e7e7e7;
 }
 
 
 .card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
 }
 </style>
 