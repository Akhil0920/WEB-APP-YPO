import { createApp } from 'vue'

/* import the fontawesome core */
// import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
// import { all } from '@awesome.me/kit-KIT_CODE'

/* add icons to the library */
// library.add(...all)

import { createRouter, createWebHistory } from 'vue-router'

import './style.css'
import App from './App.vue'

import CloseBuy from "./pages/CloseBuy.vue"
// import router from './routes/routers'
import testVue from './pages/test.vue'
import LoginVue from './pages/Login.vue'
import SignupVue from './pages/Signup.vue'

const routes = [
    { name:CloseBuy,path: '/',component: CloseBuy},
    { name: testVue,path: '/test',component:testVue},
    { name: LoginVue,path:'/Login',component:LoginVue},
    { name: SignupVue,path:'/Sign-Up',component:SignupVue},

     {
        path: '/close-buy',
        name: 'CloseBuy',
        component: () => import('./pages/CloseBuy.vue') // Adjust the path according to your project structure
    },
    {
        path: '/Login',
        name: 'Login',
        component: () => import('./pages/Login.vue') // Adjust the path according to your project structure
    }
];

const router = createRouter({
    history:createWebHistory(),
    routes
});

createApp(App).use(router).mount('#app')
// App.component('font-awesome-icon', FontAwesomeIcon)