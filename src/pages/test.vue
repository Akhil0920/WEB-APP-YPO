<template>
<div>
 <section class="ui two column centered grid" style="position:relative; z-index: 1;">
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
                v-model="searchQuery"
                
                id="autocomplete"
              />
              <i class="dot circle link icon" @click="locatorButtonPressed"></i>
              <!-- <div v-if="suggestions.length > 0" class="suggestions">
                <div v-for="(suggestion, index) in suggestions" :key="index" @click="selectSuggestion(suggestion)">
                 {{ suggestion.description }}
                </div>
              </div> -->
            </div>
          </div>
          <div v-if="suggestions.length > 0" class="suggestions">
 <div v-for="(suggestion, index) in suggestions" :key="index" @click="selectSuggestion(suggestion)">
    {{ suggestion }}
 </div>
</div>
          <button class="ui button">Go</button>
        </div>
      </form>
    </div>
 </section>
 <section >
   <div ref="mapContainer" class="map-container"></div>

 </section>
</div>
</template>

<script>
import axios from "axios";

import mapboxgl from "mapbox-gl";
mapboxgl.accessToken = "pk.eyJ1IjoiYWtoaWwwOTIwIiwiYSI6ImNsdG44OTF6azAzbTcycm80cnJtYmhyZTcifQ.B_tDl83qfJsEGcsKLwQyFg"


export default {
 data() {
    return {
      searchQuery: "",
      suggestions: [],
      error: "",
      spinner: false,
      map: null, // Add this line to hold the Mapbox GL JS map instance
    };
 },
 mounted() {
    this.$watch('searchQuery', async (newQuery) => {
      if (newQuery) {
        let lat = 0;
        let long = 0;
          if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              lat = position.coords.latitude;
              long = position.coords.longitude;
            },
            (error) => {
              console.error(error);
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
        }


        const options = {
          method: 'GET',
          url: 'https://local-business-data.p.rapidapi.com/autocomplete',
          params: {
            query: newQuery, // Static query as per the new code snippet
            region: 'us',
            language: 'en',
            coordinates: `${lat},${long}`, // Use the latitude and longitude obtained from geolocation
          },
          headers: {
            'X-RapidAPI-Key': '82a3ddbe67msh38b4e5cf2ce19a5p1354fejsnea5f5e21e986',
            'X-RapidAPI-Host': 'local-business-data.p.rapidapi.com'
          }
        };

        try {
          const response = await axios.request(options);
          console.log(response.data); // Log the response data
          const descriptions = response.data.data.map(item => item.description);
          console.log("Descriptions:", descriptions);

         // Assign the array of descriptions to this.suggestions
        this.suggestions = descriptions;
        } catch (error) {
          console.error(error);
        }
      } else {
        this.suggestions = [];
      }
    });

    // Initialize the Mapbox GL JS map
    // this.map = new mapboxgl.Map({
    //   container: this.$refs.mapContainer,
    //   style: "mapbox://styles/mapbox/streets-v12", // Replace with your preferred map style
    //   // center: [-71.224518, 42.213995],
    //   center: `${lat},${long}` ,
    //   zoom: 9,
    // });
 },
 unmounted() {
    // Remove the Mapbox GL JS map when the component is unmounted
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
 },
 methods: {
    locatorButtonPressed() {
       this.spinner = true;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;
            console.log(lat, long);

              if (this.map) {
          this.map.setCenter([long, lat]); // Note: Mapbox GL JS uses [longitude, latitude] format
        }

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
                // this.address = response.data.results[0].address;
                this.searchQuery = response.data.results[0].address;

                // console.log( response.data.results[0].address);
                this.spinner=false;
              })
              .catch((error) => {
                this.error = error;
                this.spinner=false;
              });
          },
          (error) => {
            this.error = error.message;
            this.spinner=false;
          }
        );
      } else {
        this.error = "Your Browser doesn't support geo location API";
        this.spinner=false;
      }
      this.map = new mapboxgl.Map({
      container: this.$refs.mapContainer,
      style: "mapbox://styles/mapbox/streets-v12", // Replace with your preferred map style
      // center: [-71.224518, 42.213995],
      // center: lat, long ,
      zoom: 16,
    });
    },
    
    selectSuggestion(suggestion) {
     this.searchQuery = suggestion.description;
      this.suggestions = [];
    }
 },
};

</script>

<style>
.ui.button,
.dot.circle.icon {
 background-color: #ff5a5f;
 color: white;
}
.suggestions {
 border: 1px solid #ccc;
 border-radius: 4px;
 padding: 10px;
 max-height: 200px;
 overflow-y: auto;
}
.suggestions div {
 cursor: pointer;
 padding: 5px;
}
.suggestions div:hover {
 background-color: #f1f1f1;
}

.map-container{ 
position: absolute;
top:0;
left:0;
right:0;
bottom:0;
/* background:red; */

}
</style>
