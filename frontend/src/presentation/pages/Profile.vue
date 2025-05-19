<template>
  <div class="profile-page">
    <h1>Mi Perfil</h1>
    <UserProfile />
  </div>
</template>
 
 
<script setup lang="ts">
import UserProfile from '../components/user/UserProfile.vue';
</script>


<style scoped>
.profile-page {
padding: 20px;
max-width: 800px;
margin: 0 auto;
animation: fadeIn 0.5s ease-in-out;
}

h1 {
font-size: 1.8rem;
margin-bottom: 1.5rem;
color: #564256;
text-align: center;
}

@keyframes fadeIn {
from { opacity: 0; transform: translateY(20px); }
to { opacity: 1; transform: translateY(0); }
}
</style>
