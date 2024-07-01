<template>
  <section class="ui two column centered grid">
    <div class="column red">
      <form class="ui message large form">
        <div class="ui message red" v-show="error">{{ error }}</div>
        <div class="ui segment">
          <div class="field">
            <div
              class="ui input right large icon"
              :class="{ loading: spinner }"
            >
              <input
                type="text"
                placeholder="Enter your address"
                v-model="address"
                id = "autocomplete"
              />
              <i class="dot circle link icon" @click="locatorButtonPressed"></i>
            </div>
          </div>
          <button class="ui button">Go</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      address: "",
      error: "",
      spinner: false,
    };
  },
  async mounted() {
 const inputElement = document.getElementById('autocomplete');
 if (inputElement) {
    // Listen for the input event on the autocomplete input element
    inputElement.addEventListener('input', async () => {
      const inputValue = inputElement.value; // Get the current value of the input

      // const axios = require('axios');
      const options = {
        method: 'GET',
        url: 'https://map-places.p.rapidapi.com/queryautocomplete/json',
        params: {
          input: inputValue, // Use the input value here
          radius: '50000'
        },
        headers: {
          'X-RapidAPI-Key': '82a3ddbe67msh38b4e5cf2ce19a5p1354fejsnea5f5e21e986',
          'X-RapidAPI-Host': 'map-places.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        console.log(response.data);
        // Here you can process the response data to display autocomplete suggestions
      } catch (error) {
        console.error(error);
      }
    });
 }
},





//   async mounted(){

//     const input = document.getElementById('autocomplete');
//      if (input) {
//     const autocomplete = new autocomplete(input);

//     const axios = require('axios');

// const options = {
//   method: 'GET',
//   url: 'https://map-places.p.rapidapi.com/queryautocomplete/json',
//   params: {
//     input: `${autocomplete}`,
//     radius: '50000'
//   },
//   headers: {
//     'X-RapidAPI-Key': '82a3ddbe67msh38b4e5cf2ce19a5p1354fejsnea5f5e21e986',
//     'X-RapidAPI-Host': 'map-places.p.rapidapi.com'
//   }
// };

// try {
// 	const response = await axios.request(options);
// 	console.log(response.data);
// } catch (error) {
// 	console.error(error);
// }
//     // new google.maps.places.Autocomplete(
//     //   document.getElementById("autocomplete")
//     // )
//   }
//   },

  methods: {
    locatorButtonPressed() {
      this.spinner = true;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;
            console.log(lat, long);

            // Use the lat and long to make a request to the reverse geocoding API
            const option = {
              method: "GET",
              url: "https://trueway-geocoding.p.rapidapi.com/ReverseGeocode",
              params: {
                location: `${lat},${long}`,
                language: "en",
              },
              headers: {
                "X-RapidAPI-Key":
                  "82a3ddbe67msh38b4e5cf2ce19a5p1354fejsnea5f5e21e986",
                "X-RapidAPI-Host": "trueway-geocoding.p.rapidapi.com",
              },
            };

            axios(option)
              .then((response) => {
                this.address = response.data.results[0].address;
                this.spinner=false;
                // console.log(response.data.results[0].address); // Process the response data
              })
              .catch((error) => {
                this.error = error;
                // console.error(error); // Handle the error
              });
          },
          (error) => {
            this.error = error.message;
            this.spinner=false;
            // console.log(error.message);
          }
        );
      } else {
        this.error = error.message;
        this.spinner=false;
        console.log("Your Browser dosen't support geo location api ");
      }
    },
  },
};
</script>

<style >
.ui.button,
.dot.circle.icon {
  background-color: #ff5a5f;
  color: white;
}
</style>