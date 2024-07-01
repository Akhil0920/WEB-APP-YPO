import { createRouter, createWebHistory } from "vue-router";
import CloseBuy from "src/pages/CloseBuy.vue";
import SignUp from "src/pages/SignUp.Vue";
import Login from "src/pages/Login.vue";
// import test from "src/pages/test.vue"

Vue.use(router);
import Login from "src/pages/Login.vue";

const routes = [

    {
        name: "CloseBy",
        component: CloseBuy,
        path: "/"
    },
    {
        path: '/Sign-Up',
        name: 'SignUp',
        component: SignUp,
    },

    {
        name: "login",
        component: Login,
        path: "/Login"

    },

    {
        component:test,
        path:"/test"
    }

];

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_APP_ENV),
    routes,
});

export default router;