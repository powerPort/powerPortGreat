angular.module('app', [
  'ngRoute',
  'app.cityInfoView',
  'app.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}])
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

			$.ajax({ 
				type : 'POST',
				url : "http://127.0.0.1:3000/" ,
				data : {cost : cost, security : security, wheater : wheater} ,
				success : function(data) {
                currentCities = data
				}
			})
         // save the data in currentCities in citiees
			this.cities = currentCities;
		}
	},


	templateUrl :`./templates/choose.html`
	

})