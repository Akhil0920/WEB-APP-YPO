<template>
<!-- <div id="app">
    <HereMap  :center="center" />
  </div> -->

  <!-- <div id="layout">
    <div id="sidebar">
    </div>
  </div> -->
  <!-- <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div> -->
  
  <!-- <HelloWorld msg="Vite + Vue" /> -->
  <!-- <CloseBuy /> -->
  
  <!-- <test/> -->
  <!-- <UserLocationVue /> -->
  <!-- <mapbox /> -->
   
    <router-view />
 

  <!-- <SignUp /> -->
</template>


<script setup>
// import HelloWorld from './components/HelloWorld.vue'

import UserLocationVue from './pages/UserLocation.vue'
import CloseBuy from './pages/CloseBuy.vue'
import test from './pages/test.vue'
import HereMap from './components/HereMap.vue'
import mapbox from './pages/mapbox.vue'


import 'primeicons/primeicons.css'
import Signup from './pages/Signup.vue'
import Login from './pages/Login.vue'





// import HereMap from './pages/HereMap.vue';



// const center = {
//  lat: 40.730610,
//  lng: -73.935242
// };


// import routes from './routes/index.js'

</script>




<style >

/* .logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
} */

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 5px;
}
/* #layout {
  flex: 1;
  display: flex;
  position: relative;
} */

/* #sidebar {
  background-color: rgb(35 55 75 / 90%);
  color: #fff;
  padding: 6px 12px;
  font-family: monospace;
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  margin: 12px;
  border-radius: 4px;
} */



</style>
