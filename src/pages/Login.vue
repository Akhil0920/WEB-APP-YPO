<template  >
<section class="body">
<img src="C:\Use_case\VueJS\vue-project\src\assets\Logo.png"/>

    <div class="register">
            <!-- <input type="text" v-model="name" placeholder="Enter name"> -->
            <input type="text" v-model="email" placeholder="Enter email">
            <input type="password" v-model="password" placeholder="Enter Password">
            <button v-on:click="Login">Login</button>
            <br>
            <br>
            <p>
                <router-link to="/Sign-Up">Sign Up</router-link>
            </p>

    </div>
</section>
</template>

<script>
import axios, { formToJSON } from 'axios';

export default {
    name:'Login',
    // UserName:'',

    data()
    {
        return {
            email:'',
            password:'',
            UserName:'',
        }
    },
    methods:{
        async Login()
        {
            let result = await axios.get(
                `http://localhost:3000/users?email=${this.email}&password=${this.password}` 
            )
            if (result.status == 200 && result.data.length > 0) {
        localStorage.setItem("user-info", JSON.stringify(result.data[0]));
        // UserName = JSON.stringify(result.data.name)
        // Corrected navigation method
        this.$router.push({ name: 'CloseBuy' });
        alert(`Welcome ${this.email}`);
    }
            console.warn(this.email,this.password);
            console.warn(result)
        }
    },
    mounted(){

        // UserName = JSON.stringify(result.data.name);

        let user = localStorage.getItem('user-info')
        if(user)
        {
            this.$router.push({name: 'CloseBuy'});
            // alert(`Welcome${this.name}`);
        }
    }
}
</script>

<style >

.body{
        background: black;
    box-shadow: none;
    height: 100%;
}

    
</style>