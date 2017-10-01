//angular main component i.e. App
angular.module('app', [])
   .component('index' , {
   	controller : function() {
   		this.generatore = [1,2,3,4,5,6,7,8,9,10]; // this array to generate data in option from 0-10
   		var currentCities = []
   		this.cities;
   		this.find = function() {

            // get value from user  
   			var security = document.getElementById('security').value;
   			var cost = document.getElementById('cost').value;
   			var wheater = document.getElementById('weather').value;
   		
            //send data to server using POST
   			$.ajax({ 
   				type : 'POST',
   				url : 'http://127.0.0.1:3000/',
   				data : {cost : cost, security : security, wheater : wheater} ,
   				success : function(data) {
                   currentCities = [];
                //save data that come from sevre in currentCities
   					for (var i = 0; i < data.length; i++) {
   						currentCities.push(data[i])
   					}
   					
   				

   				}
   			})
            // save the data in currentCities in citiees
   			this.cities = currentCities;
   			
   		}
   	},


   	templateUrl :`./templates/choose.html`
   	

   })