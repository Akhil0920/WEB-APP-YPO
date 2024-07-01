<template >
     
    
        
        <img src="C:\Use_case\VueJS\vue-project\src\assets\Logo.png"/>
   

        <div class="register">
            <input type="text" v-model="name" placeholder="Enter name">
            <input type="text" v-model="email" placeholder="Enter email">
            <input type="password" v-model="password" placeholder="Enter Password">
            <button v-on:click="signUp">Sign Up </button>
            <br>
            <br>
                <router-link to="/login" > Login</router-link>
            

        </div>
</template>

<script>
import axios from 'axios'

export default {
    name:'SignUp',
    data()
    {
        return{
            name:'',
            email:'',
            password:'',

        }
    },
    methods:{
         async signUp()
         {
             let result = await axios.post(
                "http://localhost:3000/users",{
                email:this.email,
                password:this.password,
                name:this.name
                }

             );
             console.warn(result);
             console.warn("signup",this.email,this.name,this.password);
             if(result.status==201)
             {
                 alert(`signup is done. Welcome${this.name}`)
                 localStorage.setItem("user-info",JSON.stringify(result.data));
                //  this.$router.push({name: 'Login'});
             }
         }
    },
    mounted(){

        let user = localStorage.getItem('user-info')
        if(user)
        {
            this.$router.push({name: 'CloseBuy'})
        }
    }
}
</script>

<style >

.register input{
    width: 300px;
    height: 40px;
    padding-left: 20px;
    margin-bottom: 30px;
    display: block;
    margin-right:auto;
    margin-left: auto;
    border: 1px solid #ff5a5f;
    border-radius: 5px;

}

.register button{
    width:320px;
    height: 40px;
    border:1px solid #ff5a5f;
  background-color: #ff5a5f;
  border-radius: 5px;
    /* background:skyblue; */
    color:#fff;
    cursor:pointer;


}

.register button:hover{
    background-color:rgb(180,0,0);
}

img{

    align-content: center;
    margin-top: 100px;
    margin-bottom: 100px;
    
}

a:link, a:visited {
  color:black;
  text-decoration: 1px solid ;
  cursor: pointer;
}

a:hover{
    color:white;
}

/* body{
    background: #ff5a5f;
} */
    
</style>