import { createRouter, createWebHistory } from 'vue-router';


const routes = [
 {
   path: '/',
   name: 'Dashboard',
   component: () => import('./presentation/pages/Dashboard.vue'),
 },
 {
   path: '/profile',
   name: 'Profile',
   component: () => import('./presentation/pages/Profile.vue'),
 },
 {
   path: '/dishes',
   name: 'DishManagement',
   component: () => import('./presentation/pages/DishManagement.vue'),
 },
 {
   path: '/daily-tracking',
   name: 'DailyTracking',
   component: () => import('./presentation/pages/DailyTracking.vue'),
 },
 {
   path: '/goals',
   name: 'Goals',
   component: () => import('./presentation/pages/Goals.vue'),
 },
];


const router = createRouter({
 history: createWebHistory(),
 routes,
});


export default router;