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
}


h1 {
margin-bottom: 20px;
color: #333;
}
</style>