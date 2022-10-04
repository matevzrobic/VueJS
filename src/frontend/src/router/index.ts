import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Domov from '../views/Domov.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Profile from '../views/Profile.vue';
import Help from '../views/Help.vue';
import MyAds from '../views/MyAds.vue';
import UserProfile from '../views/UserProfile.vue'
import Reports from '../views/Reports.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Domov',
        component: Domov,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile
    },
    {
        path: '/help',
        name: 'Help',
        component: Help
    },
    {
        path: '/ads',
        name: 'Ads',
        component: MyAds
    },
    {
        path: '/user-profile/:userId',
        name: 'UserProfile',
        component: UserProfile,
    },
    {
        path: '/reports',
        name: 'Reports',
        component: Reports
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
