<template>
  <div class="ui grid " style="height:790px">
    <div class="six wide column">
      <form class="ui segment large form">
        <div class="ui message red" v-show="error">{{error}}</div>
        <div class="ui segment">
          <div class="field">
            
            <div class="ui right icon input large" :class="{loading:spinner}">
              <i class="pi pi-microphone" 
                style="font-size: 30px;background-color: #ff5a5f;color: white;padding-top:7px;border-radius:5px;align-item:left"
                @click="toggleSpeechRecognition" ></i>
              <input  style="width:500px"
                type="text"
                placeholder="Enter your address"
                v-model="address"
                ref="autocomplete"
                class="pi-delete-left" 
                
              />

              <i class="dot circle link icon" @click="locatorButtonPressed"></i>

              <!-- <button @click="clearInput">Clear</button> -->
              
               
            </div>
            <i class="pi-times-circle" @click="clearInput"></i> 
            ===
            
            
            
      <!-- <span class="pi pi-microphone" style="font-size: 50px" @click="toggleSpeechRecognition"></span> -->

              
                
               
              
    <!-- <form @submit.prevent="submitSearch" method="get" target="_blank"> -->
      <!-- <input v-model="address" type="text" placeholder="Search Google..." autocomplete="" autofocus> -->
      <!-- <i class=" mic icon" > </i> -->
      
    <!-- </form> -->
    <div class="container">
      
    <p class="info">{{ speechCommands }}</p>
  </div>
          </div>

          <div class="field">
            <div class="two fields">
              <div class="field">
                <select v-model="type">
                  <option value="bakery">Bakery</option>
                  <option value="bus_station">Bus Stop</option>
                  <option value="car_repair">Car Mechanic</option>
                  <option value="electritian">Electritian</option>
                  <option value="furninture_store">Furninture</option>
                  <option value="hospital">Hospital</option>
                  <option value="plumber">Plumber</option>
                  <option value="painter">Painter</option>
                  <option value="school">schools</option>

                </select>
              </div>

              <div class="field">
                <select v-model="radius">
                  <option value="5">5KM</option>
                  <option value="10">10KM</option>
                  <option value="15">15KM</option>
                  <option value="20">20KM</option>
                </select>
              </div>
            </div>
          </div>

          <button class="ui button" @click="findCloseByButtonPressed">Find CloseBy Places</button>
        </div>
      </form>

      <div class="ui segment" style="max-height:500px;overflow:auto;">
        <div class="ui divided items">
          <div
            class="item"
            v-for="(place, index) in places"
            :key="place.id"
            @click="showInfoWindow(index)"
            :class="{'active' : activeIndex === index}"
            style="padding:10px;cursor: pointer;"
          >
            <div class="content">
              <div class="header">{{place.name}}</div>
              <div class="meta">{{place.vicinity}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ten wide column" ref="map" id="map"></div>
  </div>
</template>


<script>

// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import axios from "axios";
import GmapCustomMarker from 'vue3-gmap-custom-marker';

export default {
  data() {
    return {
      address: "",
      error: "",
      spinner: false,
      mic: false,
      apiKey: "AIzaSyDeIayAGSTgrPW6h4AxzPJ3PjAas3f4BPs",
      lat: 0,
      lng: 0,
      type: "",
      radius: "",
      places: [],
      markers: [],
      activeIndex: -1,
      infoWindow: null, // Initialize a single InfoWindow instance
      userLocationMarker: null,
      map: null, // Google Maps instance
      // searchQuery: '',
      speechRecognitionSupported: false,
      speechCommands: 'Voice Commands: "stop recording", "reset input", "go"',
      // micIcon: 'fas fa-microphone'
      // inputValue: '', // Your input value

    };
  },
    components: {
      'gmap-custom-marker': GmapCustomMarker
  },

  mounted() {

        var autocomplete = new google.maps.places.Autocomplete(
        this.$refs["autocomplete"],
        {
          bounds: new google.maps.LatLngBounds(
             new google.maps.LatLng(17.52516, 78.30534)
          ),
        }
      );
  
      autocomplete.addListener("place_changed", () => {
        var place = autocomplete.getPlace();
        this.lat=place.geometry.location.lat();
        this.lng=place.geometry.location.lng();
        this.showLocationOnTheMap(
          place.geometry.location.lat(),
          place.geometry.location.lng()
        );
      });

      let user = localStorage.getItem('user-info')
        if(user)
        {
            this.$router.push({name: 'CloseBuy'})
        }
        else
        {
          alert("Please Login First");
            this.$router.push({name: 'Login'});
        }

      



    
    // new google.maps.places.Autocomplete(this.$refs["autocomplete"], {
    //   bounds: new google.maps.LatLngBounds(
    //     new google.maps.LatLng(17.52516, 78.30534)
    //   )
    // });
    
     this.infoWindow = new google.maps.InfoWindow();

    //  this.locatorButtonPressed();

     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.speechRecognitionSupported = true;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.lang = 'en-US';
      this.recognition.addEventListener('result', this.handleSpeechResult);
    }
  },

  methods: {
    
locatorButtonPressed() {
 this.spinner = true;
 this.markers.forEach(marker => marker.setMap(null));
 this.markers = [];

 if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;

        // Initialize the map if it hasn't been initialized yet
        if (!this.map) {
          if (window.google && window.google.maps) {
            this.map = new google.maps.Map(document.getElementById("map"), {
              zoom: 16,
              center: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
              mapTypeId: google.maps.MapTypeId.ROADMAP,
            });
          } else {
            console.error("Google Maps JavaScript library is not loaded.");
            return; // Exit if Google Maps is not loaded
          }
        }

        const image = "src/assets/plumber.svg";


        // Create a marker for the user's location
        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(this.lat, this.lng),
          
          // label: labels[labelIndex++ % labels.length],
          

          map: this.map, // Use the map instance stored in this.map
          icon: {
            url : "src/assets/user.svg",
            scaledSize: new google.maps.Size(38,38)
          },
          animation: google.maps.Animation.DROP
        });
        this.infoWindow = new google.maps.InfoWindow({
          content: "Your Here",
          
        });
        // this.infoWindow.open(map, marker);

        marker.addListener("click", () =>{
          this.infoWindow.open(map, marker);
        });

        this.markers.push(marker);
      // else {
      //   console.error("Google Maps JavaScript library is not loaded.");
      // }

            //  if (this.map) {
            //   this.map.setCenter({ lat: this.lat, lng: this.lng });
            // }

            // Create a marker for the user's location
            // if (this.userLocationMarker) {
            //   this.userLocationMarker.setMap(null); // Remove the old marker
            // }
            // this.userLocationMarker = new window.google.maps.Marker({
            //   position: { lat: this.lat, lng: this.lng },
            //   map: this.map,
            //   title: 'Your Location',
            // });

        //        const userLocationMarker = new google.maps.Map({
        //   position: { lat: this.lat, lng: this.lng },
        //    map: this.map,
        //       title: 'Your Location'
         
        // });

            this.getAddressFrom(
              position.coords.latitude,
              position.coords.longitude
            );
          },
          error => {
            this.error =
              "Locator is unable to find your address. Please type your address manually.";
            this.spinner = false;
            // console.log(error.message);
          }
        );
      } else {
        this.error = error.message;
        this.spinner = false;
        console.log("Your browser does not support geolocation API ");
      }
    },
    getAddressFrom(lat, long) {
      axios
        .get(
          "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
            lat +
            "," +
            long +
            "&key=" +
            this.apiKey
        )
        .then(response => {
          if (response.data.error_message) {
            this.error = response.data.error_message;
            console.log(response.data.error_message);
          } else {
            this.address = response.data.results[0].formatted_address;
            // console.log(response.data.results[0].formatted_address);
          }
          this.spinner = false;
        })
        .catch(error => {
          this.error = error.message;
          this.spinner = false;
          console.log(error.message);
        });
    },
    showLocationOnTheMap(latitude, longitude) {
        // Show & center the Map based oon
        var map = new google.maps.Map(this.$refs["map"], {
          zoom: 15,
          center: new google.maps.LatLng(latitude, longitude),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
        });

        // const image = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
  
        new google.maps.Marker({
          position: new google.maps.LatLng(latitude, longitude),
          map: map,
         icon: {
            url : "src/assets/user.svg",
            scaledSize: new google.maps.Size(38,38)
          },
          animation: google.maps.Animation.DROP,
        });
      },
    // findCloseByButtonPressed(event) {
    //   event.preventDefault();
    //   const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
    //     this.lat
    //   },${this.lng}&type=${this.type}&radius=${this.radius * 1000}&key=${
    //     this.apiKey
    //   }`;

    //   axios
    //     .get(URL)
    //     .then(response => {
    //       this.places = response.data.results;
    //       this.showPlacesOnMap();
    //       console.log(response);
    //     })
    //     .catch(error => {
    //       this.error = error.message;
    //     });
    // },
    findCloseByButtonPressed(event) {
 event.preventDefault();
 // Clear old markers and infoWindow
 this.markers.forEach(marker => marker.setMap(null));
 this.markers = [];
 
//  this.infoWindow.close();

 // Make the API call
 const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.lat},${this.lng}&type=${this.type}&radius=${this.radius * 1000}&key=${this.apiKey}`;

 axios.get(URL)
    .then(response => {
      this.places = response.data.results;
      this.showPlacesOnMap();
    })
    .catch(error => {
      this.error = error.message;
    });
},
    showPlacesOnMap() {
      const map = new google.maps.Map(this.$refs["map"], {
        zoom: 15,
        center: new google.maps.LatLng(this.lat, this.lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        
      });
      new google.maps.Marker({
          position: new google.maps.LatLng(this.lat, this.lng),
          map: map,
         icon: {
            url : "src/assets/user.svg",
            scaledSize: new google.maps.Size(38,38)
          },
          animation: google.maps.Animation.DROP,
        });
        

      const infoWindow = new google.maps.InfoWindow();

      for (let i = 0; i < this.places.length; i++) {
        const lat = this.places[i].geometry.location.lat;
        const lng = this.places[i].geometry.location.lng;
        const placeID = this.places[i].place_id;

        const iconMap = {
      // bakery: "src/assets/bakery.svg",
      bus_station: "src/assets/bus-stop.svg",
      car_repair: "src/assets/technician.svg",
      electritian: "src/assets/electrician.svg",
      furniture_store: "src/assets/furniture.svg",
      hospital: "src/assets/hospital.svg",
      plumber: "src/assets/plumber.svg",
      painter: "src/assets/painter.svg",
      school: "src/assets/education.svg",
    };

    const iconUrl = iconMap[this.type];

        const marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat, lng),
          map: map,
          icon: {
            url : iconUrl,
            scaledSize: new google.maps.Size(38,38)
          },
          animation: google.maps.Animation.DROP,
      
        });

        this.markers.push(marker);

        google.maps.event.addListener(marker, "click", () => {
          const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?key=${this.apiKey}&place_id=${placeID}`;

          axios
            .get(URL)
            .then(response => {
              if (response.data.error_message) {
                this.error = response.data.error_message;
              } else {
                const place = response.data.result;

                infoWindow.setContent(
                  `<div class ="ui header">${this.places[i].name}</div>
                <td>Address:${place.formatted_adddress}</td> <br>
                <td>Phone Number:${place.formatted_phone_number}</td><br>
                Website:<a href = "${place.website}" target =" _blank">${place.website}</a> `
                );
                infoWindow.open(map, marker);
                 map.setZoom(15);
            map.setCenter(marker.getPosition());
              }
              //   infoWindow.setContent(`<div class ="ui header">${this.places[i].name}</div>
              //   <td>Address:${place.formatted_adddress}</td> <br>
              //   <td>Phone Number:${place.formatted_phone_number}</td><br>
              //   <a href = "${place.website}" target =" _blank">Website:${place.website}</a> `);
              // }
            })
            .catch(error => {
              this.error = error.message;
            });
        });
      }
    },

    showInfoWindow(index) {
      this.activeIndex = index;
      new google.maps.event.trigger(this.markers[index], "click");

      // Set the zoom level of the map
 // Assuming 'this.map' is your Google Maps object
 // and you want to zoom in to a specific level, e.g., 15
//  this.map.setZoom(20);
  
 // Optionally, you can also center the map on the marker
 // This is useful if you want the marker to be in the center of the map
//  this.map.setCenter(this.markers[index].getPosition());
      
    },

    toggleSpeechRecognition() {
      
      if (this.recognition) {
        if (this.recognition.running) {
          this.recognition.stop();
          
          // this.micIcon = 'fas fa-microphone';
        } else {
          this.recognition.start();
          // this.micIcon = 'fas fa-microphone-slash';
        }
      }
    },
    handleSpeechResult(event) {
      const transcript = event.results[0][0].transcript.trim().toLowerCase();
      if (transcript === 'stop recording') {
        this.recognition.stop();
      } else if (!this.address) {
        this.address = transcript;
      } else {
        if (transcript === 'go') {
          this.submitSearch();
        } else if (transcript === 'reset input') {
          this.address = '';
        } else {
          this.address = transcript;
        }
      }
    },
    submitSearch() {

      if (this.address) {
        // Perform search action
        // For now, just log the search query
        console.log('Searching for:', this.address);
      }
    },
      clearInput() {
      this.address = ''; // Clear the input value
    },
  }
};
</script>


<style>
.ui.button,
.dot.circle.icon,
.pi .pi-microphone {
  background-color: #ff5a5f;
  color: white;
}

/* .pac-icon {
  display: none;
} */

/* .pac-item {
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
} */

/* .pac-item:hover, {
  background-color: #ececec;
} */

.pac-item-query {
  font-size: 16px;
  
}

/* .active {
  background: #ff5a5f !important;
} */

.container {
  padding: 30px 50px;
}
</style>